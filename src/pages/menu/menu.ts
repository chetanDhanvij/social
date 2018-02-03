import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Nav } from 'ionic-angular';
import { ProfileProvider } from '../../providers/profile/profile';
import firebase from 'firebase';
/**
 * Generated class for the MenuPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-menu',
  templateUrl: 'menu.html',
})
export class MenuPage {
  userProfile: any = {};
  profileImgURL: string;
  // Reference to the app's root nav
  @ViewChild(Nav) nav: Nav;
  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              private profileProvider: ProfileProvider) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MenuPage');
    this.nav.setRoot("FeedPage");
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        this.profileProvider.getUserProfile().once('value', userProfileSnapshot => {
          this.profileImgURL = userProfileSnapshot.val().profileImgURL;
          this.userProfile = userProfileSnapshot.val();
          this.userProfile.fullname = this.userProfile.firstName + " " + this.userProfile.lastName
          console.log( "this.userProfile", userProfileSnapshot.val());
        });
      }
    })
  }
  goToProfile(){
    this.nav.push("ProfilePage");
  }  

  goToUserList(){
    this.nav.push("UserListPage");
  } 

}
