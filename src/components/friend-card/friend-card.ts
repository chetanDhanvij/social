import { Component, Input } from '@angular/core';
import { FriendsProvider } from '../../providers/friends/friends';
import { UserDataProvider } from '../../providers/user-data/user-data'
import { NavController } from 'ionic-angular';

/**
 * Generated class for the FriendCardComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'friend-card',
  templateUrl: 'friend-card.html'
})
export class FriendCardComponent {

  text: string;
  @Input('uid') uid: string;
  @Input('userData') userData: any;
  @Input('connectionType') connectionType: string; //'NOT_CONNECTED' 'REQUEST_SENT' 'REQUEST_RECEIVED' 'SELF'
  @Input('data') data: any;
  @Input('viewType') viewType: string;
  constructor(private friendsProvider: FriendsProvider,
              private userDataProvider: UserDataProvider,
              public navCtrl: NavController,) {
    console.log('Hello FriendCardComponent Component');
    this.text = 'Hello World';
  }

  addFriend(user){
    console.log(user);
    this.friendsProvider.addFriend(user.key).then(()=>{

    })
  }
  ngOnInit(){
  }
  ngOnChanges(){
    console.log("ngOnChanges",this.uid, this.userData, this.connectionType)
    if(this.uid != undefined){
      this.userDataProvider.getUserDetail(this.uid).then((data)=>{
        this.userData = data;
      })
    }else if(this.userData != undefined){

    }else if(this.data != undefined){
      this.checkConnectionType()
    }

  }
  checkConnectionType(){
    if(this.connectionType == 'NOT_CONNECTED'){
      console.log("Not connected");
      this.userDataProvider.getUserDetail(this.data).then((data)=>{
        this.userData = data;
      })
    }else if(this.connectionType == 'REQUEST_SENT'){
      console.log("REQUEST_SENT")
      this.userDataProvider.getUserDetail(this.data.uid).then((data)=>{
        this.userData = data;
      })
    }else if(this.connectionType == 'REQUEST_RECEIVED'){
      console.log("REQUEST_RECEIVED", this.data)
      this.userDataProvider.getUserDetail(this.data.uid).then((data)=>{
        this.userData = data;
      })
    }else if(this.connectionType == 'SELF'){
      console.log("Not connected")
    }else{
      this.friendsProvider.getConnectionType([this.uid]).then((data: string)=>{
        this.connectionType = data;
        console.log('^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^', this.connectionType)
      })
    }
  }


  acceptFriendRequest(user){
    console.log(user);
    this.friendsProvider.acceptFriendRequest(user.key);
  }

  cancelFriendRequest(user){
    console.log(user);
    this.friendsProvider.cancelFriendRequest(user.key);
  }

  markFriendRequestAsSeen(user){
    console.log(user);
    this.friendsProvider.markFriendRequestAsSeen(user.key);
  }

  gotoUser(user){
    console.log(user);
    this.navCtrl.push("UserDetailPage",{ user: user})
  }

}
