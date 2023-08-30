import { TestBed, fakeAsync, flush, tick } from '@angular/core/testing';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule, Action, select, Store } from '@ngrx/store';
import { provideMockActions } from '@ngrx/effects/testing';
import { from, Observable, of, throwError } from 'rxjs';
import { toArray } from 'rxjs/operators';
import { Actions, createEffect, ofType, } from '@ngrx/effects';
import { provideMockStore } from '@ngrx/store/testing';
import { reducers, metaReducers } from '../reducers';

import { EffectsTestingModule, EffectsRunner } from '@ngrx/effects/testing';

import { UserEffects } from './user.effects';
import { initialUserProfileState, UserProfileState } from './user.reducers';
import { userProfileData 
} from '../test-data/authenticated-user-module-tests/user-related-tests/user-data';
import { UserProfileActions, UserProfileActionTypes, 
    UserProfileLoaded, 
    UserProfileRequested, 
    UserProfileSaved} from './user.actions';
import { selectUserProfile } from './user.selectors';
import { UserService } from './user.service';
import { userProfileReducer } from './user.reducers';
import { UserProfileModel } from '../models/user-profile.model';


fdescribe('UserEffects', () => {
    let effects: UserEffects;
    //let userServiceSpy: jasmine.SpyObj<UserService>;
    let userService: UserService;
    //let runner: EffectsRunner;
  
    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [
            StoreModule.forRoot(reducers, { metaReducers }), 
            StoreModule.forFeature('user', userProfileReducer), 
            EffectsModule.forFeature([UserEffects]), EffectsModule.forRoot([])
        ],
            
        providers: [
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
            provideMockActions(from([UserProfileRequested, UserProfileLoaded, 
              UserProfileSaved])),
            UserEffects,
            { provide: UserService, useValue: jasmine.createSpyObj('userService', ['fetchUserProfile']) },

        ]
      });
      runner = TestBed.inject(EffectsRunner);
      effects = TestBed.inject(UserEffects);
      userService = TestBed.inject(UserService);// as jasmine.SpyObj<UserService>;
    });
            
    it('should call the UserProfileRequested and UserProfileLoaded actions if there is not user in state', 
        () => {

        //userServiceSpy.fetchUserProfile.and.returnValue(of(userProfileData));
        //userService.fetchUserProfile.and.returnValue(of(userProfileData));

        let actualActions: Action[] | undefined;
        const expectedActions: Action[] = [new UserProfileRequested(), 
            new UserProfileLoaded({ usrProfile: userProfileData })];
        //effects.loadUserProfile$.subscribe((result) => {
        //    expect(result).toBeTruthy();
        //});
        effects.loadUserProfile$.pipe(toArray()).subscribe((actualActions2) => {
            actualActions = actualActions2;
          }, fail);
        //expect(userServiceSpy.fetchUserProfile).toHaveBeenCalled();
        //userServiceSpy.fetchUserProfile.and.returnValue(of(userProfileData));
        expect(actualActions).toEqual(expectedActions);
        //flush();
        runner.queue(new UserProfileRequested());
    });

  });