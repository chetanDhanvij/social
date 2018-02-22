
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
    return new Promise((resolve, reject)=>{
       firebase.database().ref(`/userProfile/`).once('value').then((data)=>{
        let dataVal = data.val() 
        console.log(dataVal);
        console.log(Object.keys(dataVal))
        let dataArr = Object.keys(dataVal).map((key)=>{
          let returnObj = dataVal[key];
          returnObj.fullName = dataVal[key].firstName +" "+ dataVal[key].lastName;
          returnObj.key = key;
          return returnObj;
        })
        resolve(dataArr);
       }).catch((err)=>{
         reject(err);
       })


    })

  }

  getUserDetail(uid){
    return new Promise((resolve, reject)=>{
       firebase.database().ref(`/userProfile/${uid}`).once('value').then((data)=>{
        let dataVal = data.val();
        dataVal.fullName = dataVal.firstName +" "+ dataVal.lastName;
        dataVal.key = data.key;
        console.log(dataVal);
        resolve(dataVal)
       }).catch((err)=>{
         reject(err);
       })

    })

  }

  getUsernameList(uids){
    let promises = []
    for(let uid of uids){
      promises.push(firebase.database().ref(`/userProfile/${uid}/firstName`).once('value'))
    }
    return Promise.all(promises)

 }
}
