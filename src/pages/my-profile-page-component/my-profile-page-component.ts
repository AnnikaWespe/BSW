import {Component} from '@angular/core';
import {ModalController, NavController, NavParams} from 'ionic-angular';

import {WebviewComponent} from "../webview/webview";
import {GoogleAnalytics} from "@ionic-native/google-analytics";
import {ChangePasswordModal} from "./ChangePassword/change-password-modal";
import {AuthService} from "../../services/auth-service";

@Component({
  selector: 'my-profile-page-component',
  templateUrl: 'my-profile-page-component.html',
})
export class MyProfilePageComponent {
  title: string = "Mein Profil";
  profileOverview = true;
  passwordChanged = false;
  user;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private ga: GoogleAnalytics,
              public modalCtrl: ModalController,
              public authService: AuthService) {
    if (localStorage.getItem("disallowUserTracking") === "false") {
      this.ga.trackView('Mein Profil Screen');
    }
    this.user = this.authService.getUser();
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
