import { NgModule } from '@angular/core';
import { PostComponent } from './post/post';
import { IonicPageModule } from 'ionic-angular';
import { PipesModule } from '../pipes/pipes.module'; 
@NgModule({
	declarations: [PostComponent],
	imports: [PipesModule, IonicPageModule.forChild(PostComponent)],
	exports: [PostComponent]
})
export class ComponentsModule {}
