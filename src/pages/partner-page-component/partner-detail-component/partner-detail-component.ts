import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import {PartnerDetailMap} from "./partner-detail-map/partner-detail-map";

@Component({
  selector: 'page-partner-detail-component',
  templateUrl: 'partner-detail-component.html'
})
export class PartnerDetailComponent {

  starInactive: {} = {
    name: "star-outline",
    color: "grey"
  };
  starActive: {} = {
    name: "star",
    color: "primary"
  };
  star: {} = this.starInactive;

  constructor(public navCtrl: NavController, public navParams: NavParams) {}
  goToPartnerDetailMap(){
    this.navCtrl.push(PartnerDetailMap);
  }

  toggleFavorites(){
    if (this.star == this.starActive) {this.star = this.starInactive;}
    else {this.star = this.starActive};
  }
}
