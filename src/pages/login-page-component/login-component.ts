import {Component, ViewChild} from '@angular/core';
import {
  Nav, NavController, NavParams, AlertController, LoadingController, ViewController, Events,
  Keyboard
} from 'ionic-angular';

import {OverviewPageComponent} from "../overview-page-component/overview-component";
import {ConfirmScanPageComponent} from "./confirm-scan-page-component/confirm-scan-page-component";
import {BarcodeData} from "./confirm-scan-page-component/BarcodeData";
import {WebviewComponent} from "../webview/webview";
import {LoginService} from "./login-service";
import {GoogleAnalytics} from "@ionic-native/google-analytics";

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
  showLogo = true;

  navigatedFromPartnerDetail;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public alertCtrl: AlertController,
              public loginService: LoginService,
              public loadingCtrl: LoadingController,
              public viewCtrl: ViewController,
              private ga: GoogleAnalytics,
              public events: Events,
              public keyboard: Keyboard,) {
    this.barcodeData = navParams.get('barcodeData');
    if (this.barcodeData) {
      this.inputNumberOrEmail = this.barcodeData.text;
    }
    this.keyboard.onClose(() => {
      this.showLogo = true;
    })
    this.ga.trackView('Login Screen');
    this.navigatedFromPartnerDetail = navParams.get("navigatedFromPartnerDetail");
  }

  loadCameraPage() {
    this.navCtrl.push(ConfirmScanPageComponent);
  }

  loadWebView(title, urlType) {
    this.navCtrl.push(WebviewComponent, {urlType: urlType, title: title})
  }

  loadNextPageWithoutLogin() {
    if (this.navigatedFromPartnerDetail) {
      this.viewCtrl.dismiss();
    }
    else {
      this.navCtrl.setRoot(OverviewPageComponent);
    }
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
    //TODO get username and password from user input
    let username = "0016744807"
    let password = "muster01$$";
    //let password = "hallo";
    this.loginService.login(username, password).subscribe((res) => {
      this.loading.dismiss();
      let loginData = res.json();
      if (loginData.errors[0].beschreibung === "Erfolg") {
        localStorage.setItem("securityToken", loginData.response.securityToken);
        localStorage.setItem("mitgliedId", loginData.response.mitgliedId);
        localStorage.setItem("mitgliedsnummer", loginData.response.mitgliedsnummer);
        this.events.publish('userLoggedIn');
        console.log("Login: " + loginData.errors[0].beschreibung);
        if (localStorage.getItem("disallowUserTracking") === "false") {
          this.ga.trackEvent('Login/Logout', 'login')
        }
        this.navigateToNextPage();
      }
      else(this.showPromptLoginFailed())
    });
  }

  navigateToNextPage() {
    if (this.navigatedFromPartnerDetail) {
      this.viewCtrl.dismiss();
    }
    else {
      this.navCtrl.setRoot(OverviewPageComponent);
    }
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
      message: "Bitte versuchen Sie es erneut.",
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

  keyboardCheck() {
    console.log("keyboardCheck");
    if (this.keyboard.isOpen) {
      this.showLogo = false;
    }
  }


  showPromptEnterNumberOrEmailToRequestPassword() {
    let alert = this.alertCtrl.create({
      title: 'Passwort anfordern',
      inputs: [
        {
          name: 'loginString',
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
            this.sendPasswordResetRequest(data.loginString);
          }
        }
      ]
    });
    alert.present();
  }

  showPasswordForgottenDialogue() {
    if (isNaN(this.inputNumberOrEmail)) {
      if (this.emailAdressProperlyFormatted()) {
        this.sendPasswordResetRequest(this.inputNumberOrEmail);
      }
      else {
        this.showPromptEnterNumberOrEmailToRequestPassword()
      }
    }
    else {
      if (this.inputNumberOrEmail.length == 10) {
        this.sendPasswordResetRequest(this.inputNumberOrEmail);
      }
      else {
        this.showPromptEnterNumberOrEmailToRequestPassword()
      }
    }
  }

  sendPasswordResetRequest(loginString) {
    this.loginService.forgotPassword(loginString)
      .subscribe((res) => {
        let errorCode = res.json().errors[0].code;
        console.log(res.json().errors[0]);
        this.inputNumberOrEmail = "";
        switch (errorCode) {
          case "0":
            this.showPromptPasswordForgottenRequestSent('Ein neues Passwort wurde angefordert.', "Bitte überprüfen Sie Ihr Email-Postfach.", false)
            break;
          case "100134":
            this.showPromptPasswordForgottenRequestSent('Leider ist von Ihnen keine Emailadresse hinterlegt.', "Bitte wenden Sie sich an den Support.", false)
            break;
          case "100100":
            this.showPromptPasswordForgottenRequestSent('Zu Ihren Daten wurde kein Mitglied gefunden.', "Bitte überprüfen Sie Ihre Eingabe.", true);
            this.inputNumberOrEmail = "";
            break;
          default:
            this.showPromptPasswordForgottenRequestSent('Etwas ist schiefgelaufen.', "Bitte versuchen Sie es erneut.", true)
            break;
        }
      })
  }


  showPromptPasswordForgottenRequestSent(title, message, showPasswordForgottenPromptAgain) {
    let prompt = this.alertCtrl.create({
      title: title,
      message: message,
      buttons: [
        {
          text: 'Ok',
          handler: data => {
            if(showPasswordForgottenPromptAgain){
              this.showPromptEnterNumberOrEmailToRequestPassword();
            }
          }
        }
      ]
    });
    prompt.present();
  }

  presentLoading() {
    this.loading = this.loadingCtrl.create({
      content: 'Sie werden eingeloggt...'
    });

    this.loading.present();
  }


}


