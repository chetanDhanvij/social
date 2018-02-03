
import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';

/*
  Generated class for the DataStoreProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class DataStoreProvider {

  constructor( private storage: Storage) {
    console.log('Hello DataStoreProvider Provider');
  }

  setProfileURL(url: string){
    this.storage.set('PROFILE_URL', url);
  }

  getProfileURL(){
    return new Promise((resolve, reject)=>{
      this.storage.get('PROFILE_URL').then((url) => {
        resolve(url);
      });
    })
  }

}
