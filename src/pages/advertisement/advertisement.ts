import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { AdvertisementProvider } from '../../providers/advertisement/advertisement'

/**
 * Generated class for the AdvertisementPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-advertisement',
  templateUrl: 'advertisement.html',
})
export class AdvertisementPage {
  advertisements: any[];
  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              private alertCtrl: AlertController,
              private advertisementProvider: AdvertisementProvider) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AdvertisementPage');
    this.getAdd();
  }

  view(add){
    this.advertisementProvider.view(add);
  }
  delete(add){
    console.log(add);
        let confirm = this.alertCtrl.create({
          title: 'Delete',
          message: 'Do you want to delete the post?',
          buttons: [
            {
              text: 'No',
              handler: () => {
                console.log('Disagree clicked');
              }
            },
            {
              text: 'Yes',
              handler: () => {
                console.log('Agree clicked');
                console.log("delete")
                this.advertisementProvider.deleteAdd(add.key).then(()=>{
                  this.getAdd();
                })
              }
            }
          ]
        });
        confirm.present();
  }

  gotoNewAdd(){
    this.navCtrl.push("NewAdvertisementPage");
  }

  getAdd(){
    this.advertisementProvider.getAdd().then((data:any[])=>{
      this.advertisements = data;
      console.log(data);
    }).catch((err)=>{
      console.log(err);
    })
  }

}
