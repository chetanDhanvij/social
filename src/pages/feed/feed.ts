import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, FabContainer, LoadingController, Loading, AlertController, Events, Content   } from 'ionic-angular';
import { FeedProvider } from '../../providers/feed/feed';
import { UserDataProvider } from '../../providers/user-data/user-data'

import { ImageSelectorProvider } from '../../providers/image-selector/image-selector'

import { DataSnapshot } from '@firebase/database';
import { ProfileProvider } from '../../providers/profile/profile';
import { AdvertisementProvider } from '../../providers/advertisement/advertisement'


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
              private profileProvider: ProfileProvider,
              private advertisementProvider: AdvertisementProvider) {
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
    this.advertisementProvider.initAdvertisement();
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
      for(let d of postData){
        console.log(d.uid)
        this.userDataProvider.getUserDetail(d.uid).then((userData: any)=>{
          let userDataVal = userData;
          d.userName = userDataVal.firstName + " " + userDataVal.lastName;
          d.profileImgURL = userDataVal.profileImgURL;
          // this.posts.push(d);
          try{
            this.refresher.complete();
          }catch(e){
          }

          this.content.scrollToTop();
  
        }).catch((err)=>{
          console.log(err)
        })
      }
      setTimeout(()=>{
          this.loading.dismiss();
      },500)



    })
  }

  showLiks(postKey){

    this.feedProvider.getUserWhoLikedPost(postKey).then((userList)=>{

    })
  }

  showPostDetail(post){
    this.navCtrl.push("PostDetailPage",{post: post});
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
      this.getPost();
    })
  }


  loadMore(){
    console.log("load more")
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
                this.getPost();
              })
            }
          }
        ]
      });
      confirm.present();
    }

  }

  refresher
  doRefresh(refresher) {
    this.refresher = refresher;
    console.log('Begin async operation', refresher);
    this.getPost()
  }

}
