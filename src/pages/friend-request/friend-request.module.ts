import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { FriendRequestPage } from './friend-request';
import { ComponentsModule } from '../../components/components.module';

@NgModule({
  declarations: [
    FriendRequestPage,
  ],
  imports: [
    IonicPageModule.forChild(FriendRequestPage),
    ComponentsModule
  ],
})
export class FriendRequestPageModule {}
