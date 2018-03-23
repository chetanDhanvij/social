import { Injectable } from '@angular/core';
import { ProfileProvider } from '../profile/profile'
import firebase from 'firebase';
import { Reference } from '@firebase/database-types';
import { UserDataProvider } from '../user-data/user-data';
/*
  Generated class for the FriendsProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class FriendsProvider {

  requestsRef
  constructor(private profileProvider: ProfileProvider,
              private userDataProvider: UserDataProvider) {
    console.log('Hello FriendsProvider Provider');
  }

  addFriend(receiverUid){
    return new Promise((resolve, reject)=>{
      let currentUserUid = this.profileProvider.currentUser.uid;
      console.log(currentUserUid, receiverUid);
      firebase.database().ref(`/requests/${currentUserUid}/requestsSent/`).push(receiverUid)
      firebase.database().ref(`/requests/${receiverUid}/requestsReceived/`).push(currentUserUid)
    })    
  }

  getRequestsReceived(){
    return new Promise((resolve, reject)=>{
      let currentUserUid = this.profileProvider.currentUser.uid;
      firebase.database().ref(`/requests/${currentUserUid}/requestsReceived/`).once('value').then((data)=>{
        let userIds = [];
        data.forEach((child)=> {
           userIds.push(child.val())
          //  commentKey.push(child.key)
        });
        if(userIds == null){
          userIds = [];
        } 
        console.log("userIds",userIds);
        let returnValue;
        this.userDataProvider.getUserListforIds(userIds).then((data)=>{
          returnValue = data.map((d,i)=>{
            let dVal = d.val();
            dVal.key = d.key;
            dVal.fullName = dVal.firstName +" "+ dVal.lastName
            return dVal
          })
          resolve(returnValue);
        })

      });
    })
  }

}
