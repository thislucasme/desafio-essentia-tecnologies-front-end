import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ErrorResponseDto {
  @ApiProperty({ example: 400 })
  statusCode: number;

  @ApiProperty({
    oneOf: [
      { type: 'string', example: 'Não foi possível processar a solicitação.' },
      { type: 'array', items: { type: 'string' }, example: ['O título é obrigatório.'] },
    ],
  })
  message: string | string[];

  @ApiPropertyOptional({ example: 'Bad Request' })
  error?: string;

  @ApiProperty({ example: '/api/tarefas' })
  path: string;

  @ApiProperty({ example: '2026-09-24T20:00:00.000Z' })
  timestamp: string;
}
