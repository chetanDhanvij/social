import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, Platform  } from 'ionic-angular';
import { InAppBrowser } from '@ionic-native/in-app-browser';

/**
 * Generated class for the RecallOutputPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-recall-output',
  templateUrl: 'recall-output.html',
})
export class RecallOutputPage {
  text: string;
  showCancel: boolean;
  showUpdate: boolean;
  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              public viewCtrl: ViewController,
              private iab: InAppBrowser,
              private platform : Platform ) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad RecallOutputPage');
    this.text = this.navParams.get('text');
    this.showCancel = this.navParams.get('showCancel');
    this.showUpdate = this.navParams.get('showUpdate');
  }

  private unregisterBackButtonAction: any;
  public initializeBackButtonCustomHandler(): void {
    console.log("Registerid backbutton action");
      this.unregisterBackButtonAction = this.platform.registerBackButtonAction(() => {
        this.platform.exitApp();
      }, 10);
  }

  closeModal(){
    // Unregister the custom back button action for this page
    this.unregisterBackButtonAction && this.unregisterBackButtonAction();
    this.viewCtrl.dismiss();
  }

  gotoPlayStore(){
    this.iab.create("https://play.google.com/store/apps/details?id=com.mikunbi.social", "_system");
  }

}
