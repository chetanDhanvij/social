import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
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
              private advertisementProvider: AdvertisementProvider) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AdvertisementPage');
    this.getAdd();
    this.advertisements = [
      {
        id:1,
        text:"text 1",
        link:"https://ionicframework.com/docs/components/#thumbnail-list",
        image: "assets/imgs/logo/SampleLogo.png"
      },
      {
        id:2,
        text:"text 1",
        link:"https://ionicframework.com/docs/components/#thumbnail-list",
        image: "assets/imgs/logo/SampleLogo.png"
      },
      {
        id:3,
        text:"text 1",
        link:"https://ionicframework.com/docs/components/#thumbnail-list",
        image: "assets/imgs/logo/SampleLogo.png"
      },
      {
        id:4,
        text:"text 1",
        link:"https://ionicframework.com/docs/components/#thumbnail-list",
        image: "assets/imgs/logo/SampleLogo.png"
      }
    ]
  }


  delete(addId){
    console.log(addId);
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
