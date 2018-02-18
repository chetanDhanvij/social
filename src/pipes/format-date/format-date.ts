import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';

/**
 * Generated class for the FormatDatePipe pipe.
 *
 * See https://angular.io/api/core/Pipe for more info on Angular Pipes.
 */
@Pipe({
  name: 'formatDate',
})
export class FormatDatePipe implements PipeTransform {
  /**
   * Takes a value and makes it lowercase.
   */
  transform(value: string, ...args) {
    if(value){
      console.log(moment(parseInt(value) * -1).startOf("day").isSame(moment().startOf("day")))
      if(moment(parseInt(value) * -1).startOf("day").isSame(moment().startOf("day"))){
        return "Today at " + moment(parseInt(value) * -1).format("h:m a");
      }else{
        return moment(parseInt(value) * -1).format("MMMM DD, YYYY");
      }

    }else{
      return value;
    }

  }
}
