import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';

import { MyApp } from './app.component';
import { AuthProvider } from '../providers/auth/auth';
import { ProfileProvider } from '../providers/profile/profile';
import { FeedProvider } from '../providers/feed/feed';
import { GeneralProvider } from '../providers/general/general';
import { Camera } from '@ionic-native/camera';
import { IonicStorageModule } from '@ionic/storage';
import { DataStoreProvider } from '../providers/data-store/data-store';
import { UserDataProvider } from '../providers/user-data/user-data';
import { ImageSelectorProvider } from '../providers/image-selector/image-selector';
import { AdvertisementProvider } from '../providers/advertisement/advertisement';
import { InAppBrowser } from '@ionic-native/in-app-browser';



@NgModule({
  declarations: [
    MyApp

  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot()
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    AuthProvider,
    ProfileProvider,
    FeedProvider,
    GeneralProvider,
    Camera,
    DataStoreProvider,
    UserDataProvider,
    ImageSelectorProvider,
    AdvertisementProvider,
    InAppBrowser
  ]
})
export class AppModule {}
