import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();

    // Intentamos extraer los detalles específicos del mensaje de error
    const exceptionResponse: any = exception.getResponse();
    const message =
      exceptionResponse.message instanceof Array
        ? exceptionResponse.message
        : [exceptionResponse.message];

    // Aquí implementamos el mensaje de error personalizado:
    response.status(status).json({
      statusCode: status,
      message: message.length > 0 ? message : exception.message,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}
