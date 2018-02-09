
import { Injectable } from '@angular/core';
import { Camera, CameraOptions } from '@ionic-native/camera';
import firebase from 'firebase';
import { User, AuthCredential } from '@firebase/auth-types';
import { ActionSheetController } from 'ionic-angular';

/*
  Generated class for the ImageSelectorProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class ImageSelectorProvider {
  currentUser: User;
  constructor(public camera: Camera,
    public actionSheetCtrl: ActionSheetController) {
    console.log('Hello ImageSelectorProvider Provider');
    firebase.auth().onAuthStateChanged(user => {
      this.currentUser = user;
    });
  }

  public takeImg(openCamera: boolean) {
    return new Promise((resolve, reject) => {
      let options: CameraOptions = {
        quality: 50,
        destinationType: this.camera.DestinationType.DATA_URL,
        encodingType: this.camera.EncodingType.JPEG,
        mediaType: this.camera.MediaType.PICTURE,
        sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
        allowEdit: false,
        targetWidth: 500,
        targetHeight: 500,
      }
      if (openCamera) {
        options.sourceType = this.camera.PictureSourceType.CAMERA;
      }

      this.camera.getPicture(options).then((imageData) => {
        resolve(imageData);
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

  public   imageSelection() {
    return new Promise((resolve, reject)=>{
      let actionSheet = this.actionSheetCtrl.create({
        title: 'Select one',
        buttons: [
          {
            text: 'Take a Picture',
            handler: () => {
              console.log('Take a Picture clicked');
              this.takeImg(true).then((img)=>{
                resolve(img);
              }).catch(err => reject(err))
            }
          }, {
            text: 'Open Gallery',
            handler: () => {
              console.log('Open Gallery clicked');
              this.takeImg(false).then((img)=>{
                resolve(img);
              }).catch(err => reject(err))
            }
          }, {
            text: 'Cancel',
            role: 'cancel',
            handler: () => {
              console.log('Cancel clicked');
            }
          }
        ]
      });
      actionSheet.present();
    })

  }

  

}
