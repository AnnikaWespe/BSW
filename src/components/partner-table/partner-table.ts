import {Component, EventEmitter, Input, OnChanges, Output} from '@angular/core';

@Component({
  selector: 'partner-table',
  templateUrl: 'partner-table.html'
})
export class PartnerTableComponent{

  @Input() partners: any[];
  @Output() showPartnerEventEmitter = new EventEmitter();

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
    else if(bonusLength > 8){
      if (titleLength > 25){
        maxWidth = ["40", "30"]
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

  showPartner(partner){
    this.showPartnerEventEmitter.emit(partner);
  }
}
