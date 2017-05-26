import {Component, trigger, state, style} from '@angular/core';
import {ModalController, NavController, NavParams} from 'ionic-angular';

import {UserDetailProvider} from './user-detail/user-detail-provider';
import {UserDetail} from "./user-detail/UserDetail";
import {WebviewComponent} from "../webview/webview";
import {GoogleAnalytics} from "@ionic-native/google-analytics";
import {ChangePasswordModal} from "./ChangePassword/change-password-modal";

@Component({
  selector: 'my-profile-page-component',
  templateUrl: 'my-profile-page-component.html',
  providers: [UserDetailProvider],
})
export class MyProfilePageComponent {
  title: string = "Mein Profil";
  profileOverview = true;

  userDetail: UserDetail;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public profileDataProvider: UserDetailProvider,
              private ga: GoogleAnalytics,
              public modalCtrl: ModalController) {
    this.userDetail = profileDataProvider.getUserDetail();
    if (localStorage.getItem("disallowUserTracking") === "false") {
      this.ga.trackView('Mein Profil Screen');
    }
  }

  getWebView(url, title) {
    this.navCtrl.push(WebviewComponent, {url: url, title: title})
  }

  presentChangePasswordModal(){
    let changePasswordModal = this.modalCtrl.create(ChangePasswordModal);
    changePasswordModal.present();
  }


}
