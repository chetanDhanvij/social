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
  private receivedRequests: any;
  private sentRequests: any;
  private notConnected: any;
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
    this.friendsProvider.getRequestsSent().then((requests)=>{
      this.sentRequests = requests;
    })
  }
  getFriendRequests(){
    this.friendsProvider.getRequestsReceived().then((requests)=>{
      this.receivedRequests = requests;
    })
  }
  findNewFriends(){
    this.friendsProvider.getNotConnectedUser().then((uids)=>{
      this.notConnected = uids;
    })
  }

  listen(){
    this.friendsProvider.requestsSentSub.subscribe((data)=>{
      console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@",data,"@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@")
    })
  }

  clear(){
    this.friendsProvider.clear()
  }



}
