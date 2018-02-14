import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PostDetailPage } from './post-detail';
import { PipesModule } from '../../pipes/pipes.module' 

@NgModule({
  declarations: [
    PostDetailPage,
  ],
  imports: [
    IonicPageModule.forChild(PostDetailPage),
    PipesModule
  ],
})
export class PostDetailPageModule {}
