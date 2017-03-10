import {Component, Input} from '@angular/core';

@Component({
  selector: 'partner-table',
  templateUrl: 'partner-table.html'
})
export class PartnerTableComponent {

  @Input() partners: any[];

  constructor() {

  }
  widthBonusDiv(){
    return "12vw";
  }


}
