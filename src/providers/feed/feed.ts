
import { Injectable } from '@angular/core';
import firebase from 'firebase';
import { User } from '@firebase/auth-types';
import { Reference, ThenableReference } from '@firebase/database-types';

/*
  Generated class for the FeedProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class FeedProvider {

  currentUser:any;
  postRef: Reference
  constructor() {
    console.log('Hello FeedProvider Provider');
    firebase.auth().onAuthStateChanged(user => {
      this.currentUser = user;
      if(user){
        this.postRef = firebase.database().ref(`/publicPost/`);
      }
    });
  }


  newPost(postData){
    let post: any = {};
    console.log(postData)
    if(postData.type == 'text'){
      post ={
        type: postData.type,
        text: postData.text,
        color: postData.color
      }
    }else if(postData.type == 'image'){
      post ={
        type: postData.type,
        text: postData.text,
        image: postData.image
      }
    }else if(postData.type == 'video'){
      post ={
        type: postData.type,
        text: postData.text,
        videoLink: postData.videoLink
      }
    }

    post.createdAt = firebase.database.ServerValue.TIMESTAMP
      if (this.currentUser) {
        let postObj: any = {
          uid: this.currentUser.uid,
          content: post
        }

        console.log(postObj)
        this.postRef.push(postObj);

      }
  }

  getPost(){
    console.log(this.postRef);
    return this.postRef.orderByChild('createdAt');
  }

}
