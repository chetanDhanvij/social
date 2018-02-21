import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ImageSelectorProvider} from '../../providers/image-selector/image-selector';
import { AdvertisementProvider } from '../../providers/advertisement/advertisement';

/**
 * Generated class for the NewAdvertisementPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-new-advertisement',
  templateUrl: 'new-advertisement.html',
})
export class NewAdvertisementPage {
  imageDisplay: string = '';
  image: string = '';
  addtitle: string = '';
  addUrl: string = '';
  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private imageSelectorProvider: ImageSelectorProvider,
              private advertisementProvider: AdvertisementProvider) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad NewAdvertisementPage');
  }

  selectImg(){
    this.imageSelectorProvider.imageSelection().then((img: any)=>{
      console.log(img);
     this.imageDisplay = "data:image/jpeg;base64," + img;
     this.image = img;
    }).catch((err)=>{
      console.log(err);
    })
  }


  postAdd(){
    console.log(this.addtitle, this.addUrl,  this.image)
    this.advertisementProvider.newAdd({
      text: this.addtitle,
      url: this.addUrl,
      image: this.image
    }).then(()=>{
      this.navCtrl.pop();
    })
  }


}
