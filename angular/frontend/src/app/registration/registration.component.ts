import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms'
import { Observable } from 'rxjs';

import { UserRegistrationModel, 
  UserRegistrationResponseModel } from '../models/user-registration.model';
import { RegistrationService } from './registration.service';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent implements OnInit {

  constructor(private registrationService: RegistrationService) { }

  userResistrationData: UserRegistrationModel;

  registrationResponse$: Observable<UserRegistrationResponseModel|undefined>;

  ngOnInit(): void {

  }

  onSubmitRegistrationForm(form: NgForm) {
    console.log('submit resistration ...')
    console.log(form.value);
    if (form.invalid) {
      console.log('registration form is invalid')
      console.log(form.errors);
      return;
    }
    console.log('valid!')
    this.userResistrationData.username = form.value.username;
    this.userResistrationData.password = form.value.password;
    this.userResistrationData.re_password = form.value.re_password;
    this.userResistrationData.profile.contact_email = form.value.contact_email;
    this.userResistrationData.profile.surname = form.value.surname;
    this.userResistrationData.profile.given_name = form.value.given_name
    this.registrationResponse$ = this.registrationService
      .submitUserRegistration(this.userResistrationData);
    form.reset();
  }
}
