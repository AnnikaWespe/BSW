import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';


@Component({
  providers: [],
  selector: 'page-overview',
  templateUrl: 'overview-component.html',
})
export class OverviewPageComponent{

  title: string = "Übersicht";
  balance: number = 232;
  bonusThisYear: number = 124;
  heightBalanceBarBonusBarBuffer = ["0vh","0vh", "0vh", "0vh"];
  maxHeightBarInVh = 14;


  constructor(public navCtrl: NavController, public navParams: NavParams) {}

  heightBlueBarRedBar(){
    let heightOtherDiv;
    if(this.balance > this.bonusThisYear){
      this.heightBalanceBarBonusBarBuffer[0] = this.maxHeightBarInVh + "vh";
      heightOtherDiv = Math.round((this.bonusThisYear / this.balance) * this.maxHeightBarInVh);
      this.heightBalanceBarBonusBarBuffer[1] =  heightOtherDiv + "vh";
      this.heightBalanceBarBonusBarBuffer[3] =  this.maxHeightBarInVh - heightOtherDiv + "vh";
    }
    else {
      this.heightBalanceBarBonusBarBuffer[1] = this.maxHeightBarInVh + "vh";
      heightOtherDiv = Math.round((this.bonusThisYear / this.balance) * this.maxHeightBarInVh);
      this.heightBalanceBarBonusBarBuffer[0] = heightOtherDiv + "vh";
      this.heightBalanceBarBonusBarBuffer[2] =  this.maxHeightBarInVh - heightOtherDiv + "vh";
    }
    return this.heightBalanceBarBonusBarBuffer;
  }
}
