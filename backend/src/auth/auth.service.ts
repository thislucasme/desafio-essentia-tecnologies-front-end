import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { compare, hash } from 'bcryptjs';
import { User } from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';
import { TurnstileService } from '../common/services/turnstile.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { JwtPayload } from './interfaces/jwt-payload.interface';

export interface AuthResponse {
  accessToken: string;
  user: Omit<User, 'passwordHash' | 'tasks'>;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly config: ConfigService,
    private readonly turnstileService: TurnstileService,
  ) {}

  async register(dto: RegisterDto, remoteIp?: string): Promise<AuthResponse> {
    await this.turnstileService.verify(dto.turnstileToken, 'cadastro', remoteIp);
    const existingUser = await this.usersService.findByEmail(dto.email);

    if (existingUser) {
      throw new ConflictException('Já existe uma conta cadastrada com este e-mail.');
    }

    const user = await this.usersService.create({
      name: dto.name,
      email: dto.email,
      passwordHash: await hash(dto.password, 12),
    });

    return this.createAuthResponse(user);
  }

  async login(dto: LoginDto, remoteIp?: string): Promise<AuthResponse> {
    await this.turnstileService.verify(dto.turnstileToken, 'login', remoteIp);
    const user = await this.usersService.findByEmail(dto.email, true);

    if (!user || !(await compare(dto.password, user.passwordHash))) {
      throw new UnauthorizedException('E-mail ou senha incorretos.');
    }

    return this.createAuthResponse(user);
  }

  private async createAuthResponse(user: User): Promise<AuthResponse> {
    const payload: JwtPayload = { sub: user.id, email: user.email };
    const accessToken = await this.jwtService.signAsync(payload, {
      expiresIn: this.config.get('JWT_EXPIRES_IN', '1d'),
    });
    const { passwordHash: _passwordHash, tasks: _tasks, ...safeUser } = user;

    return { accessToken, user: safeUser };
  }
}
