import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { UserDataProvider } from '../../providers/user-data/user-data';
import { FriendsProvider } from '../../providers/friends/friends';

/**
 * Generated class for the FriendRequestPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-friend-request',
  templateUrl: 'friend-request.html',
})
export class FriendRequestPage {

  users: any[];
  usersFiltered: any[];
  searchKey: string;
  viewType: string;
  mySubscription: any;
  friendRequest: any;
  friendRequestCount: number;


  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              private userData: UserDataProvider,
              private friendsProvider: FriendsProvider) {
  }

  ionViewDidLoad() {
    this.viewType = "ALL"
    console.log('ionViewDidLoad UserListPage');
    let listener = this.friendsProvider.listenRequestsReceived();
    listener.subscribe((data)=>{
      console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!", data);
      this.friendRequest = data || {};
      let _friendRequestIds = Object.keys(this.friendRequest)
      this.friendRequestCount =_friendRequestIds.length;
      this.userData.getUserListforIds(_friendRequestIds).then((dataArr:any)=>{
        this.users  = dataArr.map((d,i)=>{
          let dVal = d.val();
          dVal.key = d.key;
          dVal.fullName = dVal.firstName + " " + dVal.lastName;
          return dVal;
        })
        this.usersFiltered = this.users;
        console.log(dataArr);
        // this.getConnectionType();
        this.listenConnectionType();
  
      }).catch((err)=>{
        console.log(err);
      })
    })
  }
  getConnectionType(){
    this.friendsProvider.getConnectionType( this.users.map(d=> d.key)).then((type)=>{
      console.log("TYPEEEEEEEEEEEEEEEEEEEEEEEE", type)
      this.users = this.users.map((d)=>{
        d.connectionType = type[d.key];
        return d
      })
    })
  }
  listenConnectionType(){
    this.mySubscription = this.friendsProvider.subConnectionType.subscribe((type)=>{
      if(!this.friendsProvider.hasConnectionType){
        console.log("type == {} hence initializing")
        this.friendsProvider.initConnectionType()
      }else{     
        console.log("TYPEEEEEEEEEEEEEEEEEEEEEEEE", type)
        this.users = this.users.map((d)=>{
          d.connectionType = type[d.key];
          return d;
        })
        this.usersFiltered =this.users;
        this.searchKey = "";
        this.onInput(null);
      }
    })
  }
  onInput(ev){
    console.log(ev);
    console.log(this.searchKey);
    this.usersFiltered = this.users.filter((user)=>{
      return user.fullName.toLowerCase().indexOf(this.searchKey.trim().toLowerCase()) > -1 || this.searchKey.trim() =="";
    });
    console.log(this.usersFiltered)
  }

  gotoUser(user){
    console.log(user);
    this.navCtrl.push("UserDetailPage",{ user: user})
  }
  gotoUserList(){
    this.navCtrl.push("UserListPage",{type: "NOT_CONNECTED"}) 
  }

  ngOnDestroy() {
      this.mySubscription.unsubscribe();
  }

}
