import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'yn'
})
export class YnPipe implements PipeTransform {

  transform(value: string): any {
    if(value=='1' ){
        return 'yes';
    }
    return 'no';

  }

}
