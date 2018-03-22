
import { Injectable } from '@angular/core';
import firebase from 'firebase';
import { User } from '@firebase/auth-types';
import { Reference, ThenableReference } from '@firebase/database-types';
import * as moment from 'moment';
import { UserDataProvider } from '../user-data/user-data';
import { ReplaySubject } from "rxjs/ReplaySubject";

/*
  Generated class for the FeedProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class FeedProvider {

  currentUser:any;
  postRef: Reference;
  reloadPost: any;
  constructor(private userDataProvider: UserDataProvider) {
    this.reloadPost = new ReplaySubject();
    firebase.auth().onAuthStateChanged(user => {
      this.currentUser = user;
      if(user){
        this.postRef = firebase.database().ref(`/publicPost/`);
      }
    });
  }

  reloadFeed(){
    this.reloadPost.next();
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
  nextStart: any = undefined;
  endOfPost: boolean = false;
  getPostNew(completeReload){
    let batchSize = 50;
    return new Promise((resolve, reject)=>{
      if(completeReload){
        this.nextStart = undefined;
      }
      let query;
      if(this.nextStart != undefined){
        query = this.postRef.orderByKey().limitToLast(batchSize).endAt(this.nextStart.key);
      }else{
        query = this.postRef.orderByKey().limitToLast(batchSize);
      }
      query.once("value").then((data)=>{


        let dataVal = [];
        let dataKey = [];
        data.forEach((child)=> {
            dataVal.push(child.val())
            dataKey.push(child.key)
        });
        console.log("data:",dataKey);
        let returnValue = []
        returnValue = dataKey.map((d,i)=>{
          let rV = dataVal[i]
          rV.key = d
          return rV
        })
        if(completeReload){
          this.endOfPost = false;
        }
        if(this.endOfPost && !completeReload){
          returnValue = [];
        }else{
          this.nextStart = returnValue[0];
          if(returnValue.length == batchSize){
            returnValue = returnValue.reverse().slice(0,-1);
          }else{
            returnValue = returnValue.reverse();
            this.endOfPost = true;
          }
        }

        
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

  addComment(postKey,comment){
    return new Promise((resolve,reject)=>{
      if (this.currentUser) {
        firebase.database().ref(`/publicPostCommentList/${postKey}`).push({uid: this.currentUser.uid, comment: comment}).then(()=>{
          resolve()
        })
      }else{
        reject();
      }
    })

    
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
        this.userDataProvider.getUserListforIds(userWhoLikeArray).then((data)=>{
          // returnValue = data.map((d,i)=>{
          //   return {name: d.val(), uid: userWhoLikeArray[i]}
          // })
          returnValue = data.map((d,i)=>{
            let dVal = d.val()
            return {name: dVal.firstName + " " + dVal.lastName, 
                    uid: d.key, 
                    profileImgURL: dVal.profileImgURL }
          })


          resolve(returnValue);

        })

      })
    })
  }

  getComments(postKey){
    return new Promise((resolve, reject)=>{
      firebase.database().ref(`/publicPostCommentList/${postKey}`).once('value').then((data)=>{
        let _commentList = [];
        let commentKey = []
        data.forEach((child)=> {
           _commentList.push(child.val())
           commentKey.push(child.key)
        });

        if(_commentList == null){
          _commentList = [];
        } 
        console.log("_commentList",_commentList);
        let userWhoComment = [];
        let returnValue;
        userWhoComment = _commentList.map((d)=>{
          return d.uid
        })

        this.userDataProvider.getUserListforIds(userWhoComment).then((data)=>{
          returnValue = data.map((d,i)=>{
            let dVal = d.val()
            return {name: dVal.firstName + " " + dVal.lastName, 
                    uid: d.key, 
                    key: commentKey[i],
                    profileImgURL: dVal.profileImgURL,
                    comment: _commentList[i].comment }
          })
          resolve(returnValue);
        })

      })
    })
  }

  deleteComment(postKey,commentKey){
    return firebase.database().ref(`/publicPostCommentList/${postKey}/${commentKey}`).remove()    
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
