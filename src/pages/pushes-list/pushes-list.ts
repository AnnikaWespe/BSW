import {Component} from '@angular/core';
import {NavController, NavParams} from 'ionic-angular';
import {PartnerDetailComponent} from "../partner-page-component/partner-detail-component/partner-detail-component";


@Component({
  selector: 'page-pushes-list',
  templateUrl: 'pushes-list.html',
})
export class PushesListPageComponent {
  partners = [];



  constructor(public navCtrl: NavController,
              public navParams: NavParams) {
    this.partners = navParams.get("partners");
  }

  showPartner(partner = 0) {
    this.navCtrl.push(PartnerDetailComponent, {partner: partner})
  }

}


