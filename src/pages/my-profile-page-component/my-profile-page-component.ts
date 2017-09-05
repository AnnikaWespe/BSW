import {Component} from '@angular/core';
import {ModalController, NavController, NavParams} from 'ionic-angular';

import {WebviewComponent} from "../webview/webview";
import {GoogleAnalytics} from "@ionic-native/google-analytics";
import {ChangePasswordModal} from "./ChangePassword/change-password-modal";
import {AuthService} from "../../services/auth-service";
import {ExternalSiteService} from "../../services/external-site-service";
declare let cordova: any;


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
              public authService: AuthService,
              private externalSiteService: ExternalSiteService) {
    if (localStorage.getItem("disallowUserTracking") === "false") {
      this.ga.trackView('Mein Profil Screen');
    }
    this.user = this.authService.getUser();
  }



  gotToExternalSite(urlType, title) {
    this.externalSiteService.gotToExternalSite(urlType, title);
  }

  presentChangePasswordModal(){
    let changePasswordModal = this.modalCtrl.create(ChangePasswordModal);
    changePasswordModal.present();
    changePasswordModal.onDidDismiss(data => {
      this.passwordChanged = data.passwordChanged;
    })
  }


}
