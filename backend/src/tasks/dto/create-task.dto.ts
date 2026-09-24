import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';
import { TaskStatus } from '../entities/task.entity';

export class CreateTaskDto {
  @ApiProperty({ example: 'Estudar Angular' })
  @IsString({ message: 'O título deve ser um texto.' })
  @MinLength(1, { message: 'O título é obrigatório.' })
  @MaxLength(180, { message: 'O título deve ter no máximo 180 caracteres.' })
  title: string;

  @ApiPropertyOptional({ example: 'Estudar signals e formulários reativos.' })
  @IsOptional()
  @IsString({ message: 'A descrição deve ser um texto.' })
  @MaxLength(2000, { message: 'A descrição deve ter no máximo 2000 caracteres.' })
  description?: string;

  @ApiPropertyOptional({ enum: TaskStatus, default: TaskStatus.PENDING })
  @IsOptional()
  @IsEnum(TaskStatus, { message: 'O status informado é inválido.' })
  status?: TaskStatus;
}
