import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Slides } from 'ionic-angular';
import { GeneralProvider } from '../../providers/general/general'

/**
 * Generated class for the IntroPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-intro',
  templateUrl: 'intro.html',
})
export class IntroPage {

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              private general: GeneralProvider) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad IntroPage');
  }
  ionViewWillLeave(){
    this.general.setIntroDone();
  }
  goToLogin(){
    this.navCtrl.setRoot("LoginPage");
  }
  goToSignup(){
    this.navCtrl.setRoot("SignupPage");
  }
  onSlideChangeStart(slider: Slides) {
    // this.showSkip = !slider.isEnd();
  }

}
