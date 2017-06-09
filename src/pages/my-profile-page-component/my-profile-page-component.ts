import {Component} from '@angular/core';
import {ModalController, NavController, NavParams} from 'ionic-angular';

import {WebviewComponent} from "../webview/webview";
import {GoogleAnalytics} from "@ionic-native/google-analytics";
import {ChangePasswordModal} from "./ChangePassword/change-password-modal";

@Component({
  selector: 'my-profile-page-component',
  templateUrl: 'my-profile-page-component.html',
})
export class MyProfilePageComponent {
  title: string = "Mein Profil";
  profileOverview = true;
  firstName: string;
  lastName: string;
  passwordChanged = false;
  mitgliedsnummer;


  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private ga: GoogleAnalytics,
              public modalCtrl: ModalController) {
    if (localStorage.getItem("disallowUserTracking") === "false") {
      this.ga.trackView('Mein Profil Screen');
    }
    this.firstName = localStorage.getItem("firstName");
    this.lastName = localStorage.getItem("lastName");
    this.mitgliedsnummer = localStorage.getItem("mitgliedsnummer");
  }

  getWebView(urlType, title) {
    this.navCtrl.push(WebviewComponent, {urlType: urlType, title: title})
  }

  presentChangePasswordModal(){
    let changePasswordModal = this.modalCtrl.create(ChangePasswordModal);
    changePasswordModal.present();
    changePasswordModal.onDidDismiss(data => {
      this.passwordChanged = data.passwordChanged;
    })
  }


}
