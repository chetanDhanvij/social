import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Slides } from 'ionic-angular';
import { FeedProvider } from '../../providers/feed/feed'
import { ImageSelectorProvider } from '../../providers/image-selector/image-selector'

/**
 * Generated class for the NewPostPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-new-post',
  templateUrl: 'new-post.html',
})
export class NewPostPage {
  @ViewChild('slides') slides: Slides;
  postType: string;
  statusText: string = '';
  colors: string[];
  selectedColor: string;
  image: any;
  imgText: string = '';
  video: string = '';
  videoText: string = '';
  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              public feedProvider: FeedProvider,
              public imageSelectorProvider: ImageSelectorProvider) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad NewPostPage');
    this.postType = this.navParams.get('type');
    console.log(this.postType);
    this.colors = [ "#f6e58d", "#ffbe76","#ff7979","#badc58","#dff9fb","#f9ca24","#f0932b","#eb4d4b","#eb4d4b","#6ab04c","#c7ecee","#7ed6df"];
    this.selectedColor = this.colors[Math.floor(this.colors.length*Math.random())]
  }

  colorChanged(){
    console.log(this.slides.getActiveIndex())
  }
  selectColor(color){
    this.selectedColor = color;
  }

  submitPost(){
    let post: any;
    if(this.postType == 'text'){
      post ={
        type: this.postType,
        text: this.statusText,
        color: this.selectedColor
      }
    }else if(this.postType == 'image'){
      post ={
        type: this.postType,
        text: this.imgText,
        image: this.image
      }
    }else if(this.postType == 'video'){
      post ={
        type: this.postType,
        text: this.videoText,
        videoLink: this.video
      }
    }


    console.log(post);
    this.feedProvider.newPost(post);
    this.navCtrl.pop();
  }

  takePicture(openCamera){
    this.imageSelectorProvider.takeImg(openCamera);
  }


}
