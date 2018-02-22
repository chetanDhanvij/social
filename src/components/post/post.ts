import { Component,  ElementRef, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import { FeedProvider } from '../../providers/feed/feed';
import {  NavController, NavParams, AlertController, ToastController , LoadingController  } from 'ionic-angular';
import { UserDataProvider } from '../../providers/user-data/user-data';

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
  @Input('currentUid') currentUid;
  
  @Input('showlikes') showlikes: boolean;
  @Output() onShare = new EventEmitter();

  userLikedPost: any[] = [];
  userLiked: any;

  constructor(private feedProvider: FeedProvider,
              public navCtrl: NavController,
              private alertCtrl: AlertController,
              private toastCtrl: ToastController,
              public userDataProvider: UserDataProvider,
              private loadingController: LoadingController ) {

  } 

  ngAfterViewInit() {
    this.feedProvider.listenUserLikedPost().on("value",(likedPost: any)=>{
      if(likedPost.val() != undefined && likedPost.val() != null ){
        this.userLikedPost = likedPost.val();
      }else{
        this.userLikedPost = [];
      }

    })


  }
  ngOnChanges(changes){
    this.getUserWhoLikedPost();
  }

  likePost(postKey, postLikeCount, shouldLike){
    this.feedProvider.likePost(postKey, postLikeCount, shouldLike)
    this.getUserWhoLikedPost();
  }

  showPostDetail(post){
    this.navCtrl.push("PostDetailPage",{post: post});
  }

  getUserWhoLikedPost(){
    this.feedProvider.getUserWhoLikedPost(this.post.key).then((user)=>{
      this.userLiked = user;
    })
  }


  sharePost(post){

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
    let loading = this.loadingController.create();
    loading.present();
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
    this.feedProvider.newPost(post).then(()=>{
      let toast = this.toastCtrl.create({
        message: 'Post shared successfully',
        duration: 2000
      });
      toast.present();
      loading.dismiss();
      this.onShare.emit();
    })
  }

  gotoUser(uid){
    this.userDataProvider.getUserDetail(uid).then((user)=>{
      console.log(user);
      this.navCtrl.push("UserDetailPage",{ user: user})
    })

  }

  deletePost(post){
    if(this.currentUid == post.uid){
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
              this.feedProvider.deletePost(post.key).then(()=>{
                this.onShare.emit()
              })
            }
          }
        ]
      });
      confirm.present();
    }

  }


}
