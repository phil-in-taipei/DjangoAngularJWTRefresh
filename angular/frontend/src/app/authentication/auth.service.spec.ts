import { TestBed, fakeAsync } from '@angular/core/testing';
import { Location } from '@angular/common';
import { AuthService } from './auth.service';
import { environment } from '../../environments/environment';
import { Router } from '@angular/router';
import { HttpTestingController, HttpClientTestingModule
   } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { httpTokensResponse } from '../test-data/authentication-tests/authentication-data';


fdescribe('AuthService', () => {
  
  let localStorageSpy: any;
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
     



    routerSpy = jasmine.createSpyObj('Router', ["navigate"]);
    TestBed.configureTestingModule({
      imports: [ HttpClientTestingModule, RouterTestingModule ],
      providers: [
        AuthService, { provider: localStorage, useValue: mockLocalStorage },
      ]
    });

    service = TestBed.inject(AuthService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
    expect(service.getAuthStatusListener()).toBeTruthy();
    expect(service.getAuthToken()).toBeFalsy()
  });


  it('should return user login data', () => {
    //localStorageSpy = spyOn(localStorage, 'setItem').and.callThrough();
    //spyOn(localStorage, 'getItem').and.callThrough();
    service.login('testusername', 'testpassword');
    const request = httpTestingController.expectOne({
      method: 'POST',
      url:`${environment.apiUrl}/auth/jwt/create`,
    });
    //const res = await request;
    expect(request.request.body).toEqual({username: 'testusername', password: 'testpassword'});
    // below fails because not called in this method
    //expect(localStorage.setItem).toHaveBeenCalledTimes(4); 

    //expect(localStorageSpy.setItem).toHaveBeenCalledTimes(4); 

    // below can't be spied on because it is private
    //expect(service.saveAuthData).toHaveBeenCalledTimes(1);

    // below can't get the data item -- it is just undefined
    //expect(service.getAuthToken()).toEqual(httpTokensResponse['access']);

    // below can't get mock local storage data -- it is still null
    expect(localStorage.getItem('token')).toEqual(httpTokensResponse['access']);

    //expect(service.getIsAuth()).toBe(true);
    //console.log('this is the response event:')
    //console.log(res.event);
    //expect(res).toBeTruthy();

    request.flush({ httpTokensResponse });

  });

  it('should be navigate to ...', () => {
    pending();
    //const location: Location = TestBed.inject(Location);
    // some logic will be called
    //expect(location.path()).toBe('/some/other/route');
  });
});
