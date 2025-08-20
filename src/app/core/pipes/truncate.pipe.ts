import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'truncate'
})
export class TruncatePipe implements PipeTransform {

  transform(value: string, limit: number, complete: boolean): string {
    if (!value) return '';
    return complete || value.length <= limit ? value : value.slice(0, limit) + '...';
  }

}
