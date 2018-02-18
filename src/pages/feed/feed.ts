import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, FabContainer, LoadingController, Loading, AlertController, Events, Content   } from 'ionic-angular';
import { FeedProvider } from '../../providers/feed/feed';
import { UserDataProvider } from '../../providers/user-data/user-data'

import { ImageSelectorProvider } from '../../providers/image-selector/image-selector'

import { DataSnapshot } from '@firebase/database';
import { ProfileProvider } from '../../providers/profile/profile'


/**
 * Generated class for the FeedPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-feed',
  templateUrl: 'feed.html',
})
export class FeedPage {
  posts: any= [];
  loading: Loading;
  userLikedPost: any[] = [];
  currentUid: string;
  @ViewChild(Content) content: Content;
  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              private feedProvider: FeedProvider,
              private userDataProvider: UserDataProvider,
              private loadingController: LoadingController,
              private imageSelectorProvider: ImageSelectorProvider,
              private alertCtrl: AlertController,
              public events: Events,
              private profileProvider: ProfileProvider) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad FeedPage');
    this.getPost();

    this.feedProvider.listenUserLikedPost().on("value",(likedPost: any)=>{
      console.log("likedPostlikedPostlikedPostlikedPostlikedPostlikedPost")
      console.log(likedPost.val())
      if(likedPost.val() != undefined && likedPost.val() != null ){
        this.userLikedPost = likedPost.val();
      }else{
        this.userLikedPost = [];
      }

    })

    // second page (listen for the user created event)
    this.events.subscribe('post:created', () => {
      // userEventData is an array of parameters, so grab our first and only arg
      console.log('post Created');
      this.getPost();
    });

    console.log("this.profileProvider.getCurrentUser()",this.profileProvider.getCurrentUser())
    this.currentUid = this.profileProvider.getCurrentUser();
  }

  goToPost(type, fab: FabContainer){
    fab.close();
    this.navCtrl.push("NewPostPage",{type: type})
  }

  getPost(){
    this.loading = this.loadingController.create();
    this.loading.present();
    this.feedProvider.getPost().then((data: any)=>{

      let postData = data;
      this.posts = postData;
      console.log(data);
      for(let d of postData){
        this.userDataProvider.getUserDetail(d.uid).then((userData: any)=>{
          let userDataVal = userData.val()
          d.userName = userDataVal.firstName + " " + userDataVal.lastName;
          d.profileImgURL = userDataVal.profileImgURL;
          // this.posts.push(d);
          this.content.scrollToTop();
  
        }).catch((err)=>{
          console.log("Error")
        })
      }
      setTimeout(()=>{
          this.loading.dismiss();
      },500)



    })
  }

  likePost(postKey, postLikeCount, shouldLike){
    this.feedProvider.likePost(postKey, postLikeCount, shouldLike)
    console.log(postKey);
  }

  showLiks(postKey){
    console.log("postKey", postKey );
    this.feedProvider.getUserWhoLikedPost(postKey).then((userList)=>{
      console.log(userList);
    })
  }

  showPostDetail(post){
    this.navCtrl.push("PostDetailPage",{post: post});
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
      this.getPost();
    })
  }


  loadMore(){
    console.log("load more")
  }

  deletePost(post){
    if(this.currentUid == post.uid){
      console.log(post.key);
      console.log(post);
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
                this.getPost();
              })
            }
          }
        ]
      });
      confirm.present();
    }

  }

}
