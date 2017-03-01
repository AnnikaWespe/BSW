import { Component} from '@angular/core';
import {NavController, NavParams, AlertController} from 'ionic-angular';
import {BarcodeScanner} from 'ionic-native';

import {BarcodeData} from "./BarcodeData";
import {LoginPageComponent} from "../login-component";

@Component({
  selector: 'scan-number-page-component',
  templateUrl: 'confirm-scan-page-component.html'
})
export class ConfirmScanPageComponent {

  //@ViewChild(Nav) nav: Nav;

  constructor(public navCtrl: NavController, public navParams: NavParams, public alertCtrl: AlertController) {}

  loadScanPage(){
  BarcodeScanner.scan()
      .then((result) => {
        if (!result.cancelled) {
          const barcodeData = new BarcodeData(result.text, result.format);
          if(barcodeData.text.length === 10){
            this.backToLoginPage(barcodeData);
          }
          else{
            this.showPromptIncorrectBarcode();
          }
        }
      })
      .catch((err) => {
        alert(err);
      })
  };
  backToLoginPage(barcodeData) {
    this.navCtrl.push(LoginPageComponent, {barcodeData: barcodeData});
  }
  showPromptIncorrectBarcode() {
    let prompt = this.alertCtrl.create({
      title: 'Barcode konnte nicht gelesen werden.',
      message: "Stellen Sie sicher, dass es sich dabei um den Barcode auf der Rückseite Ihrer BSW-Karte handelt.",
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

