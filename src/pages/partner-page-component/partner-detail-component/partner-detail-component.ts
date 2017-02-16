import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import {PartnerDetailMap} from "./partner-detail-map/partner-detail-map";

@Component({
  selector: 'page-partner-detail-component',
  templateUrl: 'partner-detail-component.html'
})
export class PartnerDetailComponent {

  constructor(public navCtrl: NavController, public navParams: NavParams) {}
  goToPartnerDetailMap(){
    this.navCtrl.push(PartnerDetailMap);
  }
}
