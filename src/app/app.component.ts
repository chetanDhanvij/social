import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import firebase from 'firebase';
import { firebaseConfig } from './credentials';
import { Unsubscribe } from '@firebase/util';
import { GeneralProvider } from '../providers/general/general';
import { RecallProvider } from '../providers/recall/recall';
import { Subscription } from 'rxjs';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage:any;
  private onResumeSubscription: Subscription;
  constructor(platform: Platform, 
              statusBar: StatusBar, 
              splashScreen: SplashScreen,
              private general: GeneralProvider,
              private recallProvider: RecallProvider) {
    platform.ready().then(() => {
      firebase.initializeApp(firebaseConfig);
      this.recallProvider.init();

      const unsubscribe: Unsubscribe = firebase
      .auth()
      .onAuthStateChanged(user => {

          if (!user) {
            this.rootPage = 'LoginPage';
            unsubscribe();
          } else {
            this.rootPage = 'TabsPage';
            unsubscribe();
          }
      });
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      setTimeout(()=>{
        splashScreen.hide();
      },500)
      this.recallProvider.checkStatus()
      this.onResumeSubscription = platform.resume.subscribe(() => {
        // do something meaningful when the app is put in the foreground
        this.recallProvider.checkStatus()
     }); 
    });
  }

  ngOnDestroy() {
    // always unsubscribe your subscriptions to prevent leaks
    this.onResumeSubscription.unsubscribe();
  }
}

