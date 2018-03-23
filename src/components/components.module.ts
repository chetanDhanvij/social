import { NgModule } from '@angular/core';
import { PostComponent } from './post/post';
import { IonicPageModule } from 'ionic-angular';
import { PipesModule } from '../pipes/pipes.module';
import { FriendCardComponent } from './friend-card/friend-card'; 
@NgModule({
	declarations: [PostComponent,
    FriendCardComponent],
	imports: [PipesModule, IonicPageModule.forChild(PostComponent)],
	exports: [PostComponent,
    FriendCardComponent]
})
export class ComponentsModule {}
