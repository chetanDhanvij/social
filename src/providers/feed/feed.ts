
import { Injectable } from '@angular/core';
import firebase from 'firebase';
import { User } from '@firebase/auth-types';
import { Reference, ThenableReference } from '@firebase/database-types';
import * as moment from 'moment';
import { UserDataProvider } from '../user-data/user-data';

/*
  Generated class for the FeedProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class FeedProvider {

  currentUser:any;
  postRef: Reference
  constructor(private userDataProvider: UserDataProvider) {
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
      post.createdAt = firebase.database.ServerValue.TIMESTAMP;
      if (this.currentUser) {
        let postObj: any = {
          uid: this.currentUser.uid,
          content: post
        }
        console.log(postObj)
        this.postRef.push(postObj);
      }
    }else if(postData.type == 'image'){
      this.postImage(postData)
    }else if(postData.type == 'video'){
      post ={
        type: postData.type,
        text: postData.text,
        videoLink: postData.videoLink
      }
    }
  }

  getPost(){
    console.log(this.postRef);
    return new Promise((resolve, reject)=>{
    
      this.postRef.orderByChild('createdAt').limitToLast(2).once("value").then((data)=>{
        console.log(data.val())
        console.log(Object.keys(data.val()))
        let dataVal = data.val();
        let dataKey = Object.keys(data.val());
        let returnValue = []
        returnValue = dataKey.map((d)=>{
          let rV = dataVal[d]
          rV.key = d
          return rV
        })
        console.log(returnValue);
        resolve(returnValue);
      }).catch((err)=>{
        reject(err);
      })
    })

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
        let userWhoLikeArray =  Object.keys(userWhoLike);
        let returnValue = []
        console.log(userWhoLike,userWhoLikeArray);
        userWhoLikeArray = userWhoLikeArray.filter((d)=>{
          return userWhoLike[d]
        })
        this.userDataProvider.getUsernameList(userWhoLikeArray).then((data)=>{
          for(let d of data){
            console.log(d.val());
          }
          returnValue = data.map((d,i)=>{
            return {name: d.val(), uid: userWhoLikeArray[i]}
          })
          console.log(userWhoLike,userWhoLikeArray);

          resolve(returnValue);

        })

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

  private postImage(postData){
    if (this.currentUser) {
      this.uploadToCloud(postData.image,moment().unix()).then((url)=>{
        console.log(url);
        let post: any = {};
        post ={
          type: postData.type,
          text: postData.text,
          image: url
        }
        let postObj: any = {
          uid: this.currentUser.uid,
          content: post
        }
        post.createdAt = firebase.database.ServerValue.TIMESTAMP;
        let postRefData: any = this.postRef.push(postObj);
      })
    }
  }

  private uploadToCloud(img,key) {
    return new Promise((resolve, reject)=>{
      firebase
      .storage()
      .ref(`/posts/${this.currentUser.uid}/${key}/image.jpeg`)
      .putString(img, 'base64', { contentType: 'image/jpeg' })
      .then((savedPicture) => {
        console.log(savedPicture);
        resolve(savedPicture.downloadURL);
      });
    })
  }

}
