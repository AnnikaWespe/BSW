

import { Component, ViewChild } from '@angular/core';
import {Nav, NavController, NavParams, AlertController} from 'ionic-angular';

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
  inputNumberOrEmail: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public alertCtrl: AlertController) {
    this.barcodeData = navParams.get('barcodeData');
    if(this.barcodeData) {
      this.inputNumberOrEmail = this.barcodeData.text;
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

  checkForValidInput(){
    if(isNaN(this.inputNumberOrEmail)){
      let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      if(re.test(this.inputNumberOrEmail)){
        this.login();
      }
      else{
        this.showPromptNoValidEmail();
      };
    }
    else{
      if(this.inputNumberOrEmail.length == 10){
        this.login();
      }
      else {this.showPromptNoValidNumber()}
    }
  }
  login(){}
  showPromptNoValidEmail() {
    let prompt = this.alertCtrl.create({
      title: 'Emailadresse ungültig',
      message: "Bitte überprüfen Sie Ihre Eingabe.",
      buttons: [
        {
          text: 'Ok',
          handler: data => {
          }
        }
      ]
    });
    prompt.present();
  }

  showPromptNoValidNumber() {
    let prompt = this.alertCtrl.create({
      title: 'Mitgliedsnummer ungültig',
      message: "Bitte überprüfen Sie Ihre Eingabe, oder nutzen Sie die Scan-Funktion.",
      buttons: [
        {
          text: 'Ok',
          handler: data => {
          }
        }
      ]
    });
    prompt.present();
  }

}

