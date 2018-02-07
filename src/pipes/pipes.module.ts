import { NgModule } from '@angular/core';
import { FormatDatePipe } from './format-date/format-date';
import { SoReversePipe } from './so-reverse/so-reverse';

@NgModule({
	declarations: [FormatDatePipe,
    SoReversePipe,
    ],
	imports: [],
	exports: [FormatDatePipe,
    SoReversePipe,
    ]
})
export class PipesModule {}
