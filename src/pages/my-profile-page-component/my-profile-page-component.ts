import {Component, Input} from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import {ProfileDataProvider} from './profile-data-provider';
import {MyProfileData} from "./my-profile-data";

@Component({
  selector: 'my-profile-page-component',
  templateUrl: 'my-profile-page-component.html',
  providers: [ProfileDataProvider]
})
export class MyProfilePageComponent {
title: string = "Mein Profil";

showContentOnPosition : Array<boolean> = [
  true, false, false, false
];
toggleContent(i){
  //TODO: Check if let ... of someArray works in Typescript
  //for (let boolean of this.showContentOnPosition){
  //  boolean = false;
  //};
  this.showContentOnPosition = [false, false, false, false];
  this.showContentOnPosition[i]=true;
}
profileData: MyProfileData;
  constructor(public navCtrl: NavController, public navParams: NavParams, public profileDataProvider: ProfileDataProvider) {
    this.profileData = profileDataProvider.getProfileData();
  }
}
