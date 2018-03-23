import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { UserDataProvider } from '../../providers/user-data/user-data';
import { FriendsProvider } from '../../providers/friends/friends'

/**
 * Generated class for the FriendsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-friends',
  templateUrl: 'friends.html',
})
export class FriendsPage {
  private tab: any;
  private title: any;
  private allUsers: any;
  private receivedRequest: any;
  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              private userData: UserDataProvider,
              private friendsProvider: FriendsProvider) {
  }

  ionViewDidLoad() {
    this.tab == 'search';
    this.title = "Friends";
    console.log('ionViewDidLoad FriendsPage');
  }

  segmentChanged($event){
    if(this.tab == 'friends'){
      this.title = "Friends"; this.getFriends();
    }
    else if(this.tab == 'requests'){
      this.title = "Friend Requests"; this.getFriendRequests();
    }
    else if(this.tab == 'search'){
      this.title = "Find New Friends"; this.findNewFriends();
    }
  }

  getFriends(){

  }
  getFriendRequests(){
    this.friendsProvider.getRequestsReceived().then((user)=>{
      console.log(user)
      this.receivedRequest = user;
    })
  }
  findNewFriends(){
    this.userData.getUserList().then((dataArr: any[])=>{
      this.allUsers = dataArr;
      console.log(dataArr);
    }).catch((err)=>{
      console.log(err);
    })
  }



}
