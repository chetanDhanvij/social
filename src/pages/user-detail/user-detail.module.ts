import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { UserDetailPage } from './user-detail';
import { PipesModule } from '../../pipes/pipes.module'; 
import { ComponentsModule } from '../../components/components.module';

@NgModule({
  declarations: [
    UserDetailPage,
  ],
  imports: [
    IonicPageModule.forChild(UserDetailPage),
    PipesModule,
    ComponentsModule
  ],
})
export class UserDetailPageModule {}
