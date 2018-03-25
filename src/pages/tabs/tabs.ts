import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Tab } from 'ionic-angular';
import { FriendsProvider } from "../../providers/friends/friends"

/**
 * Generated class for the TabsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-tabs',
  templateUrl: 'tabs.html',
})
export class TabsPage {

  tab1Root = "FeedPage";
  tab2Root = "FriendRequestPage";
  tab3Root = "UserDetailPage";
  index = 4;
  friendRequest: any;
  friendRequestCount

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              public friendsProvider: FriendsProvider) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad TabsPage');
    let listener = this.friendsProvider.listenRequestsReceived();
    listener.subscribe((data)=>{
      console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!", data);
      this.friendRequest = data || {};
      this.friendRequestCount = Object.keys(this.friendRequest).length
    })
  }
  tabSelected(tab: Tab) {
    this.index = tab.index;
  }

}
