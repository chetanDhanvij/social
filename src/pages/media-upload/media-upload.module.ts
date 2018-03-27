import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MediaUploadPage } from './media-upload';
import {ProgressBarModule} from "angular-progress-bar"

@NgModule({
  declarations: [
    MediaUploadPage,
  ],
  imports: [
    IonicPageModule.forChild(MediaUploadPage),
    ProgressBarModule
  ],
})
export class MediaUploadPageModule {}
