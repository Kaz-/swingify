import { Injectable, HttpService } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AxiosResponse } from 'axios';

import { environment } from 'environment';

@Injectable()
export class AuthService {

    constructor(private httpService: HttpService) { }

    authorize(): Observable<AxiosResponse<any>> {
        return this.httpService.get(`${environment.spotify.accountsPath}/authorize?client_id=${environment.spotify.clientId}` +
            `&response_type=code&redirect_uri=http%3A%2F%2Flocalhost%3A7200`)
            .pipe(map(response => response.data));
    }

}