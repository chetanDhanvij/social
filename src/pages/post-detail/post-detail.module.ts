import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PostDetailPage } from './post-detail';
import { PipesModule } from '../../pipes/pipes.module';
import { ComponentsModule } from '../../components/components.module'; 

@NgModule({
  declarations: [
    PostDetailPage,
  ],
  imports: [
    IonicPageModule.forChild(PostDetailPage),
    PipesModule,
    ComponentsModule
  ],
})
export class PostDetailPageModule {}
