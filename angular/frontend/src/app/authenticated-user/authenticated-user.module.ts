import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule }   from '@angular/forms';
import { AuthenticatedUserComponent } from './authenticated-user.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { AuthenticatedHeaderComponent } from './authenticated-layout/authenticated-header/authenticated-header.component';
import { AuthenticatedFooterComponent } from './authenticated-layout/authenticated-footer/authenticated-footer.component';
//import { AuthenticatedUserRoutingModule } from './authenticated-user-routing.module';


@NgModule({
  declarations: [
    //AuthenticatedUserComponent,
    UserProfileComponent,
    AuthenticatedHeaderComponent,
    AuthenticatedFooterComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule
    //AuthenticatedUserRoutingModule,
  ]
})
export class AuthenticatedUserModule { }
