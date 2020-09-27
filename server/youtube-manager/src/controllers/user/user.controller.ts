import { Controller, Get, HttpService, Post } from '@nestjs/common';
import { Logger } from '@nestjs/common/services/logger.service';
import { Observable } from 'rxjs';
import { environment } from '../../config/environment';

@Controller('user')
export class UserController {

  private logger = new Logger('User Controller');

  constructor(private http: HttpService) { }

  @Get('auth')
  authenticate(): Observable<any> {
    return this.http.get<any>(`${environment.accountsPath}/auth`);
  }

}
