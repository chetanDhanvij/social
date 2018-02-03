import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { UserInitialDetailPage } from './user-initial-detail';

@NgModule({
  declarations: [
    UserInitialDetailPage,
  ],
  imports: [
    IonicPageModule.forChild(UserInitialDetailPage),
  ],
})
export class UserInitialDetailPageModule {}
