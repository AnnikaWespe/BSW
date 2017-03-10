// import { Pipe, PipeTransform } from '@angular/core';
//
// @Pipe({
//   name: 'words'
// })
// export class TruncateWordsPipe implements PipeTransform {
//   transform(value: string, limit: number = 40, trail: String = '…'): string {
//     let result = value;
//
//     if (value) {
//       let words = value.split(/\s+/);
//       if (words.length > Math.abs(limit)) {
//         if (limit < 0) {
//           limit *= -1;
//           result = trail + words.slice(words.length - limit, words.length).join(' ');
//         } else {
//           result = words.slice(0, limit).join(' ') + trail;
//         }
//       }
//     }
//
//     return result;
//   }
// }



import {Pipe} from "@angular/core";
@Pipe({
  name: 'truncate'
})
export class TruncatePipe {
  transform(value: string) : string {

    return value.length > 25 ? value.substring(0, 25) + '...' : value;
  }
}

@Pipe({
  name: 'dynamicTruncate'
})
export class DynamicTruncatePipe {
  transform(value: string, otherString) : string {
    let limit = Math.max(35 - otherString.length * 2, 15);

    return value.length > limit ? value.substring(0, limit) + '...' : value;
  }
}
