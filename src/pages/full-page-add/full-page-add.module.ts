import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { FullPageAddPage } from './full-page-add';

@NgModule({
  declarations: [
    FullPageAddPage,
  ],
  imports: [
    IonicPageModule.forChild(FullPageAddPage),
  ],
})
export class FullPageAddPageModule {}
