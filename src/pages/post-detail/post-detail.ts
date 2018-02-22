import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { FeedProvider } from '../../providers/feed/feed';
import { UserDataProvider } from '../../providers/user-data/user-data';


/**
 * Generated class for the PostDetailPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-post-detail',
  templateUrl: 'post-detail.html',
})
export class PostDetailPage {
  post: any = {};
  userLiked: any = [];
  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              public feedProvider: FeedProvider,
              public userDataProvider: UserDataProvider) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PostDetailPage');
    this.post = this.navParams.get("post");
    console.log(this.post);
    this.feedProvider.getUserWhoLikedPost(this.post.key).then((user)=>{
      console.log(user);
      this.userLiked = user
    })
  }

  gotoUser(uid){
    console.log(uid);
    this.userDataProvider.getUserDetail(uid).then((user)=>{
      // console.log(user.val());
      // this.navCtrl.push("UserDetailPage",{ user: user.val()})
    })

  }

}
