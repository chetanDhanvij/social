import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, Events } from 'ionic-angular';
import { ImageSelectorProvider } from '../../providers/image-selector/image-selector';
import { FeedProvider } from '../../providers/feed/feed';

/**
 * Generated class for the MediaUploadPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-media-upload',
  templateUrl: 'media-upload.html',
})
export class MediaUploadPage {
  @ViewChild('myvideo') myVideo: any;
  // @ViewChild('myvideo2') myVideo2: any;
  videoLoaded:boolean =  false;
  status: any[] = [];
  contentData: any;
  uploadProgress: number;
  videoText: string = '';
  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public toastCtrl: ToastController,
              private imageSelectorProvider: ImageSelectorProvider,
              private feedProvider: FeedProvider,
              private events: Events) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MediaUploadPage');
    this.imageSelectorProvider.mediaUploadStatus.subscribe((data:any)=>{
      this.status.unshift(data);
      console.log(data);
      if(data.show){
        this.videoLoaded = true;
        let video = this.myVideo.nativeElement;
        video.src = data.data;
        video.play();
      }
      if(data.updateProgress){
        this.uploadProgress = Math.floor(data.progress);
      }
    })
    this.imageSelectorProvider.getMedia().then((data)=>{
      this.contentData = data
      console.log("resolved", this.contentData)
    }).catch((error)=>{
      let toast = this.toastCtrl.create({
        message: 'Error:'+JSON.stringify(error),
        duration: 3000
      });
      toast.present();
    })
  }

  upload(){
    this.imageSelectorProvider.upload(this.contentData.blob, this.contentData.name , this.contentData.file.type).then((data: any)=>{
      console.log(data);
      // let video = this.myVideo2.nativeElement;
      //   video.src = data.url;
      //   video.play();
        let postData = {
          type: 'video',
          text: this.videoText || '',
          url: data.url,
          mediaType: data.mediaType,
          isShared: false
        };
        this.feedProvider.newPost(postData).then(()=>{
          this.events.publish('post:created');
        })
        this.uploadProgress = undefined;
        this.navCtrl.pop();
    }).catch((error)=>{
      console.log(error);
      let toast = this.toastCtrl.create({
        message: 'Error:'+JSON.stringify(error),
        duration: 3000
      });
      toast.present();
    })
  }

}
