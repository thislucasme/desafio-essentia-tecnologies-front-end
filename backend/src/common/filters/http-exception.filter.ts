import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { QueryFailedError } from 'typeorm';

interface ExceptionResponse {
  message?: string | string[];
  error?: string;
}

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const context = host.switchToHttp();
    const response = context.getResponse<Response>();
    const request = context.getRequest<Request>();
    const isDuplicateEntry =
      exception instanceof QueryFailedError &&
      (exception.driverError as { code?: string }).code === 'ER_DUP_ENTRY';
    const status = isDuplicateEntry
      ? HttpStatus.CONFLICT
      : exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;
    const exceptionResponse = isDuplicateEntry
      ? { message: 'Já existe um registro com os dados informados.' }
      : exception instanceof HttpException
        ? exception.getResponse()
        : { message: 'Erro interno do servidor.' };
    const details =
      typeof exceptionResponse === 'string'
        ? { message: exceptionResponse }
        : (exceptionResponse as ExceptionResponse);

    if (status >= 500) {
      this.logger.error(exception instanceof Error ? exception.stack : exception);
    }

    response.status(status).json({
      statusCode: status,
      message: details.message ?? 'Não foi possível processar a solicitação.',
      error: details.error,
      path: request.url,
      timestamp: new Date().toISOString(),
    });
  }
}
