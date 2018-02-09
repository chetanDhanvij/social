import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, FabContainer, LoadingController, Loading } from 'ionic-angular';
import { FeedProvider } from '../../providers/feed/feed';
import { UserDataProvider } from '../../providers/user-data/user-data'
import { ImageSelectorProvider } from '../../providers/image-selector/image-selector'

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
    this.loading = this.loadingController.create();
    this.loading.present();
  }

  goToPost(type, fab: FabContainer){
    fab.close();
    this.navCtrl.push("NewPostPage",{type: type})
  }

  getPost(){
    this.feedProvider.getPost().on("child_added",(snapshot)=>{
      let postData = snapshot.val();
      console.log(postData);
      this.userDataProvider.getUserDetail(postData.uid).then((userData: any)=>{
        let userDataVal = userData.val()
        console.log(userDataVal);
        postData.userName = userDataVal.firstName + " " + userDataVal.lastName;
        postData.profileImgURL = userDataVal.profileImgURL;
        this.posts.push(postData);
        this.posts;
        try{
          this.loading.dismiss();
        }catch(e){
          console.log(e);
        }

      }).catch((err)=>{
        console.log("Error")
      })


    })
  }

}
