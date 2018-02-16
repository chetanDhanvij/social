
import { Injectable } from '@angular/core';
import firebase from 'firebase';
import { Reference } from '@firebase/database-types';

/*
  Generated class for the UserDataProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class UserDataProvider {

  constructor() {
    console.log('Hello UserDataProvider Provider');
  }
  

  getUserList(){
    return firebase.database().ref(`/userProfile/`).once('value')
  }

  getUserDetail(uid){
     return firebase.database().ref(`/userProfile/${uid}`).once('value')
  }

  getUsernameList(uids){
    let promises = []
    for(let uid of uids){
      promises.push(firebase.database().ref(`/userProfile/${uid}/firstName`).once('value'))
    }
    return Promise.all(promises)

 }
}
