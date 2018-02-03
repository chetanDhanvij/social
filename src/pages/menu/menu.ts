import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Nav } from 'ionic-angular';

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

  // Reference to the app's root nav
  @ViewChild(Nav) nav: Nav;
  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MenuPage');
    this.nav.setRoot("FeedPage");
  }
  goToProfile(){
    this.nav.push("ProfilePage");
  }  

  goToProfileUpdate(){
    this.nav.push("UserInitialDetailPage"); 
  }

}
