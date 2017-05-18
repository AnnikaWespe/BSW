import {Component, ViewChild} from '@angular/core';
import {Nav, NavController, NavParams, AlertController, LoadingController} from 'ionic-angular';

import {OverviewPageComponent} from "../overview-page-component/overview-component";
import {ConfirmScanPageComponent} from "./confirm-scan-page-component/confirm-scan-page-component";
import {BarcodeData} from "./confirm-scan-page-component/BarcodeData";
import {WebviewComponent} from "../webview/webview";
import {LoginService} from "./login-service";

@Component({
  selector: 'page-login-component',
  templateUrl: 'login-component.html',
})
export class LoginPageComponent {

  @ViewChild(Nav) nav: Nav;
  barcodeData: BarcodeData;
  inputNumberOrEmail: any;
  password = "";
  loading;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public alertCtrl: AlertController,
              public loginService: LoginService,
              public loadingCtrl: LoadingController) {
    this.barcodeData = navParams.get('barcodeData');
    if (this.barcodeData) {
      this.inputNumberOrEmail = this.barcodeData.text;
    }
  }

  loadCameraPage() {
    this.navCtrl.push(ConfirmScanPageComponent);
  }

  loadWebView(title, url) {
    this.navCtrl.push(WebviewComponent, {url: url, title: title})
  }

  pushOverviewPage() {
    this.navCtrl.setRoot(OverviewPageComponent);
  }

  checkForValidInput() {
    this.presentLoading();
    this.login();
    //TODO: outcomment for production
    /*if (isNaN(this.inputNumberOrEmail)) {
      if (this.emailAdressProperlyFormatted()) {
        this.login();
      }
      else {
        this.showPromptNoValidEmail();
      }
    }
    else {
      if (this.inputNumberOrEmail.length == 10) {
        this.login();
      }
      else {
        this.showPromptNoValidNumber()
      }
    }*/
  }

  emailAdressProperlyFormatted() {
    let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(this.inputNumberOrEmail);
  }

  login() {
    let username = "0016744807"
    let password = "muster01$$";
    this.loginService.login(username, password).subscribe((res) => {
      this.loading.dismiss();
      let loginData = res.json();
      if (loginData.errors[0].code === "0") {
        localStorage.setItem("securityToken", loginData.response.securityToken);
        localStorage.setItem("mitgliedId", loginData.response.mitgliedId);
        this.pushOverviewPage();
        console.log(loginData);
      }
      else(this.showPromptLoginFailed())
    });
  }

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

  showPromptLoginFailed() {
    let prompt = this.alertCtrl.create({
      title: 'Login fehlgeschlagen',
      message: "Bitte versuche Sie es erneut.",
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

  showPromptRequestSent() {
    let prompt = this.alertCtrl.create({
      title: 'Ein neues Passwort wurde angefordert.',
      message: "Bitte überprüfen Sie Ihr Email-Postfach.",
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

  showPromptEnterNumberOrEmail() {
    let alert = this.alertCtrl.create({
      title: 'Passwort anfordern',
      inputs: [
        {
          name: '',
          placeholder: 'Mitglieds-Nr. oder Email'
        }
      ],
      buttons: [
        {
          text: 'Abbrechen',
          role: 'cancel'
        },
        {
          text: 'Anfordern',
          handler: data => {
            /*if (User.isValid(data.username, data.password)) {
              // logged in!
            } else {
              // invalid login
              return false;
            }*/
          }
        }
      ]
    });
    alert.present();
  }

  showPasswordForgottenDialogue() {
    if (isNaN(this.inputNumberOrEmail)) {
      if (this.emailAdressProperlyFormatted()) {
        this.showPromptRequestSent();
      }
      else {
        this.showPromptEnterNumberOrEmail()
      }
    }
    else {
      if (this.inputNumberOrEmail.length == 10) {
        this.showPromptRequestSent();
      }
      else {
        this.showPromptEnterNumberOrEmail()
      }
    }
  }

  presentLoading() {
    this.loading = this.loadingCtrl.create({
      content: 'Sie werden eingeloggt...'
    });

    this.loading.present();
  }
}

