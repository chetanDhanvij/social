import { Component } from '@angular/core';
import {
  Alert,
  AlertController,
  IonicPage,
  NavController,LoadingController, Loading, App
} from 'ionic-angular';
import { ProfileProvider } from '../../providers/profile/profile';
import { AuthProvider } from '../../providers/auth/auth';

@IonicPage()
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html'
})
export class ProfilePage {
  public userProfile: any;
  public dob: string;
  public profileImgURL: string;
  private loading: Loading;
  public gender: string;

  constructor(
    public navCtrl: NavController,
    public alertCtrl: AlertController,
    public authProvider: AuthProvider,
    public profileProvider: ProfileProvider,
    private loadingCtrl: LoadingController,
    private app: App
  ) {}

  ionViewDidLoad() {
    this.loading = this.loadingCtrl.create();
    this.loading.present();
    this.profileProvider.getUserProfile().on('value', userProfileSnapshot => {
      this.userProfile = userProfileSnapshot.val();
      this.dob = userProfileSnapshot.val().dob;
      this.profileImgURL = userProfileSnapshot.val().profileImgURL; 
      this.gender = userProfileSnapshot.val().gender; 
      console.log( "this.userProfile", this.userProfile);
      try{
        this.loading.dismiss();
      }catch(e){
        console.log(e)
      }

    });
  }

  logOut(): void {
    this.authProvider.logoutUser().then(() => {
      this.app.getRootNav().setRoot('LoginPage');
    });
  }

  updateName(): void {
    const alert: Alert = this.alertCtrl.create({
      message: 'Your first name & last name',
      inputs: [
        {
          name: 'firstName',
          placeholder: 'Your first name',
          value: this.userProfile.firstName
        },
        {
          name: 'lastName',
          placeholder: 'Your last name',
          value: this.userProfile.lastName
        }
      ],
      buttons: [
        { text: 'Cancel' },
        {
          text: 'Save',
          handler: data => {
            this.profileProvider.updateName(data.firstName, data.lastName);
          }
        }
      ]
    });
    alert.present();
  }

  updateDOB(dob: string): void {
    this.profileProvider.updateDOB(dob);
  }

  updateEmail(): void {
    let alert: Alert = this.alertCtrl.create({
      inputs: [
        { name: 'newEmail', placeholder: 'Your new email' },
        { name: 'password', placeholder: 'Your password', type: 'password' }
      ],
      buttons: [
        { text: 'Cancel' },
        {
          text: 'Save',
          handler: data => {
            this.profileProvider
              .updateEmail(data.newEmail, data.password)
              .then(() => {
                console.log('Email Changed Successfully');
              })
              .catch(error => {
                console.log('ERROR: ' + error.message);
              });
          }
        }
      ]
    });
    alert.present();
  }

  updatePassword(): void {
    let alert: Alert = this.alertCtrl.create({
      inputs: [
        { name: 'newPassword', placeholder: 'New password', type: 'password' },
        { name: 'oldPassword', placeholder: 'Old password', type: 'password' }
      ],
      buttons: [
        { text: 'Cancel' },
        {
          text: 'Save',
          handler: data => {
            this.profileProvider.updatePassword(
              data.newPassword,
              data.oldPassword
            );
          }
        }
      ]
    });
    alert.present();
  }

  updateImg(){
    // this.loading = this.loadingCtrl.create();
    // this.loading.present();
    this.profileProvider.updateImg().then((isSuccessfull)=>{

        console.log(this.userProfile);

    })
  }
}
