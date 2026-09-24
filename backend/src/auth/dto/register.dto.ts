import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class RegisterDto {
  @ApiProperty({ example: 'Lucas Dias' })
  @IsString({ message: 'O nome deve ser um texto.' })
  @MinLength(2, { message: 'O nome deve ter pelo menos 2 caracteres.' })
  @MaxLength(120, { message: 'O nome deve ter no máximo 120 caracteres.' })
  name: string;

  @ApiProperty({ example: 'lucas@email.com' })
  @IsEmail({}, { message: 'Informe um e-mail válido.' })
  @MaxLength(180, { message: 'O e-mail deve ter no máximo 180 caracteres.' })
  email: string;

  @ApiProperty({ example: 'senha123', minLength: 6 })
  @IsString({ message: 'A senha deve ser um texto.' })
  @MinLength(6, { message: 'A senha deve ter pelo menos 6 caracteres.' })
  @MaxLength(72, { message: 'A senha deve ter no máximo 72 caracteres.' })
  password: string;

  @ApiProperty({
    description: 'Token gerado pelo widget Cloudflare Turnstile.',
    example: '0.Abc123...',
  })
  @IsString({ message: 'O token de segurança deve ser um texto.' })
  @IsNotEmpty({ message: 'Conclua a verificação de segurança.' })
  @MaxLength(2048, { message: 'O token de segurança é inválido.' })
  turnstileToken: string;
}
