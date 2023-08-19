import {Injectable} from '@angular/core';
import {Actions, Effect, ofType} from '@ngrx/effects';
import {select, Store} from '@ngrx/store';
import {throwError} from 'rxjs';
import {catchError, concatMap, exhaustMap, filter, map, mergeMap, switchMap, withLatestFrom} from "rxjs/operators";

import { AppState } from '../reducers';
import { selectUserProfile } from './user.selectors';
import { UserService } from './user.service';
import { UserProfileActions, UserProfileActionTypes, UserProfileSubmitted,
    UserProfileLoaded, UserProfileRequested, UserProfileSaved,
     } from './user.actions';


@Injectable()
    export class UserEffects {
    
        @Effect()
        loadUserProfile$ = this.actions$
          .pipe(
            ofType<UserProfileRequested>(UserProfileActionTypes.UserProfileRequested),
            withLatestFrom(this.store.pipe(select(selectUserProfile))),
            filter(([action, userProfileLoaded]) => !userProfileLoaded),
            mergeMap(action => this.userService.fetchUserProfile()),
            map(usrProfile => new UserProfileLoaded({ usrProfile }),
            catchError(err => {
                console.log('Error loading user info: ', err);
                return throwError(err);
              })
            )
          )

        @Effect()
        submitEditedProfile$ = this.actions$
            .pipe(
            ofType<UserProfileSubmitted>(UserProfileActionTypes.UserProfileSubmitted),
            mergeMap(action => this.userService.editUserProfile(action.payload.submissionForm)
                .pipe(
                    map(usrProfile => new UserProfileSaved({ usrProfile }))
                ),
                )
            )

        constructor(private actions$: Actions, private userService: UserService,
            private store: Store<AppState>) {}
}
