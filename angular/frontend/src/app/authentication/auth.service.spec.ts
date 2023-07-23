import { TestBed } from '@angular/core/testing';

import { AuthService } from './auth.service';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { HttpClientTestingModule } from '@angular/common/http/testing';

fdescribe('AuthService', () => {
  
  let hTTPClientSpy: any;
  let routerSpy: any;
  let service: AuthService;

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
     



    hTTPClientSpy = jasmine.createSpyObj('HttpClient', ["post", "get"]);
    routerSpy = jasmine.createSpyObj('Router', ["navigate"]);
    TestBed.configureTestingModule({
      imports: [ HttpClientTestingModule ],
      providers: [
        AuthService,
        //{ provide: HttpClient, use: hTTPClientSpy },
        { provide: Router, user: routerSpy },
      ]
    });

    service = TestBed.get(AuthService);//TestBed.inject(AuthService);
    //service = TestBed.inject(AuthService, { provide: HttpClient, use: hTTPClientSpy },
    //  { provide: Router, user: routerSpy },)
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
