import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, FabContainer, LoadingController, Loading } from 'ionic-angular';
import { FeedProvider } from '../../providers/feed/feed';
import { UserDataProvider } from '../../providers/user-data/user-data'

import { ImageSelectorProvider } from '../../providers/image-selector/image-selector'

import { DataSnapshot } from '@firebase/database';


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
  userLikedPost: any[];
  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              private feedProvider: FeedProvider,
              private userDataProvider: UserDataProvider,
              private loadingController: LoadingController,
              private imageSelectorProvider: ImageSelectorProvider) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad FeedPage');
    this.getPost();
    // this.loading = this.loadingController.create();
    // this.loading.present();
    this.feedProvider.listenUserLikedPost().on("value",(likedPost: any)=>{
      console.log("likedPostlikedPostlikedPostlikedPostlikedPostlikedPost")
      console.log(likedPost.val())
      if(likedPost.val() != undefined && likedPost.val() != null ){
        this.userLikedPost = likedPost.val();
      }else{
        this.userLikedPost = [];
      }

    })
    
  }

  goToPost(type, fab: FabContainer){
    fab.close();
    this.navCtrl.push("NewPostPage",{type: type})
  }

  getPost(){
    this.feedProvider.getPost().then((data: any)=>{

      let postData = data;
      console.log(data);
      for(let d of postData){
        this.userDataProvider.getUserDetail(d.uid).then((userData: any)=>{
          let userDataVal = userData.val()
          console.log(userDataVal);
          d.userName = userDataVal.firstName + " " + userDataVal.lastName;
          d.profileImgURL = userDataVal.profileImgURL;
          this.posts.push(d);
          console.log(d);
          try{
            this.loading.dismiss();
          }catch(e){
            console.log(e);
          }
  
        }).catch((err)=>{
          console.log("Error")
        })
      }



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

}
