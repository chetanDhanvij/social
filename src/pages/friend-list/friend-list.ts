import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { FriendsProvider } from '../../providers/friends/friends';
import { UserDataProvider } from '../../providers/user-data/user-data';

/**
 * Generated class for the FriendListPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-friend-list',
  templateUrl: 'friend-list.html',
})
export class FriendListPage {
  user: any;
  friends:  any[];
  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              private friendsProvider: FriendsProvider,
              private userDataProvider: UserDataProvider) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad FriendListPage');
    this.user = this.navParams.get("user");
    console.log(this.user);
    this.getFriends();
  }


  getFriends(){
    this.friendsProvider.getFriends(this.user.key).then((friends: any[])=>{
      this.friends = friends;
      this.userDataProvider.getUserListforIds(this.friends.map(d => d.uid)).then((data)=>{
        this.friends = data.map((d,i)=>{
          let dVal = d.val()
          console.log(dVal)
          return { name: dVal.firstName + " " + dVal.lastName, 
                   uid: d.key, 
                   time: this.friends[i].time,
                   profileImgURL: dVal.profileImgURL }
        })

      })
    })
  }

}
