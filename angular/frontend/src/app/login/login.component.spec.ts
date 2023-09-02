import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { DebugElement, NO_ERRORS_SCHEMA } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Subscription, Subject, of, Observable } from 'rxjs';

import { AuthLoginModel, AuthLoginResponseModel, 
  AuthLoginResponseFailureModel } from '../models/auth-login.model';
import { AuthService } from '../authentication/auth.service';
import { httpTokenResponseFailure 
} from '../test-data/authentication-tests/authentication-data';
import { LoginComponent } from './login.component';

import { click, expectText, findEl,
  checkField, setFieldValue, 
} from '../shared-utils/testing-helpers.util';

fdescribe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authService: any;
  let loginErrorListener = new Subject<boolean>();


  beforeEach(async () => {
    let mockAuthService = jasmine.createSpyObj(['clearLoginError', 'getIsLoginError', 
    'getLoginErrorListener', 'login']);
    await TestBed.configureTestingModule({
      imports: [FormsModule],
      declarations: [ 
        NgForm,
        LoginComponent,
      ],
      providers: [
        { provide: AuthService, useValue: mockAuthService }
      ],
      schemas: [NO_ERRORS_SCHEMA],
    })
    .compileComponents();
  });

  beforeEach(() => {
    loginErrorListener.next(false);
    authService = TestBed.inject(AuthService);
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    authService.getIsLoginError.and.returnValue(false);
    // still experimenting with how to handle subscriptions/objservables
    //authService.getLoginErrorListener.and.returnValue(loginErrorListener)
    authService.getLoginErrorListener.and.returnValue(of(false));
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call the login function with the values entered into the form onLogin', 
    fakeAsync(() => {
      spyOn(component, 'onLogin').and.callThrough(); 
      setFieldValue(fixture, 'username', 'testusername');
      setFieldValue(fixture, 'password', 't');
      console.log('now clicking the button');
      findEl(fixture, 'login-form').triggerEventHandler('login-submit', {});
      tick(1000);
      fixture.detectChanges();
      //expect(authService.login).toHaveBeenCalledWith(
      //  {username: 'testusername', password: 'testpassword'}
      //);
      const passwordEl = findEl(fixture, 'password');
      console.log(passwordEl);
      //expect(passwordEl.attributes.type).toBe('password');
      //expect(authService.login).toHaveBeenCalled();
  }));
});
