import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { FriendListPage } from './friend-list';
import { ComponentsModule } from '../../components/components.module';

@NgModule({
  declarations: [
    FriendListPage,
  ],
  imports: [
    IonicPageModule.forChild(FriendListPage),
    ComponentsModule
  ],
})
export class FriendListPageModule {}
