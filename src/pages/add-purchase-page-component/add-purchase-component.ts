import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

@Component({
  selector: 'add-purchase-page',
  templateUrl: 'add-purchase-component.html'
})
export class AddPurchasePageComponent {

	title: string = "Einkauf nachtragen";

  constructor(public navCtrl: NavController, public navParams: NavParams) {}

  ionViewDidLoad() {
    console.log('ionViewDidLoad EinkaufNachtragenPage');
  }



}
