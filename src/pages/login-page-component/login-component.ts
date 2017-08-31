import {Component, ViewChild, Renderer} from '@angular/core';
import {
  Nav, NavController, NavParams, AlertController, LoadingController, ViewController, Events,
  Keyboard
} from 'ionic-angular';

import {OverviewPageComponent} from "../overview-page-component/overview-component";
import {ConfirmScanPageComponent} from "./confirm-scan-page-component/confirm-scan-page-component";
import {WebviewComponent} from "../webview/webview";
import {AuthService} from "../../services/auth-service";
import {GoogleAnalytics} from "@ionic-native/google-analytics";

declare let cordova: any;

class authService {
}

@Component({
  selector: 'page-login-component',
  templateUrl: 'login-component.html',
})
export class LoginPageComponent {

  @ViewChild(Nav) nav: Nav;
  @ViewChild('password-input') passwordInput;

  inputNumberOrEmail: any;
  password = "";
  loading;

  /* default image height */
  imageHolderHeight = 140;

  navigatedFromPartnerDetail;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public alertCtrl: AlertController,
              public authService: AuthService,
              public loadingCtrl: LoadingController,
              public viewCtrl: ViewController,
              private ga: GoogleAnalytics,
              public events: Events,
              public keyboard: Keyboard,
              private auth: AuthService,
              private renderer: Renderer) {
    let loginNumberFromBarCode = navParams.get('loginNumberFromBarCode');
    this.inputNumberOrEmail = loginNumberFromBarCode || "";
    this.ga.trackView('Login Screen');
    this.navigatedFromPartnerDetail = navParams.get("navigatedFromPartnerDetail");

  }

  ionViewWillEnter(){
    this.dynamicallyAdaptHeaderImage();
  }

  /*
   * Adapt the header height so that the content
   * completely fills the screen, ensures:
   * - bottom based layout on larger devices
   * - no cropped content on smaller devices
   */
  private dynamicallyAdaptHeaderImage(){

    /* default - set it to 140px */
    this.imageHolderHeight = 140;

    /* if there is a screen height, set it to a third of it */
    let screenHeight = window.screen.height;
    if(screenHeight > 0) {
      this.imageHolderHeight = (screenHeight / 3);
    }

    screenHeight = document.getElementById('main-content').clientHeight || screenHeight;
    let footerHeight = document.getElementById('login-footer').clientHeight || 0;
    let numberHeight = document.getElementById('number-row').clientHeight || 0;
    let passwordHeight = document.getElementById('password-row').clientHeight || 0;
    let informationHeight = document.getElementById('information-row').clientHeight || 0;

    /* if the sizes of the children can be determined, calculate the size precise */
    let totalHeight = footerHeight + numberHeight + passwordHeight + informationHeight;
    if(totalHeight > 0 && screenHeight > 0 && totalHeight < screenHeight){
      this.imageHolderHeight = (screenHeight - totalHeight) * 0.9;
    }

  }

  loadCameraPage() {
    this.navCtrl.push(ConfirmScanPageComponent);
  }

  loadWebView(title, urlType) {
    this.navCtrl.push(WebviewComponent, {urlType: urlType, title: title})
  }

  loadNextPageWithoutLogin() {

    this.auth.logout();
    if (this.navigatedFromPartnerDetail) {
      this.viewCtrl.dismiss();
    }
    else {
      this.navCtrl.setRoot(OverviewPageComponent);
    }

  }

  checkForValidInput() {
    //this.presentLoading();
    //this.login();
    this.presentLoading();
    if (isNaN(this.inputNumberOrEmail)) {
      if (this.emailAdressProperlyFormatted()) {
        this.login();
      }
      else {
        this.showPromptNoValidEmail();
        this.loading.dismiss();
      }
    }
    else {
      if (this.inputNumberOrEmail.length == 10) {
        this.login();
      }
      else {
        this.showPromptNoValidNumber();
        this.loading.dismiss();
      }
    }
  }

  emailAdressProperlyFormatted() {
    let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(this.inputNumberOrEmail);
  }

  login() {
    //TODO get username and password from user input
    //let username = "0016744807"
    //let password = "muster01$$";
    this.authService.login(this.inputNumberOrEmail, this.password).then(
      (user) => {
        this.loading.dismiss();
        this.navigateToNextPageWithLoginSuccessful(user.mitgliedId, user.securityToken);

      },
      (error) => {
        this.loading.dismiss();
        if (error==='LoginFailed') {
          this.showPromptLoginFailed();
        } else {
          this.showPromptNoNetwork();
        }
      }
    );
  }

  navigateToNextPageWithLoginSuccessful(id, token) {
    if (this.navigatedFromPartnerDetail) {
      this.viewCtrl.dismiss();
    }
    else {
      this.navCtrl.setRoot(OverviewPageComponent, {id: id, token: token, login: true});
    }
  }

  focusPassword(event){
    if (event.keyCode == 13) {
      this.passwordInput.setFocus();
    }
  }

  checkForEnterButtonPressed(event) {
    if (event.keyCode == 13) {
      this.checkForValidInput();
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

  showPromptNoNetwork() {
    let prompt = this.alertCtrl.create({
      title: 'Login fehlgeschlagen',
      message: "Bitte überprüfen Sie Ihr Netzwerk.",
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
    this.authService.forgotPassword(loginString)
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
            if (showPasswordForgottenPromptAgain) {
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

  gotToExternalSiteForJoiningBsw() {
    let url = localStorage.getItem('beitretenWebviewUrl');
    let openUrl: any;
    try {
      openUrl = cordova.InAppBrowser.open;
    } catch (error) {
      openUrl = open;
    }
    console.log(url)
    openUrl(url, '_system', 'location=yes');
  }

}


