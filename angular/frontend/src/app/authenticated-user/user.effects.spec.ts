import { TestBed, fakeAsync, flush, tick } from '@angular/core/testing';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule, Action, select, Store } from '@ngrx/store';
import { provideMockActions } from '@ngrx/effects/testing';
import { from, Observable, of, throwError } from 'rxjs';
import { toArray } from 'rxjs/operators';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { provideMockStore } from '@ngrx/store/testing';
import { reducers, metaReducers } from '../reducers';



import { UserEffects } from './user.effects';
import { initialUserProfileState, UserProfileState } from './user.reducers';
import { userProfileData 
} from '../test-data/authenticated-user-module-tests/user-related-tests/user-data';
import { UserProfileActions, UserProfileActionTypes, 
    UserProfileLoaded, 
    UserProfileRequested } from './user.actions';
import { selectUserProfile } from './user.selectors';
import { UserService } from './user.service';
import { userProfileReducer } from './user.reducers';


fdescribe('UserEffects', () => {
    let effects: UserEffects;
    let userServiceSpy: jasmine.SpyObj<UserService>;
    //let userSelectorSpy: jasmine.SpyObj<typeof select>;
  
    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [
            StoreModule.forRoot(reducers, { metaReducers }), 
            StoreModule.forFeature('user', userProfileReducer), 
            EffectsModule.forFeature([UserEffects])],
        
            
        providers: [
            EffectsModule.forRoot([]),
            provideMockStore({
                initialState: {
                    'user': initialUserProfileState
                },
                selectors: [
                    {
                      selector: selectUserProfile,
                      value: undefined
                    }
                  ]
            }),
    
            UserEffects, // this also needs an actions spy
            { provide: UserService, useValue: userServiceSpy },

        ]
      });
  
      effects = TestBed.inject(UserEffects);
      userServiceSpy = TestBed.inject(UserService) as jasmine.SpyObj<UserService>;
    });
            
    it('should call the UserProfileRequested and UserProfileLoaded actions if there is not user in state', 
        fakeAsync(() => {

        //spyOn<typeof effects, any>(effects,'loadUserProfile$')
        userServiceSpy.fetchUserProfile.and.returnValue(of(userProfileData));
        
        let actualActions: Action[] | undefined;
        const expectedActions: Action[] = [new UserProfileRequested(), 
            new UserProfileLoaded({ usrProfile: userProfileData })];
        //effects.loadUserProfile$.subscribe((result) => {
        //    expect(result).toBeTruthy();
        //});
        effects.loadUserProfile$.pipe(toArray()).subscribe((actualActions2) => {
            actualActions = actualActions2;
          }, fail);
        expect(actualActions).toEqual(expectedActions);
    }));

  });