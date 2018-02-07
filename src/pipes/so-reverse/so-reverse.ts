import { Pipe, PipeTransform } from '@angular/core';

/**
 * Generated class for the SoReversePipe pipe.
 *
 * See https://angular.io/api/core/Pipe for more info on Angular Pipes.
 */
@Pipe({
  name: 'soReverse',
})
export class SoReversePipe implements PipeTransform {
  /**
   * Takes a value and makes it lowercase.
   */
  transform (values) {
    if (values) {
      return values.reverse();
    }
  }
}
