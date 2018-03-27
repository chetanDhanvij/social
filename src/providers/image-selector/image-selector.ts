
import { Injectable } from '@angular/core';
import { Camera, CameraOptions } from '@ionic-native/camera';
import firebase from 'firebase';
import { User, AuthCredential } from '@firebase/auth-types';
import { ActionSheetController } from 'ionic-angular';
import { BehaviorSubject } from 'rxjs';

/*
  Generated class for the ImageSelectorProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
declare var window: any;
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

  public options: any = {
      sourceType: this.camera.PictureSourceType.SAVEDPHOTOALBUM,
      mediaType: this.camera.MediaType.ALLMEDIA,
      destinationType: this.camera.DestinationType.FILE_URI
  }

  mediaUploadStatus =  new BehaviorSubject({});
  getMedia(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.camera.getPicture(this.options).then( (fileUri: any) => {
        console.log('File URI: ' + JSON.stringify(fileUri));
        this.mediaUploadStatus.next({show:true, data:fileUri});
        window.resolveLocalFileSystemURL('file://' + fileUri, (fileEntry) => {
          console.log('Type: ' + (typeof fileEntry));
           fileEntry.file( (file) => {
             console.log('File: ' + (typeof file) + ', ',file);
             const fileReader = new FileReader();
             
             fileReader.onloadend = (result: any) => {
               console.log('File Reader Result: ' + JSON.stringify(result));
               let arrayBuffer = result.target.result;
               let blob = new Blob([new Uint8Array(arrayBuffer)], {type: file.type});
               const name = '' + Date.now();
               resolve({blob:blob, name:name ,file: file});
             };
  
             fileReader.onerror = (error: any) => {
               reject(error);
             };
             
             fileReader.readAsArrayBuffer(file);
           }, (error) => {
             console.log('File Entry Error: ' + JSON.stringify(error));
           });
        }, (error) => {
          console.log('Error resolving file: ' + JSON.stringify(error));
        });
      });
    });
  }
  
  upload(blob: Blob, name: string, type: string) {
   return new Promise((resolve, reject)=>{
    let uploadTask = firebase.storage().ref().child('videos').child(name).put(blob);
    uploadTask.on('state_changed' , (snapshot: any) => {
       // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
       var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
       this.mediaUploadStatus.next({updateProgress: true, progress:progress});
       console.log('Upload is ' + progress + '% done');
       switch (snapshot.state) {
         case firebase.storage.TaskState.PAUSED: // or 'paused'
           console.log('Upload is paused');
           break;
         case firebase.storage.TaskState.RUNNING: // or 'running'
           console.log('Upload is running');
           break;
       }
     }, (error: any) => {
       console.log('An Error has occured');
       switch (error.code) {
         case 'storage/unauthorized':
           // User doesn't have permission to access the object
           console.log('Unauthorized Access: ' + JSON.stringify(error));
           reject(error.code);
           break;
         case 'storage/canceled':
           // User canceled the upload
           console.log('Canceled');
           reject(error.code);
           break;
         case 'storage/unknown':
           // Unknown error occurred, inspect error.serverResponse
           console.log('Storage Unkown: ' + JSON.stringify(error));
           reject(error.code);
           break;
         default:
           console.log('Default: ' + JSON.stringify(error));
           reject(error.code);
           break;
       }
     }, () => {
       console.log('Finished Uploading');
       resolve( {url: uploadTask.snapshot.downloadURL, name: name, mediaType: type} );
     });
   }) 
  }
  
  

}
