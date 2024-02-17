import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'visibility',
  standalone: true
})
export class VisibilityPipe implements PipeTransform {

  transform(value: boolean): string {
    return value ? 'public' : 'private';
  }

}
