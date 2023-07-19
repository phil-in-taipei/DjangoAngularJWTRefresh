import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule }   from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthErrorInterceptor } from './authentication/auth.error.interceptor';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { UnauthenticatedHeaderComponent } from './unauthenticated-layout/unauthenticated-header/unauthenticated-header.component';
import { UnauthenticatedFooterComponent } from './unauthenticated-layout/unauthenticated-footer/unauthenticated-footer.component';
import { ContactComponent } from './contact/contact.component';
import { InformationComponent } from './information/information.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    UnauthenticatedHeaderComponent,
    UnauthenticatedFooterComponent,
    ContactComponent,
    InformationComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
  ],
  providers: [
    {provide: HTTP_INTERCEPTORS, useClass: AuthErrorInterceptor, multi: true},
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }