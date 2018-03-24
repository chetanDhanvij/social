import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { FriendRequestPage } from './friend-request';

@NgModule({
  declarations: [
    FriendRequestPage,
  ],
  imports: [
    IonicPageModule.forChild(FriendRequestPage),
  ],
})
export class FriendRequestPageModule {}
