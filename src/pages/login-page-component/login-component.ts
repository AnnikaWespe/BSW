

import { Component, ViewChild } from '@angular/core';
import { Nav, NavController, NavParams } from 'ionic-angular';

import {OverviewPageComponent} from "../overview-page-component/overview-component";
import {ConfirmScanPageComponent} from "./confirm-scan-page-component/confirm-scan-page-component";
import {BarcodeData} from "./confirm-scan-page-component/BarcodeData";

@Component({
  selector: 'page-login-component',
  templateUrl: 'login-component.html',
})
export class LoginPageComponent {

  @ViewChild(Nav) nav: Nav;
  barcodeData: BarcodeData;
  scannedNumber: any;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.barcodeData = navParams.get('barcodeData');
    if(this.barcodeData) {
      this.scannedNumber = this.barcodeData.text;
    }
  }

  loadCameraPage(){
    this.navCtrl.push(ConfirmScanPageComponent);
  }

  pushOverviewPage(){
    this.navCtrl.setRoot(OverviewPageComponent);
  }

  saveLocation(){

  }
}

