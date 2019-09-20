import { Config } from './../config/config';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthData } from '../auth/auth-data.model';


@Injectable({
  providedIn: 'root'
})
export class PasswordResetMailerService {

  constructor(private http: HttpClient) { }

  sendMail(recipientMail) {
    return this.http.post(Config.API_ENDPOINT + 'mailer/resetlink', { email: recipientMail });
  }
}
