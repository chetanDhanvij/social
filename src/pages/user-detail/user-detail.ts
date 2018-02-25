import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { FeedProvider } from '../../providers/feed/feed';
import { ProfileProvider } from '../../providers/profile/profile';
import { UserDataProvider } from '../../providers/user-data/user-data'

/**
 * Generated class for the UserDetailPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-user-detail',
  templateUrl: 'user-detail.html',
})
export class UserDetailPage {
  user:any = {};
  userID:string;
  view:string = "PROFILE";
  posts;
  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              public feedProvider: FeedProvider,
              private profileProvider: ProfileProvider,
              private userDataProvider: UserDataProvider) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad UserDetailPage');

    this.pageInit()
  }

  pageInit(){
    this.user = this.navParams.get("user");
    console.log("uiduiduiduiduiduid",this.user)
    this.userID = this.profileProvider.getCurrentUser();
    if(this.user == undefined){
      console.log("uiduiduiduiduiduid",this.userID)
      this.userDataProvider.getUserDetail(this.userID).then((user)=>{
        console.log(user);
        this.user = user;
        this.getPostForUser(this.userID);
        try{
          this.refresher.complete();
        }catch(e){
        }
      })
    }else{
      this.getPostForUser(this.user.key);
      try{
        this.refresher.complete();
      }catch(e){
      }
    }
  }


  goToChat(){
    this.navCtrl.push("ChatPage",{user: this.user});
  }

  getPostForUser(uid){
    console.log(this.user);
    this.feedProvider.getPostForUser(uid).then((data: any)=>{
      console.log(data);
      for(let d of data){
          d.userName = this.user.firstName + " " + this.user.lastName;
          d.profileImgURL = this.user.profileImgURL;
      }

      this.posts = data;
      console.log(this.posts)
    })
  }

  gotoProfile(){
    this.navCtrl.push("ProfilePage");
  }

  gotoAdvertise(){
    console.log(this.userID, this.user.key, this.userID == this.user.key)
    if(this.userID == this.user.key){
      this.navCtrl.push("AdvertisementPage");
    }else{
      alert("Not allowed");
    }

  }

  refresher
  doRefresh(refresher) {
    this.refresher = refresher;
    console.log('Begin async operation', refresher);
    this.pageInit();
  }

  gotoSupport(){
    this.navCtrl.push("SupportPage");
  }

}
