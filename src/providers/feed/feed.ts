
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

  likePost(postKey, postLikeCount: number = 0, shouldLike){
    console.log(postKey);
    if (this.currentUser) {
      if(shouldLike){
        postLikeCount = postLikeCount + 1;
      }else{
        postLikeCount = postLikeCount - 1;
      }


      firebase.database().ref(`/publicPostLikedList/${postKey}/${this.currentUser.uid}`).set(shouldLike)
      firebase.database().ref(`/publicPost/${postKey}/likeCount`).set(postLikeCount);
      firebase.database().ref(`/userProfile/${this.currentUser.uid}/postLiked/${postKey}`).set(shouldLike);
    }
  }

  getUserWhoLikedPost(postKey){
    return new Promise((resolve, reject)=>{
      firebase.database().ref(`/publicPostLikedList/${postKey}`).once('value',(userList)=>{
        let userWhoLike = userList.val();
        console.log(userWhoLike);
        resolve(userWhoLike);
      })
    })
  }


  getUserLikedPost(){
    return new Promise((resolve, reject)=>{
      if (this.currentUser) {
        firebase.database().ref(`/userProfile/${this.currentUser.uid}/postLiked/`).once("value",(likedPost)=>{
          console.log("likedPostlikedPostlikedPost");
          console.log(likedPost.val());
          resolve(likedPost.val());
        })
      }
    })
  }

  listenUserLikedPost(){
    return firebase.database().ref(`/userProfile/${this.currentUser.uid}/postLiked/`)
  }

}
