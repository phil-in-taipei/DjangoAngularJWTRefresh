import { TestBed, fakeAsync, flush, tick } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action } from '@ngrx/store';
import { from, Observable, of, throwError } from 'rxjs';
import { toArray } from 'rxjs/operators';

import { UserEffects } from './user.effects';
import { UserProfileActions, UserProfileActionTypes } from './user.actions';
import { selectUserProfile } from './user.selectors';
import { UserService } from './user.service';