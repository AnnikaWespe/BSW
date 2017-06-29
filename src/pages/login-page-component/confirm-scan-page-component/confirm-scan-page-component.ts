import {Component} from '@angular/core';
import {NavController, NavParams, AlertController} from 'ionic-angular';
import {BarcodeScanner} from '@ionic-native/barcode-scanner';

import {BarcodeData} from "./BarcodeData";
import {LoginPageComponent} from "../login-component";
import {GoogleAnalytics} from "@ionic-native/google-analytics";

@Component({
  selector: 'scan-number-page-component',
  templateUrl: 'confirm-scan-page-component.html'
})
export class ConfirmScanPageComponent {

  //@ViewChild(Nav) nav: Nav;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public alertCtrl: AlertController,
              private barcodeScanner: BarcodeScanner,
              private ga: GoogleAnalytics,) {
    if (localStorage.getItem("disallowUserTracking") === "false") {
      this.ga.trackView("Scan Screen")
    }
  }

  loadScanPage() {
    this.barcodeScanner.scan()
      .then((result) => {
        if (!result.cancelled) {
          const barcodeData = new BarcodeData(result.text, result.format);
          if (barcodeData.text.length === 10) {
            this.backToLoginPage(barcodeData);
            if (localStorage.getItem("disallowUserTracking") === "false") {
              this.ga.trackEvent("Mitgliedskarte", "Mitgliedskarte gescannt")
            }
          }
          else {
            this.showPromptIncorrectBarcode();
          }
        }
      })
      .catch((err) => {
        alert(err);
      });
  }

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

  goBackToLoginPage(){
    this.navCtrl.push(LoginPageComponent);
  }
}

