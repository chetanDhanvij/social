import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import firebase from 'firebase';
import { firebaseConfig } from './credentials';
import { Unsubscribe } from '@firebase/util';
import { GeneralProvider } from '../providers/general/general'
@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage:any;

  constructor(platform: Platform, 
              statusBar: StatusBar, 
              splashScreen: SplashScreen,
              private general: GeneralProvider) {
    if(!this.general.isIntroDone()){
      this.rootPage = "IntroPage"; 
    }
    this.rootPage = 'LoginPage';
    firebase.initializeApp(firebaseConfig);
    const unsubscribe: Unsubscribe = firebase
    .auth()
    .onAuthStateChanged(user => {
      console.log(user);

      if(this.general.isIntroDone()){
        // if (!user) {
        //   this.rootPage = 'LoginPage';
        //   unsubscribe();
        // } else {
        //   this.rootPage = 'MenuPage';
        //   unsubscribe();
        // }
      }
    });
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
    });
  }
}

