import {Component, Input, trigger, state, style, animate, transition} from '@angular/core';
import {NavController, NavParams} from 'ionic-angular';

import {UserDetailProvider} from './user-detail/user-detail-provider';
import {UserDetail} from "./user-detail/UserDetail";

@Component({
  selector: 'my-profile-page-component',
  templateUrl: 'my-profile-page-component.html',
  providers: [UserDetailProvider],
  animations: [
    trigger('show', [
      state('false', style({
        'max-height': '0'
      })),
      state('true', style({
        'height': '*',
        '-webkit-transition': 'height .5s',
        'transition': 'height .5s'
      })),
      transition('* => *', animate(1000))
    ])
  ]
})
export class MyProfilePageComponent {
  title: string = "Mein Profil";
  showContentOnPosition: Array<boolean> = [
    true, false, false, false
  ];
  userDetail: UserDetail;
  optionsSalutation = ["Frau", "Herr", "Firma"];
  submitted: boolean = false;
  onSubmit(){this.submitted = true};
  get diagnostic(){return JSON.stringify(this.userDetail)};


  constructor(public navCtrl: NavController, public navParams: NavParams, public profileDataProvider: UserDetailProvider) {
    this.userDetail = profileDataProvider.getUserDetail();
  }



  toggleContent(i) {
    //TODO: Check if let ... of someArray works in Typescript
    //for (let boolean of this.showContentOnPosition){
    //  boolean = false;
    //};
    this.showContentOnPosition = [false, false, false, false];
    this.showContentOnPosition[i] = true;
  }


}
