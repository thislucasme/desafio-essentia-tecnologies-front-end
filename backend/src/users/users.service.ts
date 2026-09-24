import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  findById(id: string): Promise<User | null> {
    return this.usersRepository.findOneBy({ id });
  }

  findByEmail(email: string, includePassword = false): Promise<User | null> {
    const query = this.usersRepository.createQueryBuilder('user').where('user.email = :email', {
      email: email.trim().toLowerCase(),
    });

    if (includePassword) {
      query.addSelect('user.passwordHash');
    }

    return query.getOne();
  }

  create(data: Pick<User, 'name' | 'email' | 'passwordHash'>): Promise<User> {
    const user = this.usersRepository.create({
      ...data,
      name: data.name.trim(),
      email: data.email.trim().toLowerCase(),
    });
    return this.usersRepository.save(user);
  }
}
