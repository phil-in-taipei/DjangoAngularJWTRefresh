import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthenticatedUserRoutingModule } from './authenticated-user-routing.module';
import { AuthenticatedUserComponent } from './authenticated-user.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { AuthenticatedHeaderComponent } from './authenticated-layout/authenticated-header/authenticated-header.component';
import { AuthenticatedFooterComponent } from './authenticated-layout/authenticated-footer/authenticated-footer.component';


@NgModule({
  declarations: [
    AuthenticatedUserComponent,
    UserProfileComponent,
    AuthenticatedHeaderComponent,
    AuthenticatedFooterComponent
  ],
  imports: [
    CommonModule,
    AuthenticatedUserRoutingModule
  ]
})
export class AuthenticatedUserModule { }
