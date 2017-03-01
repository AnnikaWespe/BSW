import {Component, trigger, state, style } from '@angular/core';
import {NavController, NavParams} from 'ionic-angular';

import {UserDetailProvider} from './user-detail/user-detail-provider';
import {UserDetail} from "./user-detail/UserDetail";

@Component({
  selector: 'my-profile-page-component',
  templateUrl: 'my-profile-page-component.html',
  providers: [UserDetailProvider],
})
export class MyProfilePageComponent {
  title: string = "Mein Profil";

  userDetail: UserDetail;

  constructor(public navCtrl: NavController, public navParams: NavParams, public profileDataProvider: UserDetailProvider) {
    this.userDetail = profileDataProvider.getUserDetail();
  }

}
