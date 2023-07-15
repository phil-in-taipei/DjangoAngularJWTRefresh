import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import * as CryptoJS from 'crypto-js';
import { environment } from '../../environments/environment';
import { AuthLoginModel } from '../models/auth-login.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private isAuthenticated = false;
  private isLoginError = false;
  private token: string;
  private tokenExpTime: Date
  private tokenTimer: NodeJS.Timer;
  private refresh: string;
  private refreshExpTime: Date;
  private authStatusListener = new Subject<boolean>();
  private loginErrorListener = new Subject<boolean>();
  private encryptKey = 'lzzuciihtdffhbdwpjablrtvlotwbpxzgadaaqzerghvwaveui';

  constructor(private http: HttpClient, private router: Router) { }

  clearLoginError() {
    this.loginErrorListener.next(false);
  }

  private fetchRefreshToken() {
    let bytes  = CryptoJS.AES.decrypt(this.refresh, this.encryptKey);
    let refresh = bytes.toString(CryptoJS.enc.Utf8);
    //console.log('this is the unencryped refresh token')
    //console.log(refresh);
    this.http.post<{access: string
    }>(`${environment.apiUrl}/auth/jwt/refresh`, {refresh: refresh})
      .subscribe(response => {
        console.log(response)
        if (response.access) {
          this.token = response.access;
          this.isAuthenticated = true;
          this.authStatusListener.next(true);
          const dtToken:Date = new Date();
          console.log('now recieving login data ...')
          console.log('this is now:')
          console.log(dtToken);
          console.log('this is when the token will expire...');
          dtToken.setMinutes(dtToken.getMinutes() + 4);
          dtToken.setSeconds(dtToken.getSeconds() + 45);
          console.log(dtToken);
          this.tokenExpTime = dtToken;
          this.setAuthTimer(285000);
          console.log('this is when the refresh will expire:')
          console.log(this.refreshExpTime);
          this.saveAuthData(this.refresh, this.refreshExpTime,
            this.token, this.tokenExpTime);
        }
      }, error => {
        console.log(error)
        this.authStatusListener.next(false);
        this.logout();
      });
  }

  getAuthStatusListener() {
    return this.authStatusListener.asObservable();
  }

  private getAuthData() {
    const token = localStorage.getItem('token');
    const accessExpDate = localStorage.getItem('expiration');
    const refresh = localStorage.getItem('refresh');
    const refreshExpDate = localStorage.getItem('refreshExpiration');
    if (!token || !accessExpDate || !refreshExpDate || !refresh) {
      return;
    }
    return {
      token: token,
      accessExpDate: new Date(accessExpDate),
      refresh: refresh,
      refreshExp: new Date(refreshExpDate)
    }
  }

  getAuthToken() {
    return this.token;
  }

  getIsAuth() {
    return this.isAuthenticated;
  }

  getIsLoginError() {
    return this.isLoginError;
  }

  getLoginErrorListener() {
    return this.loginErrorListener.asObservable();
  }

  logout() {
    this.isAuthenticated = false;
    this.authStatusListener.next(false);
    clearTimeout(this.tokenTimer);
    localStorage.removeItem('token');
    localStorage.removeItem('expiration');
    localStorage.removeItem('refresh');
    localStorage.removeItem('refreshExpiration');
    localStorage.removeItem('userId');
  }

  private refreshTokenOrLogout() {
    const now = new Date();
    if(this.refreshExpTime < now) {
      console.log('the refresh token is expired');
      this.logout();
    } else {
      console.log('getting a new token...');
      this.fetchRefreshToken();
    }
  }

  private saveAuthData(refresh: string, refreshExpDate: Date,
    token: string, expirationDate: Date) {
      localStorage.setItem('refresh', refresh);
      localStorage.setItem('refreshExpiration', refreshExpDate.toISOString());
      localStorage.setItem('token', token);
      localStorage.setItem('expiration', expirationDate.toISOString());
  }

  private setAuthTimer(duration: number) {
    console.log('this auth timer is being set');
    console.log(`for this long: ${duration}`);
    this.tokenTimer = setTimeout(() => {
        console.log('time is up!');
        let dt:Date = new Date();
        console.log(dt);
        this.refreshTokenOrLogout();
      }, duration);
  }

}
