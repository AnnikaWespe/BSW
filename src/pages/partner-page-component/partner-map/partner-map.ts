import { Component } from '@angular/core';
import {NavParams, NavController} from "ionic-angular";

/*
  Generated class for the PartnerMap component.

  See https://angular.io/docs/ts/latest/api/core/index/ComponentMetadata-class.html
  for more info on Angular 2 Components.
*/
@Component({
  selector: 'partner-map',
  templateUrl: 'partner-map.html'
})
export class PartnerMapComponent {

  text: string;
  partners: any[];
  location: {};

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }
}
