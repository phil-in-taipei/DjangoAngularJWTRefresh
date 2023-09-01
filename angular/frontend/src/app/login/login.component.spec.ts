import { ComponentFixture, TestBed } from '@angular/core/testing';
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
  let isErrorLogin:boolean = false;
  //let errorLogin$: Subscription;
  //let loginErrorListener = new Subject<boolean>();
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authService: AuthService;

  const mockAuthService = {
    clearLoginError(): void {
      isErrorLogin = false;
    },

    getIsLoginError(): boolean {
      return isErrorLogin;
    },

    getLoginErrorListener(): Observable<boolean> {
      return of(isErrorLogin);
    }

  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      //imports: [FormsModule],
      declarations: [ 
       // NgForm,
        LoginComponent,
        { provide: AuthService, useValue: mockAuthService }
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginComponent);
    authService = TestBed.inject(AuthService);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
