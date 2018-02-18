import { Injectable } from '@angular/core';
import firebase from 'firebase';
import { User, AuthCredential } from '@firebase/auth-types';
import { Reference } from '@firebase/database-types';
import { ActionSheetController } from 'ionic-angular';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { DataStoreProvider } from '../data-store/data-store'


@Injectable()
export class ProfileProvider {
  userProfile: Reference;
  currentUser: User;

  constructor(public actionSheetCtrl: ActionSheetController,
              private camera: Camera,
              private dataStore: DataStoreProvider) {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        this.currentUser = user;
        this.userProfile = firebase.database().ref(`/userProfile/${user.uid}`);
      }
    });
  }

  getUserProfile(): Reference {
    return this.userProfile;
  }

  getCurrentUser(){
    return this.currentUser.uid
  }

  updateName(firstName: string, lastName: string): Promise<any> {
    return this.userProfile.update({ firstName, lastName });
  }

  updateFirstName(firstName: string): Promise<any> {
    return this.userProfile.update({ firstName });
  }

  updateLastName(lastName: string): Promise<any> {
    return this.userProfile.update({ lastName });
  }

  updateDOB(dob: string): Promise<any> {
    return this.userProfile.update({ dob });
  }

  updateGender(gender: string): Promise<any> {
    return this.userProfile.update({ gender });
  }

  initialData(firstName: string, lastName: string, dob: string, gender: string) {
    return new Promise((resolve, reject) => {
      firebase.auth().onAuthStateChanged(user => {
        if (user) {
          let _userProfile = firebase.database().ref(`/userProfile/${user.uid}`);
          _userProfile.update({ firstName, lastName, dob, gender }).then(data => resolve(data)).catch((err) => reject(err))
        }
      });

    })

  }

  updateEmail(newEmail: string, password: string): Promise<any> {
    const credential: AuthCredential = firebase.auth.EmailAuthProvider.credential(
      this.currentUser.email,
      password
    );
    return this.currentUser
      .reauthenticateWithCredential(credential)
      .then(user => {
        this.currentUser.updateEmail(newEmail).then(user => {
          this.userProfile.update({ email: newEmail });
        });
      })
      .catch(error => {
        console.error(error);
      });
  }

  updatePassword(newPassword: string, oldPassword: string): Promise<any> {
    const credential: AuthCredential = firebase.auth.EmailAuthProvider.credential(
      this.currentUser.email,
      oldPassword
    );

    return this.currentUser
      .reauthenticateWithCredential(credential)
      .then(user => {
        this.currentUser.updatePassword(newPassword).then(user => {
          console.log('Password Changed');
        });
      })
      .catch(error => {
        console.error(error);
      });
  }

  updateImg() {
    return new Promise((resolve, reject)=>{
      let actionSheet = this.actionSheetCtrl.create({
        title: 'Select one',
        buttons: [
          {
            text: 'Take a Picture',
            handler: () => {
              console.log('Take a Picture clicked');
              this.takeImg(true).then((done)=>{
                resolve(done);
              }).catch(err => reject(err))
            }
          }, {
            text: 'Open Gallery',
            handler: () => {
              console.log('Open Gallery clicked');
              this.takeImg(false).then((done)=>{
                resolve(done);
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

  private takeImg(openCamera: boolean) {
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
      .ref(`/user/${this.currentUser.uid}/profilePicture.jpeg`)
      .putString(img, 'base64', { contentType: 'image/jpeg' })
      .then((savedPicture) => {
        console.log(savedPicture);
        let profileImgURL = savedPicture.downloadURL
        this.userProfile.update({profileImgURL}).then((data)=>{
          resolve(true);
        }).catch((err)=>{
          console.log(err);
          reject(err);
        })
      });
    })
  }

}
