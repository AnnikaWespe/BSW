import { Component, ViewChild } from '@angular/core';
import { Nav, Platform, NavController, NavParams } from 'ionic-angular';

@Component({
  selector: 'scan-number-page-component',
  templateUrl: 'scan-number-page-component.html'
})
export class ScanNumberPageComponent {

  @ViewChild(Nav) nav: Nav;

  constructor(public navCtrl: NavController, public navParams: NavParams) {}

  loadCameraPage(){
    this.navCtrl.push(ScanNumberPageComponent);
  }
}

