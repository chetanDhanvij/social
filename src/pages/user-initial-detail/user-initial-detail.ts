import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Loading, LoadingController, Alert, AlertController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProfileProvider } from '../../providers/profile/profile';
import { AuthProvider } from '../../providers/auth/auth';
/**
 * Generated class for the UserInitialDetailPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-user-initial-detail',
  templateUrl: 'user-initial-detail.html',
})
export class UserInitialDetailPage {
  public userForm: FormGroup;
  private signupForm: any = {};
  private loading: Loading;

  public userProfile: any;
  public birthDate: string;
  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              formBuilder: FormBuilder,
              private authProvider: AuthProvider,
              private profileProvider: ProfileProvider,
              private loadingCtrl: LoadingController,
              private alertCtrl: AlertController) {
    this.userForm = formBuilder.group({
      firstName: [
        '',
        Validators.compose([Validators.minLength(2), Validators.required])
      ],
      lastName: [
        '',
        Validators.compose([Validators.minLength(2), Validators.required])
      ],
      gender: [
        '',
        Validators.compose([Validators.required])
      ],
      dob: [
        '',
        Validators.compose([Validators.required])
      ]
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad UserInitialDetailPage');
    this.signupForm.email = this.navParams.get("email");
    this.signupForm.password = this.navParams.get("password");
    console.log(this.signupForm);
  }


  signupUser(): void {
      const email: string = this.signupForm.email;
      const password: string = this.signupForm.password;

      this.authProvider.signupUser(email, password).then(
        user => {
            this.updateUserInfo();
        },
        error => {
          this.loading.dismiss().then(() => {
            const alert: Alert = this.alertCtrl.create({
              message: error.message,
              buttons: [{ text: 'Ok', role: 'cancel' }]
            });
            alert.present();
          });
        }
      );
      this.loading = this.loadingCtrl.create();
      this.loading.present();
  }

  updateUserInfo(){
    console.log(this.userForm.value)
    this.profileProvider.initialData( this.userForm.value.firstName,
                                      this.userForm.value.lastName,
                                      this.userForm.value.dob,
                                      this.userForm.value.gender).then(()=>{
                                        this.loading.dismiss().then(()=>{
                                          this.navCtrl.setRoot("TabsPage");
                                        })
                                      }).catch((err)=>{
                                        console.log(err);
                                        this.loading.dismiss();
                                      })
  }

}
