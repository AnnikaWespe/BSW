import { Pipe, PipeTransform } from '@angular/core';

/**
 * Generated class for the GermanCurrencyPipe pipe.
 *
 * See https://angular.io/docs/ts/latest/guide/pipes.html for more info on
 * Angular Pipes.
 */
@Pipe({
  name: 'germanCurrency',
})
export class GermanCurrencyPipe implements PipeTransform {
  /**
   * reformat currency output so that it matches the german locale
   */
  transform(value: string, ...args) {
    return value.substr(1) + " " + value.substr(0, 1);
  }
}
