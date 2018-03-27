import { Component,  ElementRef, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import { FeedProvider } from '../../providers/feed/feed';
import {  NavController, NavParams, AlertController, ToastController , LoadingController, ModalController  } from 'ionic-angular';
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
  comments: any[] = [];
  viewType: string =  "Likes";

  constructor(private feedProvider: FeedProvider,
              public navCtrl: NavController,
              private alertCtrl: AlertController,
              private toastCtrl: ToastController,
              public userDataProvider: UserDataProvider,
              private loadingController: LoadingController,
              private modalCtrl: ModalController, ) {

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
    this.getComments();
  }

  likePost(postKey, postLikeCount, shouldLike){
    this.feedProvider.likePost(postKey, postLikeCount, shouldLike)
    this.getUserWhoLikedPost();
  }

  showPostDetail(post){
    if(!this.showlikes){
      this.navCtrl.push("PostDetailPage",{post: post});
    }    
  }

  getUserWhoLikedPost(){
    this.feedProvider.getUserWhoLikedPost(this.post.key).then((user)=>{
      this.userLiked = user;
    })
  }

  getComments(){
    this.feedProvider.getComments(this.post.key).then((user: any[])=>{
      this.comments = user;
    })
  }

  deleteComment(postKey,commentKey){

      let confirm = this.alertCtrl.create({
        title: 'Delete',
        message: 'Do you want to delete the comment?',
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
              console.log(postKey,commentKey);
              let loading = this.loadingController.create();
              loading.present();
              this.feedProvider.deleteComment(postKey,commentKey).then((user: any[])=>{
                this.getComments();
                this.feedProvider.reloadFeed();
                loading.dismiss();
              })
            }
          }
        ]
      });
      confirm.present();

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
    }else if(postToshare.content.type == 'video'){
      console.log(postToshare);
      post ={
        isShared: true,
        type: postToshare.content.type,
        text: postToshare.content.text,
        url: postToshare.content.url,
        originalUid: postToshare.uid,
        originalKey: postToshare.key,
        originalUserName: postToshare.userName,
        mediaType: postToshare.content.mediaType
      }
    }
    this.feedProvider.newPost(post).then(()=>{
      let toast = this.toastCtrl.create({
        message: 'Post shared successfully',
        duration: 2000
      });
      toast.present();
      try{
        loading.dismiss();
      }catch(e){
        console.log(e);
      }
      
      this.onShare.emit();
      this.feedProvider.reloadFeed();
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
                this.onShare.emit();
                this.feedProvider.reloadFeed();
                if(this.showlikes){
                  this.navCtrl.pop();
                }                
              })
            }
          }
        ]
      });
      confirm.present();
    }

  }

  showCommentPrompt(post) {
    let commentModal = this.modalCtrl.create("AddCommentPage");
		commentModal.onDidDismiss(comment => {
      console.log(comment)
      if(comment != undefined){
        let loading = this.loadingController.create();
        loading.present();
        this.feedProvider.addComment(post.key,comment).then(()=>{
          this.getComments();
          this.feedProvider.reloadFeed();
          loading.dismiss();
        })
      }
		});
		commentModal.present();
    

  }


  videoStart(ev){
    let videos: any = document.getElementsByClassName('videos');
    for(let video of videos){
      console.log(video);
      if(video != ev.srcElement)
      video.pause();
    }
    // ev.srcElement.play();
    console.log("Video started", ev)
  }


}
