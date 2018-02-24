
import { Injectable } from '@angular/core';
import firebase from 'firebase';
import { Reference, ThenableReference } from '@firebase/database-types';
import { AppVersion } from '@ionic-native/app-version';
import { Unsubscribe } from '@firebase/util';
import { ModalController } from 'ionic-angular';


/*
  Generated class for the RecallProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class RecallProvider {
  currentUser:any;
  settingRef: Reference;
  showRecallModal: boolean = true;
  constructor(private appVersion: AppVersion,
              private modalCtrl: ModalController,) {
    console.log('Hello RecallProvider Provider');
  }

  init(){    
        this.settingRef = firebase.database().ref(`/settings/`);
  }

  checkStatus(){
    if(this.showRecallModal){
      this.settingRef.once("value").then((recallParams)=>{
        console.log("recallParams.val()recallParams.val()recallParams.val()recallParams.val()recallParams.val()recallParams.val()recallParams.val()recallParams.val()");
        console.log(recallParams.val());
        let _recallParams = recallParams.val();
  
  
        this.appVersion.getVersionNumber().then((version)=>{
          console.log(version);
          let appVer = version + "";
          
          if(this.recalled(_recallParams.isRecalled,_recallParams.recallMsg)){
            console.log("App is recalled");
          }else if(this.mendatoryUpdate(appVer,_recallParams.minVer)){
            console.log("App requires mendatory update");
          }else if(this.newUpdate(appVer,_recallParams.currVer)){
            console.log("App has new update available");
          }else{
            console.log("All good");
          }
        })
      }).catch((err)=>{
  
      })
    }
    
  }

  mendatoryUpdate(appVersion,minVer): boolean{
    if(this.compareVersion(minVer,appVersion)){
      this.showRecallPage("Your current version of the app is no longer supported. Please update the app to stay connected with your awesome community.", false, true)
      return true;
    }
    return false;
  }

  newUpdate(appVersion,currVer): boolean{
    if(this.compareVersion(currVer,appVersion)){
      this.showRecallPage("New version of this app is now available. Download it now.", true, true)
      return true;
    }
    return false;
  }

  recalled(isRecalled, recallMsg): boolean{
    if(isRecalled){
      this.showRecallPage(recallMsg, false, false);
      return true;
    }
    return false;
  }

  showRecallPage(text, showCancel, showUpdate){
    this.showRecallModal = false;
    let recallModal = this.modalCtrl.create("RecallOutputPage", { 'text': text, 
                                                                  'showCancel' : showCancel,
                                                                  'showUpdate': showUpdate    },{enableBackdropDismiss:false});
		recallModal.onDidDismiss(data => {
      this.showRecallModal = true;
		});
		recallModal.present();
  }

  compareVersion(v1:string,v2: string): boolean{
    let _v1 = v1.split(".").map((d)=>{
      return parseInt(d);
    });
    let _v2 = v2.split(".").map((d)=>{
      return parseInt(d);
    });

    for(let i = 0; i < _v1.length; i++ ){
      if(_v1[i]>_v2[i]){
        console.log("_v1 is higher");
        return true;
      }else if(_v1[i]<_v2[i]){
        console.log("_v1 is lower");
        return false;
      }
    }
    console.log("_v1 is equal to _v2");
    return false;
  }

  getMinVer(){
    return new Promise((resolve, reject)=>{
      this.settingRef.child("minVer").once("value").then((minVer)=>{
        resolve(minVer.val())
      }).catch((err)=>{
        reject(err);
      })
    })

  }

  getCurrVer(){
    return new Promise((resolve, reject)=>{
      this.settingRef.child("currVer").once("value").then((currVer)=>{
        console.log(currVer.val())
        resolve(currVer.val())
      }).catch((err)=>{
        reject(err);
      })
    })
  }

  getRecallState(){
    return new Promise((resolve, reject)=>{
      this.settingRef.child("isRecalled").once("value").then((isRecalled)=>{
        resolve(isRecalled.val())
      }).catch((err)=>{
        reject(err);
      })
    });
  }

  getRecallMsg(){
    return new Promise((resolve, reject)=>{
      this.settingRef.child("recallMsg").once("value").then((recallMsg)=>{
        resolve(recallMsg.val())
      }).catch((err)=>{
        reject(err);
      })
    })
  }

}
