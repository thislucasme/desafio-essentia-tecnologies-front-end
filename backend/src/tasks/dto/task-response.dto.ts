import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { TaskStatus } from '../entities/task.entity';

export class TaskResponseDto {
  @ApiProperty({ example: 'b7ca1d49-a72c-4e14-916b-4ab768e391d9' })
  id: string;

  @ApiProperty({ example: 'Estudar Angular' })
  title: string;

  @ApiPropertyOptional({ example: 'Revisar formulários reativos e signals.', nullable: true })
  description: string | null;

  @ApiProperty({ enum: TaskStatus, example: TaskStatus.IN_PROGRESS })
  status: TaskStatus;

  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000' })
  userId: string;

  @ApiProperty({ example: '2026-09-24T20:00:00.000Z' })
  createdAt: Date;

  @ApiProperty({ example: '2026-09-24T20:15:00.000Z' })
  updatedAt: Date;
}

export class PaginationMetaDto {
  @ApiProperty({ example: 1 })
  page: number;

  @ApiProperty({ example: 2 })
  limit: number;

  @ApiProperty({ example: 5 })
  totalItems: number;

  @ApiProperty({ example: 3 })
  totalPages: number;
}

export class PaginatedTasksResponseDto {
  @ApiProperty({ type: TaskResponseDto, isArray: true })
  data: TaskResponseDto[];

  @ApiProperty({ type: PaginationMetaDto })
  meta: PaginationMetaDto;
}
