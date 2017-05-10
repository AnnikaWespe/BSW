import {Component, trigger, state, style } from '@angular/core';
import {NavController, NavParams} from 'ionic-angular';

import {UserDetailProvider} from './user-detail/user-detail-provider';
import {UserDetail} from "./user-detail/UserDetail";
import {WebviewComponent} from "../webview/webview";

@Component({
  selector: 'my-profile-page-component',
  templateUrl: 'my-profile-page-component.html',
  providers: [UserDetailProvider],
})
export class MyProfilePageComponent {
  title: string = "Mein Profil";
  profileOverview = true;

  userDetail: UserDetail;

  constructor(public navCtrl: NavController, public navParams: NavParams, public profileDataProvider: UserDetailProvider) {
    this.userDetail = profileDataProvider.getUserDetail();
  }
  getWebView(url, title){
  this.navCtrl.push(WebviewComponent, {url: url, title: title})
  }

}
