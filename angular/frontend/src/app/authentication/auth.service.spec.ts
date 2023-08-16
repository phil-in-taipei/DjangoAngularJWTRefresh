import { TestBed, fakeAsync, flush, tick } from '@angular/core/testing';
import { AuthService } from './auth.service';
import { environment } from '../../environments/environment';
import { Router } from '@angular/router';
import { HttpTestingController, HttpClientTestingModule
   } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { httpTokensResponse, 
  httpTokenRefreshResponse1, httpTokenRefreshResponse2, 
  httpTokenRefreshResponse3 } from '../test-data/authentication-tests/authentication-data';
import { UserProfileComponent } from '../authenticated-user/user-profile/user-profile.component';


fdescribe('AuthService', () => {
  let testRouter: Router; 
  let service: AuthService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {


    let store: {[index: string]:any} = {};
    
    const mockLocalStorage = {
      getItem: (key: string): string => {
        return key in store ? store[key] : null;
      },
      setItem: (key: string, value: string) => {
        store[key] = `${value}`;
      },
      removeItem: (key: string) => {
        delete store[key];
      },
      clear: () => {
        store = {};
      }
    };

    spyOn(localStorage, 'getItem')
     .and.callFake(mockLocalStorage.getItem);
   spyOn(localStorage, 'setItem')
     .and.callFake(mockLocalStorage.setItem);
    spyOn(localStorage, 'removeItem')
     .and.callFake(mockLocalStorage.removeItem);
    spyOn(localStorage, 'clear')
     .and.callFake(mockLocalStorage.clear);
     



    //routerSpy = jasmine.createSpyObj('Router', ["navigate"]);
    TestBed.configureTestingModule({
      imports: [ HttpClientTestingModule, RouterTestingModule.withRoutes([
        { path: 'authenticated-user/user-profile', component: UserProfileComponent }
        ]), ],
      providers: [
        AuthService, { provider: localStorage, useValue: mockLocalStorage },
      ]
    });

    testRouter = TestBed.inject(Router);
    spyOn(testRouter, 'navigate').and.returnValue(Promise.resolve(true));  

    service = TestBed.inject(AuthService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
    expect(service.getAuthStatusListener()).toBeTruthy();
    expect(service.getAuthToken()).toBeFalsy()
  });


  it('should accept user login data to make the request', 
    fakeAsync(() => {
    service.login('testusername', 'testpassword');
    const request = httpTestingController.expectOne({
      method: 'POST',
      url:`${environment.apiUrl}/auth/jwt/create`,
    });

    expect(request.request.body).toEqual({username: 'testusername', password: 'testpassword'});

    request.flush(httpTokensResponse);

    flush();

  }));

  it('should save token the token, refresh token, and expiration times', 
    fakeAsync(() => {
    service.login('testusername', 'testpassword');
    const request = httpTestingController.expectOne({
      method: 'POST',
      url:`${environment.apiUrl}/auth/jwt/create`,
    });

    request.flush(httpTokensResponse);

    expect(localStorage.setItem).toHaveBeenCalledTimes(4); 

    expect(localStorage.getItem('refresh')).toEqual(httpTokensResponse['refresh']);
    expect(localStorage.getItem('token')).toEqual(httpTokensResponse['access']); 

    // saved to Date.prototype.toISOString should be 24 or 27 chars in length
    expect(localStorage.getItem('refreshExpiration')?.length).toBeGreaterThanOrEqual(24);
    expect(localStorage.getItem('expiration')?.length).toBeGreaterThanOrEqual(24);

    expect(service.getAuthToken()).toEqual(httpTokensResponse['access']);

    flush();

  }));

  it('should make the access token accesible by calling the getIsAuth() function', 
    fakeAsync(() => {
    service.login('testusername', 'testpassword');
    const request = httpTestingController.expectOne({
      method: 'POST',
      url:`${environment.apiUrl}/auth/jwt/create`,
    });

    request.flush(httpTokensResponse);

    expect(service.getAuthToken()).toEqual(httpTokensResponse['access']);

    flush();

  }));

  it('should set auth status to true upon successful login', 
    fakeAsync(() => {
    service.login('testusername', 'testpassword');
    const request = httpTestingController.expectOne({
      method: 'POST',
      url:`${environment.apiUrl}/auth/jwt/create`,
    });

    request.flush(httpTokensResponse);

    expect(service.getIsAuth()).toBe(true);

    flush();

  }));

  it('should be navigate to user landing page upon successful login', fakeAsync(() => {
    service.login('testusername', 'testpassword');
    const request = httpTestingController.expectOne({
      method: 'POST',
      url:`${environment.apiUrl}/auth/jwt/create`,
    });

    request.flush(httpTokensResponse);
    expect(testRouter.navigate).toHaveBeenCalledWith(['/authenticated-user/user-profile']);

    flush();
  }));

  it(`should set the timer and fetch a replacement token after ${environment.authTimerAmount} secs`, 
  fakeAsync(() => {
    service.login('testusername', 'testpassword');
    const loginRequest = httpTestingController.expectOne({
      method: 'POST',
      url:`${environment.apiUrl}/auth/jwt/create`,
    });

    loginRequest.flush(httpTokensResponse);

    tick(environment.authTimerAmount);

    const refreshTokenRequest = httpTestingController.expectOne({
      method: 'POST',
      url:`${environment.apiUrl}/auth/jwt/refresh`,
    });

    refreshTokenRequest.flush(httpTokenRefreshResponse1);

    // the 4 variables (token, tokenExpTime, refresh, refreshExpTime)
    // will be saved twice -- once on login, and a second time after timer expires
    // and mock api call is made to fetch another token
    expect(localStorage.setItem).toHaveBeenCalledTimes(8); 

    expect(localStorage.getItem('refresh')).toEqual(httpTokensResponse['refresh']);
    expect(localStorage.getItem('token')).toEqual(httpTokenRefreshResponse1['access']); 
    
    tick(environment.authTimerAmount + 5);
  }));

  it(`should set the timer and fetch a 2nd replacement token after ${environment.authTimerAmount * 2} secs`, 
  fakeAsync(() => {
    service.login('testusername', 'testpassword');
    const loginRequest = httpTestingController.expectOne({
      method: 'POST',
      url:`${environment.apiUrl}/auth/jwt/create`,
    });

    loginRequest.flush(httpTokensResponse);

    tick(environment.authTimerAmount);

    const refreshTokenRequest = httpTestingController.expectOne({
      method: 'POST',
      url:`${environment.apiUrl}/auth/jwt/refresh`,
    });

    refreshTokenRequest.flush(httpTokenRefreshResponse1);

    tick(environment.authTimerAmount * 2 + 5);

    const refreshTokenRequest2 = httpTestingController.expectOne({
      method: 'POST',
      url:`${environment.apiUrl}/auth/jwt/refresh`,
    });

    refreshTokenRequest2.flush(httpTokenRefreshResponse2);

    // the 4 variables (token, tokenExpTime, refresh, refreshExpTime)
    // will be saved three times -- once on login, and a 2 mores times after timer expires
    // and mock api calls are made to fetch refresh tokens
    expect(localStorage.setItem).toHaveBeenCalledTimes(12); 

    expect(localStorage.getItem('refresh')).toEqual(httpTokensResponse['refresh']);
    expect(localStorage.getItem('token')).toEqual(httpTokenRefreshResponse2['access']); 
    
    tick(environment.authTimerAmount * 2 + 10);
  }));

  it(`should set the timer and fetch a 3rd replacement token after ${environment.authTimerAmount * 3} secs`, 
  fakeAsync(() => {
    service.login('testusername', 'testpassword');
    const loginRequest = httpTestingController.expectOne({
      method: 'POST',
      url:`${environment.apiUrl}/auth/jwt/create`,
    });

    loginRequest.flush(httpTokensResponse);

    tick(environment.authTimerAmount);

    const refreshTokenRequest = httpTestingController.expectOne({
      method: 'POST',
      url:`${environment.apiUrl}/auth/jwt/refresh`,
    });

    refreshTokenRequest.flush(httpTokenRefreshResponse1);

    tick(environment.authTimerAmount * 2 + 1);

    const refreshTokenRequest2 = httpTestingController.expectOne({
      method: 'POST',
      url:`${environment.apiUrl}/auth/jwt/refresh`,
    });

    refreshTokenRequest2.flush(httpTokenRefreshResponse2);

    tick(environment.authTimerAmount * 3 + 2);

    const refreshTokenRequest3 = httpTestingController.expectOne({
      method: 'POST',
      url:`${environment.apiUrl}/auth/jwt/refresh`,
    });

    refreshTokenRequest3.flush(httpTokenRefreshResponse3);

    // the 4 variables (token, tokenExpTime, refresh, refreshExpTime)
    // will be saved four times -- once on login, and a 2 mores times after timer expires
    // and mock api calls are made to fetch refresh tokens
    expect(localStorage.setItem).toHaveBeenCalledTimes(16); 

    expect(localStorage.getItem('refresh')).toEqual(httpTokensResponse['refresh']);
    expect(localStorage.getItem('token')).toEqual(httpTokenRefreshResponse3['access']); 
    
    tick(environment.authTimerAmount * 3 + 10);
  }));

  it(`should set the timer,fetch token 3 times, and log user out due to refresh token expiration`, 
  fakeAsync(() => {
    service.login('testusername', 'testpassword');
    const loginRequest = httpTestingController.expectOne({
      method: 'POST',
      url:`${environment.apiUrl}/auth/jwt/create`,
    });

    loginRequest.flush(httpTokensResponse);

    tick(environment.authTimerAmount);

    const refreshTokenRequest = httpTestingController.expectOne({
      method: 'POST',
      url:`${environment.apiUrl}/auth/jwt/refresh`,
    });

    refreshTokenRequest.flush(httpTokenRefreshResponse1);

    tick(environment.authTimerAmount * 2 + 1);

    const refreshTokenRequest2 = httpTestingController.expectOne({
      method: 'POST',
      url:`${environment.apiUrl}/auth/jwt/refresh`,
    });

    refreshTokenRequest2.flush(httpTokenRefreshResponse2);

    tick(environment.authTimerAmount * 3 + 2);

    const refreshTokenRequest3 = httpTestingController.expectOne({
      method: 'POST',
      url:`${environment.apiUrl}/auth/jwt/refresh`,
    });

    refreshTokenRequest3.flush(httpTokenRefreshResponse3);
      
    tick(environment.authTimerAmount * 3 + 10);


        // the 4 variables (token, tokenExpTime, refresh, refreshExpTime)
    // will be saved four times -- once on login, and a 2 mores times after timer expires
    // and mock api calls are made to fetch refresh tokens
    expect(localStorage.setItem).toHaveBeenCalledTimes(16); 


    // the items are no longer in local storage
    expect(localStorage.getItem('refresh')).toEqual(null);
    expect(localStorage.getItem('token')).toEqual(null); 
    expect(localStorage.getItem('refreshExpiration')).toEqual(null); 
    expect(localStorage.getItem('expiration')).toEqual(null); 

    // user has been logged out
    expect(service.getIsAuth()).toBe(false);
  
    flush();
  }));
});
