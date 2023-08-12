import { TestBed } from '@angular/core/testing';
import { Location } from '@angular/common';
import { AuthService } from './auth.service';
//import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { HttpTestingController, HttpClientTestingModule
   } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';


fdescribe('AuthService', () => {
  
  //let hTTPClientSpy: any;
  let routerSpy: any;
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
     



    //hTTPClientSpy = jasmine.createSpyObj('HttpClient', ["post", "get"]);
    routerSpy = jasmine.createSpyObj('Router', ["navigate"]);
    TestBed.configureTestingModule({
      imports: [ HttpClientTestingModule, RouterTestingModule ],
      providers: [
        AuthService,
        //{ provide: HttpClient, use: hTTPClientSpy },
        //{ provide: Router, user: routerSpy },
      ]
    });

    service = TestBed.inject(AuthService); //TestBed.get(AuthService);
    //service = TestBed.inject(AuthService, { provide: HttpClient, use: hTTPClientSpy },
    //  { provide: Router, user: routerSpy },)
    httpTestingController = TestBed.inject(HttpTestingController);//TestBed.get(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
    expect(service.getAuthStatusListener()).toBeTruthy();
    expect(service.getAuthToken()).toBeFalsy();
  });


  it('should return user login data', () => {
    pending()
    //service.login('testusername', 'testpassword')
    //.subscribe(userData => {
    //  expect(userData).toBeTruthy()
    //});
  });

  it('should be navigate to ...', () => {
    pending();
    //const location: Location = TestBed.inject(Location);
    // some logic will be called
    //expect(location.path()).toBe('/some/other/route');
  });
});
