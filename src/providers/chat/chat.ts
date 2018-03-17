
import { Injectable } from '@angular/core';
import firebase from 'firebase';
import { User } from '@firebase/auth-types';
import { Reference, ThenableReference } from '@firebase/database-types';
import * as moment from 'moment';
import { SqlChatProvider } from '../sql-chat/sql-chat';


/*
  Generated class for the ChatProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
declare var window: any
@Injectable()
export class ChatProvider {
  currentUser: any;
  chatRef: any;
  constructor(private sqlChatProvider: SqlChatProvider) {
    console.log('Hello ChatProvider Provider');
  }
  init(){
    firebase.auth().onAuthStateChanged(user => {
      this.currentUser = user;
      if(user){
        this.chatRef = firebase.database().ref(`/chats/`);
      }
    });
    this.sqlChatProvider.init()

    // window.FirebasePlugin.onTokenRefresh(function(token) {
    //   console.log(" window.FirebasePlugin.onTokenRefresh Succcess")
    //     // save this server-side and use it to push notifications to this device
    //     console.log(token);
    // }, function(error) {
    //   console.log(" window.FirebasePlugin.onTokenRefresh Error")
    //     console.error(error);
    // });

    // window.FirebasePlugin.onNotificationOpen(function(notification) {
    //   console.log(" window.FirebasePlugin.onNotificationOpen Succcess")
    //     console.log(notification);
    // }, function(error) {
    //   console.log(" window.FirebasePlugin.onNotificationOpen Error")
    //     console.error(error);
    // });
  }

  sendMsg(user, msg){
    return new Promise((resolve,reject)=>{
      let _msg: any = {};
        if(msg.type == 'text'){
          _msg = {
            type: msg.type,
            text: msg.text
          }

          if (this.currentUser) {
            let timestamp = firebase.database.ServerValue.TIMESTAMP
            _msg = {
              type: msg.type,
              text: msg.text,
              from: this.currentUser.uid,
              to: user,
              createdAt: timestamp
            }
            
            
            const promise = this.chatRef.child(user).push(_msg)
            const key = promise.key;
            console.log(key)
            promise.then(()=>{
              this.sqlChatProvider.sendMsg(key,_msg.from,_msg.to,_msg.type,_msg.text,'',_msg.createdAt).then(()=>{
                resolve()
              }).catch((err)=>{
                reject(err)
              })
               
             }).catch((err)=>{
               reject(err)
             });

          }
        }else if(msg.type == 'image'){
          // if (this.currentUser) {
          //   let timestamp = firebase.database.ServerValue.TIMESTAMP
          //   this.uploadToCloud(msg.image,moment().unix()).then((url)=>{

          //     let post: any = {};
          //     _msg ={
          //       type: msg.type,
          //       text: msg.text,
          //       image: url,
          //       from: this.currentUser.uid,
          //       createdAt: timestamp
          //     }
          //     this.chatRef.child(user).push(_msg).then(()=>{
          //       resolve()
          //     }).catch((err)=>{
          //       reject(err)
          //     });
          //   })
          // }
        }
        

      
    })


  }

  private uploadToCloud(img,key) {
    return new Promise((resolve, reject)=>{
      firebase
      .storage()
      .ref(`/chats/${this.currentUser.uid}/${key}/image.jpeg`)
      .putString(img, 'base64', { contentType: 'image/jpeg' })
      .then((savedPicture) => {
        resolve(savedPicture.downloadURL);
      });
    })
  }

}
