import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';


@Component({
  selector: 'my-profile-page-component',
  templateUrl: 'my-profile-page-component.html'
})
export class MyProfilePageComponent {

  constructor(public navCtrl: NavController, public navParams: NavParams) {}
}
