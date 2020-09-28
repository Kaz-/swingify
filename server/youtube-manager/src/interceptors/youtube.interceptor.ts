import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  NotFoundException,
  ForbiddenException,
  UnauthorizedException,
  HttpException,
  Logger,
  BadRequestException,
  InternalServerErrorException,
  BadGatewayException
} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()
export class YoutubeInterceptor implements NestInterceptor {

  private logger = new Logger('YouTube Global Interceptor');

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      catchError(err => {
        const error: { status: number, message: string } = err.response.data.error;
        this.logger.error(`An error was thrown: ${error.status} - ${error.message}`);
        return throwError(this.handleError(error));
      })
    );
  }

  handleError(error: { status: number, message: string }): HttpException {
    switch (error.status) {
      case 400:
        return new BadRequestException(error.message);
      case 401:
        return new UnauthorizedException(error.message);
      case 403:
        return new ForbiddenException(error.message);
      case 500:
        return new InternalServerErrorException(error.message);
      case 504:
        return new BadGatewayException(error.message);
      case 404:
      default:
        return new NotFoundException(error.message);
    }
  }

}
