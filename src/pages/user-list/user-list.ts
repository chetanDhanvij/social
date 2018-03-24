import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { UserDataProvider } from '../../providers/user-data/user-data';
import { FriendsProvider } from '../../providers/friends/friends'

/**
 * Generated class for the UserListPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-user-list',
  templateUrl: 'user-list.html',
})
export class UserListPage {
  users: any[];
  usersFiltered: any[];
  searchKey: string;

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              private userData: UserDataProvider,
              private friendsProvider: FriendsProvider) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad UserListPage');
    this.userData.getUserList().then((dataArr: any[])=>{
      this.users = dataArr;
      this.usersFiltered = this.users;
      console.log(dataArr);
      this.getConnectionType()

    }).catch((err)=>{
      console.log(err);
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

}
