
import { Injectable } from '@angular/core';

/*
  Generated class for the GeneralProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class GeneralProvider {

  constructor() {
    console.log('Hello GeneralProvider Provider');
  }

  isIntroDone(){
    let isIntroDone = localStorage.getItem("INTRO_DONE");
    return isIntroDone == "TRUE"
  }

  setIntroDone(){
    localStorage.setItem("INTRO_DONE","TRUE");
  }

}
