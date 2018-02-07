
import { Injectable } from '@angular/core';
import { Camera, CameraOptions } from '@ionic-native/camera';
import firebase from 'firebase';
import { User, AuthCredential } from '@firebase/auth-types';

/*
  Generated class for the ImageSelectorProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class ImageSelectorProvider {
  currentUser: User;
  constructor(public camera: Camera) {
    console.log('Hello ImageSelectorProvider Provider');
    firebase.auth().onAuthStateChanged(user => {
      this.currentUser = user;
    });
  }

  public takeImg(openCamera: boolean) {
    return new Promise((resolve, reject) => {
      let options: CameraOptions = {
        quality: 100,
        destinationType: this.camera.DestinationType.DATA_URL,
        encodingType: this.camera.EncodingType.JPEG,
        mediaType: this.camera.MediaType.PICTURE,
        sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
        allowEdit: true,
        targetWidth: 500,
        targetHeight: 500,
      }
      if (openCamera) {
        options.sourceType = this.camera.PictureSourceType.CAMERA;
      }

      this.camera.getPicture(options).then((imageData) => {
        let base64Image = 'data:image/jpeg;base64,' + imageData;
        this.uploadToCloud(imageData).then((data)=>{
          resolve(true);
        }).catch((err)=>{
          reject(err);
        })
      }, (err) => {
        reject(err);
      });
    })

  }

  private uploadToCloud(img) {
    return new Promise((resolve, reject)=>{
      firebase
      .storage()
      .ref(`/user/${this.currentUser.uid}/post/`)
      .putString(img, 'base64', { contentType: 'image/jpeg' })
      .then((savedPicture) => {
        console.log(savedPicture);
        let imgURL = savedPicture.downloadURL
      });
    })
  }

  

}
