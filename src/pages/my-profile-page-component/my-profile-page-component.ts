import {Component, trigger, state, style } from '@angular/core';
import {NavController, NavParams} from 'ionic-angular';

import {UserDetailProvider} from './user-detail/user-detail-provider';
import {UserDetail} from "./user-detail/UserDetail";

@Component({
  selector: 'my-profile-page-component',
  templateUrl: 'my-profile-page-component.html',
  providers: [UserDetailProvider],
  animations: [
    trigger('show', [
      state('no', style({
        'max-height': '0',
        'transition-property': 'all',
        'transition-duration': '.5s',
        'transition-timing-function': 'cubic-bezier(0, 1, 0.5, 1)'
      })),
      state('yes', style({
        'height': '*',
        'overflow-y': 'hidden',
        'max-height': '500px', /* approximate max height */

        'transition-property': 'all',
        'transition-duration': '.5s',
        'transition-timing-function': 'cubic-bezier(0, 1, 0.5, 1)'
      }))
    ])
  ]
})
export class MyProfilePageComponent {
  title: string = "Mein Profil";
  showContentOnPosition: Array<string> = [
    "yes", "no", "no", "no"
  ];
  userDetail: UserDetail;
  optionsSalutation = ["Frau", "Herr", "Firma"];
  submitted: boolean = false;

  onSubmit() {
    this.submitted = true
  };

  get diagnostic() {
    return JSON.stringify(this.userDetail)
  };


  constructor(public navCtrl: NavController, public navParams: NavParams, public profileDataProvider: UserDetailProvider) {
    this.userDetail = profileDataProvider.getUserDetail();
  }


  toggleContent(i) {
    for (let j = 0; j < this.showContentOnPosition.length; j++) {
      this.showContentOnPosition[j] = "no";
    };
    this.showContentOnPosition[i] = "yes";
  }
}
