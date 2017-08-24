import {Component} from '@angular/core';
import {NavController, NavParams, AlertController} from 'ionic-angular';
import { ZBar, ZBarOptions } from '@ionic-native/zbar';

import {LoginPageComponent} from "../login-component";
import {GoogleAnalytics} from "@ionic-native/google-analytics";


@Component({
  selector: 'scan-number-page-component',
  templateUrl: 'confirm-scan-page-component.html'
})
export class ConfirmScanPageComponent {

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public alertCtrl: AlertController,
              private ga: GoogleAnalytics,
              private zbar: ZBar) {
    if (localStorage.getItem("disallowUserTracking") === "false") {
      this.ga.trackView("Scan Screen")
    }
  }

  loadScanPage() {

    let options: ZBarOptions = {
      flash: 'off',
      drawSight: true,
      camera: 'back',
      text_title: "Karten Scan",
      text_instructions: "Bitte scannen Sie die Rückseite Ihrer BSW Karte"
    };

    this.zbar.scan(options)
      .then(result => {
        this.handleScanResult(result);
      })
      .catch(error => {
        this.handleScanError(error);
      });

  }

  handleScanResult(numberFromCard){

    if(!numberFromCard || numberFromCard.length != 16){
      this.showPromptIncorrectBarcode();
      return;
    }

    let mutilatedNumberFromCard = '928' + numberFromCard.slice(0, -1);
    let verificationNumber = this.verificationNumber(mutilatedNumberFromCard);
    let logInNumber = numberFromCard.slice(-10, -1) + verificationNumber;
    if (logInNumber.length === 10) {

      this.backToLoginPage(logInNumber);
      if (localStorage.getItem("disallowUserTracking") === "false") {
        this.ga.trackEvent("Mitgliedskarte", "Mitgliedskarte gescannt")
      }

    } else {
      this.showPromptIncorrectBarcode();
      return;
    }

  }

  handleScanError(error){

    if(error && error != "cancelled") {
      this.showPromptIncorrectBarcode();
    }

  }

  verificationNumber(inputNumber) {
    let z = inputNumber.length;
    let k = 0;
    let j = 2;
    while (z > 0) {
      let i = j * Number(inputNumber.slice(z - 1, z));
      console.log(inputNumber.slice(z - 1, z));
      if (i >= 10) {
        i = i - 9;
      }
      k = k + i;
      if (j == 2) {
        j = 1;
      }
      else if (j == 1) {
        j = 2;
      }
      z--;
    }
    console.log(k);
    k = Math.floor(10 - (k % 10)) % 10;
    return k.toString();
  }

  backToLoginPage(loginNumber) {
    this.navCtrl.push(LoginPageComponent, {loginNumberFromBarCode: loginNumber});
  }

  showPromptIncorrectBarcode() {
    let prompt = this.alertCtrl.create({
      title: 'Authentifizierung fehlgeschlagen',
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

  goBackToLoginPage() {
    this.navCtrl.push(LoginPageComponent);
  }
}

