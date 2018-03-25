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
  mySubscription: any;
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
      this.friends = friends.map((d)=>{
        let returnValue = d;
        returnValue.key = d.uid;
        return returnValue;
      })
      this.userDataProvider.getUserListforIds(this.friends.map(d => d.key)).then((data)=>{
        this.friends = data.map((d,i)=>{
          let returnValue:any = {};
          let dVal = d.val();
          returnValue = dVal;
          returnValue.key = d.key;
          returnValue.connectionType = this.friends[i].connectionType;
          returnValue.time = this.friends[i].time;
          console.log(dVal)
          return returnValue
        })

      })
      this.listenConnectionType();
    })
  }

  listenConnectionType(){
    this.mySubscription = this.friendsProvider.subConnectionType.subscribe((type)=>{
      if(!this.friendsProvider.hasConnectionType){
        console.log("type == {} hence initializing")
        this.friendsProvider.initConnectionType()
      }else{     
        console.log("TYPEEEEEEEEEEEEEEEEEEEEEEEE", type)
        this.friends = this.friends.map((d)=>{
          d.connectionType = type[d.key];
          return d;
        })
      }
    })
  }

  ngOnDestroy() {
      this.mySubscription.unsubscribe();
  }

}
