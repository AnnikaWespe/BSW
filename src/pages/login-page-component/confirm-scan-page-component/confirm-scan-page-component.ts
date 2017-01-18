import { Component, ViewChild } from '@angular/core';
import { Nav, Platform, NavController, NavParams } from 'ionic-angular';
import {BarcodeScanner} from 'ionic-native';

import {BarcodeData} from "./BarcodeData";
import {LoginPageComponent} from "../login-component";

@Component({
  selector: 'scan-number-page-component',
  templateUrl: 'confirm-scan-page-component.html'
})
export class ConfirmScanPageComponent {

  //@ViewChild(Nav) nav: Nav;

  constructor(public navCtrl: NavController, public navParams: NavParams) {}

  loadScanPage(){
  BarcodeScanner.scan()
      .then((result) => {
        if (!result.cancelled) {
          const barcodeData = new BarcodeData(result.text, result.format);
          this.scanDetails(barcodeData);
        }
      })
      .catch((err) => {
        alert(err);
      })
  };
  scanDetails(details) {
    this.navCtrl.push(LoginPageComponent, {details: details});
  }
}

