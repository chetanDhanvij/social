
import { Injectable } from '@angular/core';
import {ModalController} from 'ionic-angular';
import * as moment from 'moment';
import firebase from 'firebase';

/*
  Generated class for the AdvertisementProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class AdvertisementProvider {
  addRef:any;
  addData:any[];
  addIndex:number = 0;
  constructor(		public modalCtrl: ModalController,) {
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

  deleteAdd(addKey){
    return firebase.database().ref(`/advertisement/${addKey}`).remove()
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

  initAdvertisement(){
    this.getAdd().then((adds:any[])=>{
      console.log(adds);
      this.addData = adds;
      this.setupAdvertisement()
    }).catch((err)=>{
      console.log(err)
    })
  }

  setupAdvertisement(){
    setTimeout(()=>{
      this.openAddModal();
    },60*1000)
  }
  openAddModal() {
    console.log(this.addIndex);
    console.log(this.addData)
    if(this.addData.length > 0){
      let addModal = this.modalCtrl.create("FullPageAddPage",{data:this.addData[this.addIndex]});
        addModal.onDidDismiss(data => {
          this.addIndex++;
          if(this.addIndex >= this.addData.length){
            this.addIndex = 0;
          }else{
            this.setupAdvertisement();
          }

        });
        addModal.present();
    }
  }
  
  view(add){

      let addModal = this.modalCtrl.create("FullPageAddPage",{data:add});
        addModal.onDidDismiss(data => {
        });
        addModal.present();

  }

}
