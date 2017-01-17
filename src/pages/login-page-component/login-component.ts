

import { Component, ViewChild } from '@angular/core';
import { Nav, Platform, NavController, NavParams } from 'ionic-angular';

import {OverviewPageComponent} from "../overview-page-component/overview-component";
import {ScanNumberPageComponent} from "./scan-number-page-component/scan-number-page-component";

@Component({
  selector: 'page-login-component',
  templateUrl: 'login-component.html',
})
export class LoginPageComponent {

  @ViewChild(Nav) nav: Nav;

  constructor(public navCtrl: NavController, public navParams: NavParams) {}

  loadCameraPage(){
    this.navCtrl.push(ScanNumberPageComponent);
  }

}
