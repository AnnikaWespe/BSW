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
    console.log('Hello PartnerMap Component');
    this.text = 'Hello World';
    this.partners = navParams.get('partners');
    this.location = navParams.get('location');
    console.log(this.partners, this.location);
  }
}
