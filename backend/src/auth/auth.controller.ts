import { Body, Controller, Get, HttpCode, HttpStatus, Post, UseGuards } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { ErrorResponseDto } from '../common/dto/error-response.dto';
import { User } from '../users/entities/user.entity';
import { AuthService } from './auth.service';
import { AuthResponseDto } from './dto/auth-response.dto';
import { CurrentUser } from './decorators/current-user.decorator';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { UserResponseDto } from './dto/user-response.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@ApiTags('Autenticação')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('cadastro')
  @ApiOperation({ summary: 'Cadastrar um novo usuário' })
  @ApiCreatedResponse({ description: 'Usuário cadastrado e autenticado.', type: AuthResponseDto })
  @ApiBadRequestResponse({ description: 'Dados de cadastro inválidos.', type: ErrorResponseDto })
  @ApiConflictResponse({ description: 'E-mail já cadastrado.', type: ErrorResponseDto })
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Entrar com e-mail e senha' })
  @ApiOkResponse({ description: 'Login realizado com sucesso.', type: AuthResponseDto })
  @ApiBadRequestResponse({ description: 'Dados de login inválidos.', type: ErrorResponseDto })
  @ApiUnauthorizedResponse({ description: 'E-mail ou senha incorretos.', type: ErrorResponseDto })
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @Get('perfil')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Consultar o usuário autenticado' })
  @ApiOkResponse({ description: 'Dados do usuário autenticado.', type: UserResponseDto })
  @ApiUnauthorizedResponse({
    description: 'Token ausente, inválido ou expirado.',
    type: ErrorResponseDto,
  })
  profile(@CurrentUser() user: User): User {
    return user;
  }
}
