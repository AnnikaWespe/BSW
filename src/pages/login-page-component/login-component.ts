

import { Component, ViewChild } from '@angular/core';
import { Nav, Platform, NavController, NavParams } from 'ionic-angular';

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

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.barcodeData = navParams.get('details');
  }

  loadCameraPage(){
    this.navCtrl.push(ConfirmScanPageComponent);
  }

  pushOverviewPage(){
    // push another page on to the navigation stack
    // causing the nav controller to transition to the new page
    // optional data can also be passed to the pushed page.
    this.navCtrl.setRoot(OverviewPageComponent);
  }

}

