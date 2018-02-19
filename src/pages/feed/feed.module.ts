import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { FeedPage } from './feed';
import { PipesModule } from '../../pipes/pipes.module'; 
import { ComponentsModule } from '../../components/components.module';

@NgModule({
  declarations: [
    FeedPage,
  ],
  imports: [
    IonicPageModule.forChild(FeedPage),
    PipesModule,
    ComponentsModule
  ],
})
export class FeedPageModule {}
