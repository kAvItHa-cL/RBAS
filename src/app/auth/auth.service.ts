import { AuthData } from './auth-data.model';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';
import { Config } from '../config/config';

@Injectable({ providedIn: 'root' })
export class AuthService {



  private token: string;
  private tokenTimer: any;
  private isAuthenticated = false;
  private userId: string;
  private authStatusListenenr = new Subject<boolean>();

  constructor(private http: HttpClient, private router: Router) { }

  public getToken() {
    return this.token;
  }

  getAuthStatus() {
    return this.isAuthenticated;
  }

  getAuthStatusListener() {
    return this.authStatusListenenr.asObservable();
  }

  getUserId() {
    return this.userId;
  }

  createUser(username: string, email: string, password: string, role: number[]) {
    const authData: AuthData = { username, email, password, role };
    // console.log('Auth Data ', authData);
    this.http.post(Config.API_ENDPOINT + 'user/signup', authData)
      .subscribe(response => {
        this.router.navigate(['/login']);
      }, err => {
        this.authStatusListenenr.next(false);
      });
  }


  loginUser(email: string, password: string) {

    const authData: AuthData = { email, password };
    // console.log(authData);
    this.http.post<{ token: string, expiresIn: number, userId: string, roles: any[] }>(Config.API_ENDPOINT + 'user/login', authData)
      .subscribe(response => {
        console.log('response ', response.roles);
        const token = response.token;
        // const roles[] = response.roles;
        this.token = token;
        if (token) {
          const expiresInDuration = response.expiresIn;
          this.setAuthTimer(expiresInDuration);
          this.isAuthenticated = true;
          this.userId = response.userId;
          this.authStatusListenenr.next(true);
          const now = new Date();
          const expirationDate = new Date(now.getTime() + expiresInDuration * 1000);
          this.saveAuthData(token, expirationDate, this.userId, response.roles);
          this.router.navigate(['/dashboard']);
        }

      }, err => {
        this.authStatusListenenr.next(false);
      });

  }


  private setAuthTimer(duration: number) {
    // console.log('Setting Timer : ' + duration);
    this.tokenTimer = setTimeout(() => {
      this.logoutUser();
    }, duration * 1000);
  }

  autoAuthUser() {
    const authInformation = this.getAuthData();
    if (!authInformation) {
      return;
    }
    const now = new Date();
    const expiresIn = authInformation.expirationDate.getTime() - now.getTime();
    if (expiresIn) {
      this.token = authInformation.token;
      this.isAuthenticated = true;
      this.userId = authInformation.userId;
      this.setAuthTimer(expiresIn / 1000);
      this.authStatusListenenr.next(true);
    }

  }

  logoutUser() {
    this.token = null;
    this.isAuthenticated = false;
    this.authStatusListenenr.next(false);
    clearTimeout(this.tokenTimer);
    this.clearAuthData();
    this.userId = null;
    this.router.navigate(['/']);
  }

  private saveAuthData(token: string, expirationDate: Date, userId: string, roles: any[]) {
    // const role: any[] = roles;
    localStorage.setItem('token', token);
    localStorage.setItem('expiration', expirationDate.toString());
    localStorage.setItem('userId', userId);
    localStorage.setItem('roles', JSON.stringify(roles));
    // ('local storage roles ', roles);

  }

  private getAuthData() {
    const token = localStorage.getItem('token');
    const expirationDate = localStorage.getItem('expiration');
    const userId = localStorage.getItem('userId');
    if (!token || !expirationDate) {
      return;
    }
    return {
      token,
      expirationDate: new Date(expirationDate),
      userId
    };
  }

  rolesMatch(allowedRoles): boolean {
    // console.log('Allowed ROle', allowedRoles);
    let isMatch = false;
    // console.log('Roles in localstorage Get', localStorage.getItem('roles'));
    if (localStorage.getItem('roles')) {
      const userRoles: string[] = JSON.parse(localStorage.getItem('roles'));
      allowedRoles.forEach(element => {
        if (userRoles.indexOf(element) > -1) {
          isMatch = true;
          return false;
        }
      });
    }
    return isMatch;
  }

  updatePassword(data) {
    // console.log(data);
    this.http.post('http://localhost:3000/api/mailer/updatepassword', data)
      .subscribe(response => {
        console.log('Response', response);
      });

  }

  verifyToken(paramsdata) {
    // console.log('paramsdata', paramsdata);
    return this.http.post('http://localhost:3000/api/mailer/verifytoken', paramsdata);

  }

  private clearAuthData() {
    localStorage.removeItem('token');
    localStorage.removeItem('expiration');
    localStorage.removeItem('userId');
  }
}
