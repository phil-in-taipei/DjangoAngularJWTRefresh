import { TestBed, fakeAsync, flush, tick } from '@angular/core/testing';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule, Action, ReducerManager } from '@ngrx/store';
import { provideMockActions } from '@ngrx/effects/testing';
import { from, Observable, of, throwError } from 'rxjs';
import { toArray } from 'rxjs/operators';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { provideMockStore } from '@ngrx/store/testing';


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


describe('UserEffects', () => {
    let effects: UserEffects;
    let userServiceSpy: jasmine.SpyObj<UserService>;
    let reducerManagerSpy: jasmine.SpyObj<ReducerManager>;
  
    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [
            StoreModule.forRoot({}), 
            StoreModule.forFeature('user', userProfileReducer), 
            EffectsModule.forFeature([UserEffects])],
        providers: [
            provideMockStore({
                initialState: {
                    'user': initialUserProfileState
                }
            }),
            UserEffects,
            { provide: UserService, useValue: userServiceSpy },
            { provide: ReducerManager, useValue: reducerManagerSpy },

        ]
      });
  
      effects = TestBed.inject(UserEffects);
      userServiceSpy = TestBed.inject(UserService) as jasmine.SpyObj<UserService>;
    });
            /*
    it('should call the UserProfileRequested and UserProfileLoaded actions if there is not user in state', 
        fakeAsync(() => {

        //userServiceSpy.fetchUserProfile.and.returnValue(of(userProfileData));
        //reducerManagerSpy.addFeature().and.returnValue();
        //let actualActions: Action[] | undefined;
        //const expectedActions: Action[] = [new UserProfileRequested(), 
         //   new UserProfileLoaded({ usrProfile: userProfileData })];
        //effects.loadUserProfile$.pipe(toArray()).subscribe((actualActions2) => {
         //   actualActions = actualActions2;
        //  }, fail);
        //  expect(actualActions).toEqual(expectedActions);
    })); */

  });