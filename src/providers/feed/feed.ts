
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
    firebase.auth().onAuthStateChanged(user => {
      this.currentUser = user;
      if(user){
        this.postRef = firebase.database().ref(`/publicPost/`);
      }
    });
  }


  newPost(postData){
    return new Promise((resolve,reject)=>{
      let post: any = {};
      if(postData.isShared){
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
        }    
        if (this.currentUser) {
          let timestamp = firebase.database.ServerValue.TIMESTAMP
          let postObj: any = {
            uid: this.currentUser.uid,
            content: post,
            createdAt: timestamp
          }
            postObj.isShared = true;
            postObj.originalUid = postData.originalUid;
            postObj.originalKey = postData.originalKey;
            postObj.originalUserName = postData.originalUserName;

          const promise = this.postRef.push(postObj);
          const key = promise.key
    
          promise.then(() => {
            const postRef = this.postRef.child(`/${key}`)
            postRef.once('value').then((snapshot) => {

              timestamp = snapshot.val().createdAt * -1
              postRef.update({ createdAt: timestamp  }).then(()=>{
                resolve();
              })
            });
          })
        }

      }else{
        if(postData.type == 'text'){
          post ={
            type: postData.type,
            text: postData.text,
            color: postData.color
          }

          if (this.currentUser) {
            let timestamp = firebase.database.ServerValue.TIMESTAMP
            let postObj: any = {
              uid: this.currentUser.uid,
              content: post,
              createdAt: timestamp
            }
              postObj.isShared = false;

            const promise = this.postRef.push(postObj);
            const key = promise.key
      
            promise.then(() => {
              const postRef = this.postRef.child(`/${key}`)
              postRef.once('value').then((snapshot) => {

                timestamp = snapshot.val().createdAt * -1
                postRef.update({ createdAt: timestamp  }).then(()=>{
                  resolve();
                })
              });
            })
          }
        }else if(postData.type == 'image'){
          if (this.currentUser) {
            let timestamp = firebase.database.ServerValue.TIMESTAMP
            this.uploadToCloud(postData.image,moment().unix()).then((url)=>{

              let post: any = {};
              post ={
                type: postData.type,
                text: postData.text,
                image: url
              }
              let postObj: any = {
                uid: this.currentUser.uid,
                content: post,
                createdAt: timestamp
              }
              postObj.isShared = false;

              const promise = this.postRef.push(postObj);
              const key = promise.key
        
              promise.then(() => {
                const postRef = this.postRef.child(`/${key}`)
                postRef.once('value').then((snapshot) => {

                  timestamp = snapshot.val().createdAt * -1
                  postRef.update({ createdAt: timestamp  }).then(()=>{
                    resolve();
                  })
                });
              })
            })
          }
        }
        
      }
      
    })


  }

  getPost(){

    return new Promise((resolve, reject)=>{
    
      this.postRef.orderByChild('createdAt').once("value").then((data)=>{


        let dataVal = [];
        let dataKey = [];
        data.forEach((child)=> {

            dataVal.push(child.val())
            dataKey.push(child.key)
        });

        let returnValue = []
        returnValue = dataKey.map((d,i)=>{
          let rV = dataVal[i]
          rV.key = d
          return rV
        })

        resolve(returnValue);
      }).catch((err)=>{
        reject(err);
      })
    })

  }

  getPostForUser(uid){

    return new Promise((resolve, reject)=>{
    
      this.postRef.orderByChild("uid").equalTo(uid).once("value").then((data)=>{

        let dataVal = [];
        let dataKey = [];
        data.forEach((child)=> {

            dataVal.push(child.val())
            dataKey.push(child.key)
        });

        let returnValue = []
        returnValue = dataKey.map((d,i)=>{
          let rV = dataVal[i]
          rV.key = d
          return rV
        })

        resolve(returnValue);
      }).catch((err)=>{
        reject(err);
      })
    })

  }

  likePost(postKey, postLikeCount: number = 0, shouldLike){

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
        let userWhoLikeArray = [];
        try{
          userWhoLikeArray = Object.keys(userWhoLike)
        }catch(e){ console.log(e)}
        
        let returnValue = []

        userWhoLikeArray = userWhoLikeArray.filter((d)=>{
          return userWhoLike[d]
        })
        this.userDataProvider.getUsernameList(userWhoLikeArray).then((data)=>{
          for(let d of data){

          }
          returnValue = data.map((d,i)=>{
            return {name: d.val(), uid: userWhoLikeArray[i]}
          })


          resolve(returnValue);

        })

      })
    })
  }


  getUserLikedPost(){
    return new Promise((resolve, reject)=>{
      if (this.currentUser) {
        firebase.database().ref(`/userProfile/${this.currentUser.uid}/postLiked/`).once("value",(likedPost)=>{
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
        resolve(savedPicture.downloadURL);
      });
    })
  }


  deletePost(postKey){
    return firebase.database().ref(`/publicPost/${postKey}`).remove()
  }

}
