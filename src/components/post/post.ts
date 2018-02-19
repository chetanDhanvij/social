import { Component,  ElementRef, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import { FeedProvider } from '../../providers/feed/feed';
import {  NavController, NavParams, AlertController, ToastController   } from 'ionic-angular';

/**
 * Generated class for the PostComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'post',
  templateUrl: 'post.html'
})
export class PostComponent {

  @Input('post') post;
  @Input('showlikes') showlikes: boolean;
  _showlikes
  @Output() onShare = new EventEmitter();

  userLikedPost: any[] = [];
  userLiked: any;

  constructor(private feedProvider: FeedProvider,
              public navCtrl: NavController,
              private alertCtrl: AlertController,
              private toastCtrl: ToastController ) {
    console.log('Hello PostComponent Component');
  } 

  ngAfterViewInit() {
    this.feedProvider.listenUserLikedPost().on("value",(likedPost: any)=>{
      console.log("likedPostlikedPostlikedPostlikedPostlikedPostlikedPost")
      console.log(likedPost.val())
      if(likedPost.val() != undefined && likedPost.val() != null ){
        this.userLikedPost = likedPost.val();
      }else{
        this.userLikedPost = [];
      }

    })
    this.getUserWhoLikedPost();
    console.log(this.showlikes,"showlikes")

  }
  ngOnChanges(changes){
    console.log("changes", changes);
    this._showlikes = this.sharePost;
  }

  likePost(postKey, postLikeCount, shouldLike){
    this.feedProvider.likePost(postKey, postLikeCount, shouldLike)
    console.log(postKey);
    this.getUserWhoLikedPost();
  }

  showPostDetail(post){
    this.navCtrl.push("PostDetailPage",{post: post});
  }

  getUserWhoLikedPost(){
    this.feedProvider.getUserWhoLikedPost(this.post.key).then((user)=>{
      console.log(user);
      this.userLiked = user;
      console.log("this.userLiked", this.userLiked);
    })
  }


  sharePost(post){
    console.log(post);
    let confirm = this.alertCtrl.create({
      title: 'Share',
      message: 'Would you like to share this post with your name?',
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
            this.submitPost(post)
          }
        }
      ]
    });
    confirm.present();
  }

  private   submitPost(postToshare){
    let post: any;
    if(postToshare.content.type == 'text'){
      post ={
        isShared: true,
        type: postToshare.content.type,
        text: postToshare.content.text,
        color: postToshare.content.color,
        originalUid: postToshare.uid,
        originalKey: postToshare.key,
        originalUserName: postToshare.userName
      }
    }else if(postToshare.content.type == 'image'){
      post ={
        isShared: true,
        type: postToshare.content.type,
        text: postToshare.content.text,
        image: postToshare.content.image,
        originalUid: postToshare.uid,
        originalKey: postToshare.key,
        originalUserName: postToshare.userName
      }
    }

    console.log(postToshare);
    console.log(post);
    this.feedProvider.newPost(post).then(()=>{
      let toast = this.toastCtrl.create({
        message: 'Post shared successfully',
        duration: 2000
      });
      toast.present();
      this.onShare.emit();
    })
  }


}
