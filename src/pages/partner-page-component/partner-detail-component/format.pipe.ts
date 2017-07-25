
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'formatTelephoneNumber'})
export class FormatTelephoneNumberPipe implements PipeTransform {
  transform(value: string): any {
    if (value !== "BSW-Hotline 0800 279 2582") return value;

    return 'BSW-Hotline<br>0800 279 2582<br>';
  }
}
