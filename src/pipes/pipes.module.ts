import { NgModule } from '@angular/core';
import { FormatDatePipe } from './format-date/format-date';
import { SoReversePipe } from './so-reverse/so-reverse';
import { ReversePipe } from './reverse/reverse';

@NgModule({
	declarations: [FormatDatePipe,
    SoReversePipe,
    ReversePipe,
    ],
	imports: [],
	exports: [FormatDatePipe,
    SoReversePipe,
    ReversePipe,
    ]
})
export class PipesModule {}
