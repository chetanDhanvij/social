import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { InAppBrowser } from '@ionic-native/in-app-browser';

/**
 * Generated class for the FullPageAddPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-full-page-add',
  templateUrl: 'full-page-add.html',
})
export class FullPageAddPage {
  addData:any[];
  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public viewCtrl: ViewController,
              private iab: InAppBrowser) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad FullPageAddPage');
  }
  ionViewDidEnter() {
    console.log('ionViewDidEnter IndicationNotePage');
    this.addData = this.navParams.get('data');

  }

  closeAdd(){
    this.viewCtrl.dismiss();
  }

  openLink(link){
    console.log(link.trim().slice(0,3))
    if(link.trim().slice(0,4) == "http"){
      this.iab.create(link, "_system");
    }

  }

}
