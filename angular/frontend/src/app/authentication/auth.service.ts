import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
//import * as CryptoJS from 'crypto-js';
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
 // private encryptKey = 'lzzuciihtdffhbdwpjablrtvlotwbpxzgadaaqzerghvwaveui';

  constructor(private http: HttpClient, private router: Router) { }

  autoAuthUser() {
    const authInformation = this.getAuthData();
    if (authInformation) {
      if (authInformation.accessExpDate && authInformation.token &&
          authInformation.refreshExp && authInformation.refresh) {
          console.log('Auth info in local storage:')
          console.log('this is when tokens will expire on reload:')
          console.log(authInformation.accessExpDate);
          console.log(authInformation.refreshExp);
          const now = new Date();
          if(authInformation.refreshExp > now) {
            this.isAuthenticated = true;
            this.authStatusListener.next(true);
            this.token = authInformation.token;
            this.tokenExpTime = new Date(authInformation.accessExpDate);
            this.refresh = authInformation.refresh;
            this.refreshExpTime = new Date(authInformation.refreshExp);
            let timeUntilTokenExp = new Date().getTime() - this.tokenExpTime.getTime();
            this.setAuthTimer(timeUntilTokenExp); // if the value is negative, the timer will
                                                  // immediately trigger refreshTokenOrLogout();
            this.router.navigate(['/authenticated-user/user-profile']);
          } else {
            console.log('refresh token expired. Logging out...')
            this.logout();
            //return;
          }
      } else {
        console.log('Token info incomplete. Logging out...');
        this.logout();
        //return;
      }
    }
  }

  clearLoginError() {
    this.loginErrorListener.next(false);
  }

  private fetchRefreshToken() {
    //let bytes  = CryptoJS.AES.decrypt(this.refresh, this.encryptKey);
    //let refresh = bytes.toString(CryptoJS.enc.Utf8);
    let refresh = this.refresh;
    console.log('this is the unencryped refresh token')
    console.log(refresh);
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

  login(username: string, password: string) {
    const authData: AuthLoginModel = {username: username, password: password};
    this.http.post<{refresh: string, refreshExpiresIn: number, access: string,
    }>(`${environment.apiUrl}/auth/jwt/create`, authData)
      .subscribe(response => {
        console.log('This is the login response:')
        console.log(response)
        if (response.access && response.refresh) {
          this.refresh = response.refresh;
          //this.refresh = CryptoJS.AES.encrypt(response.refresh, this.encryptKey).toString();//response.refresh;
          this.token = response.access;
          this.isAuthenticated = true;
          this.authStatusListener.next(true);
          this.loginErrorListener.next(false);
          const dtToken:Date = new Date();
          console.log('now recieving login data ...')
          console.log('this is now:')
          console.log(dtToken);
          console.log('this is when the token will expire...');
          dtToken.setMinutes(dtToken.getMinutes() + 4);
          dtToken.setSeconds(dtToken.getSeconds() + 45);
          console.log(dtToken);
          this.tokenExpTime = dtToken;
          const dtRfrshTken:Date = new Date();
          dtRfrshTken.setHours( dtRfrshTken.getHours() + 23 );
          dtRfrshTken.setMinutes(dtRfrshTken.getMinutes() + 45);
          this.refreshExpTime = new Date(dtRfrshTken);
          this.setAuthTimer(285000); // 4 minutes 45 seconds
          console.log('this is when the refresh expires')
          console.log(dtRfrshTken);
          this.saveAuthData(this.refresh, this.refreshExpTime,
            this.token, this.tokenExpTime);
          this.router.navigate(['/authenticated-user/user-profile']);
        }
      }, error => {
        console.log(error)
        this.loginErrorListener.next(true);
        this.authStatusListener.next(false);
      })
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
