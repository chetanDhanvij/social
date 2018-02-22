import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { NewAdvertisementPage } from './new-advertisement';

@NgModule({
  declarations: [
    NewAdvertisementPage,
  ],
  imports: [
    IonicPageModule.forChild(NewAdvertisementPage),
  ],
})
export class NewAdvertisementPageModule {}
