
import { Injectable } from '@angular/core';
import * as moment from 'moment';
import firebase from 'firebase';

/*
  Generated class for the AdvertisementProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class AdvertisementProvider {
  addRef
  constructor() {
    console.log('Hello AdvertisementProvider Provider');
    this.addRef = firebase.database().ref(`/advertisement/`);
  }

  newAdd(addData){
    console.log(addData)
    return new Promise((resolve,reject)=>{
      let post: any = {};
      console.log("addData")
      console.log(addData)
            let timestamp = firebase.database.ServerValue.TIMESTAMP
            this.uploadToCloud(addData.image,moment().unix()).then((url)=>{
              console.log(url);
              let addDataPost: any = {};
              addDataPost ={
                text: addData.text,
                url: addData.url,
                image: url,
                createdAt: timestamp
              }
              console.log(addData);
              const promise = this.addRef.push(addDataPost);
              const key = promise.key
        
              promise.then(() => {
                const postRef = this.addRef.child(`/${key}`)
                postRef.once('value').then((snapshot) => {
                  console.log(" snapshot.val()",  snapshot.val())
                  timestamp = snapshot.val().createdAt * -1
                  postRef.update({ createdAt: timestamp  }).then(()=>{
                    resolve();
                  })
                });
              })
            })
          

        
      
      
    })


  }


  private uploadToCloud(img,key) {
    return new Promise((resolve, reject)=>{
      firebase
      .storage()
      .ref(`/advertisement/${key}/image.jpeg`)
      .putString(img, 'base64', { contentType: 'image/jpeg' })
      .then((savedPicture) => {
        console.log(savedPicture);
        resolve(savedPicture.downloadURL);
      });
    })
  }


  getAdd(){
    console.log(this.addRef);
    return new Promise((resolve, reject)=>{
    
      this.addRef.orderByChild('createdAt').once("value").then((data)=>{
        console.log(data.val())
        let dataVal = [];
        let dataKey = [];
        data.forEach((child)=> {
            console.log(child.val()) // NOW THE CHILDREN PRINT IN ORDER
            dataVal.push(child.val())
            dataKey.push(child.key)
        });
        console.log(dataVal, dataKey)
        let returnValue = []
        returnValue = dataKey.map((d,i)=>{
          let rV = dataVal[i]
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

}
