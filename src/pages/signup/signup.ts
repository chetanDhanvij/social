import { Component } from '@angular/core';
import {
  Alert,
  AlertController,
  IonicPage,
  Loading,
  LoadingController,
  NavController
} from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthProvider } from '../../providers/auth/auth';
import { EmailValidator } from '../../validators/email';

@IonicPage()
@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html'
})
export class SignupPage {
  public signupForm: FormGroup;
  public loading: Loading;

  constructor(
    public navCtrl: NavController,
    public authProvider: AuthProvider,
    public loadingCtrl: LoadingController,
    public alertCtrl: AlertController,
    formBuilder: FormBuilder
  ) {
    this.signupForm = formBuilder.group({
      email: [
        '',
        Validators.compose([Validators.required, EmailValidator.isValid])
      ],
      password: [
        '',
        Validators.compose([Validators.minLength(6), Validators.required])
      ],
      confirmPassword: [
        '',
        Validators.compose([Validators.minLength(6), Validators.required])
      ]
    });
  }
  goToLogin(): void {
    this.navCtrl.setRoot('LoginPage');
  }

  goToNextStep(){
    this.navCtrl.push("UserInitialDetailPage", {email: this.signupForm.value.email, password: this.signupForm.value.password})
  }
}
