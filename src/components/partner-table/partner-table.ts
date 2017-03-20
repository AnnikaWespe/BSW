import {Component, Input, OnChanges} from '@angular/core';

@Component({
  selector: 'partner-table',
  templateUrl: 'partner-table.html'
})
export class PartnerTableComponent{

  @Input() partners: any[];

  constructor() {}

  getMaxWidth(partner){
    let bonusLength = partner.pfBonus.length;
    let titleLength = partner.nameOrigin.length;
    let maxWidth = [];
    if(bonusLength > 16){
      if (titleLength > 16){
        maxWidth = ["50", "23"]
      }
      else{
        maxWidth = ["29", "44"]
      }
    }
    else if(bonusLength > 9){
      if (titleLength > 25){
        maxWidth = ["43", "30"]
      }
      else{
        maxWidth = ["40", "33"]
      }
    }
    else {
        maxWidth = ["55", "18"]
    };
    return maxWidth;
  }
}
