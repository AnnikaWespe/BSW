import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

@Component({
  selector: 'settings-page-component',
  templateUrl: 'settings-page-component.html'
})
export class SettingsPageComponent {

  constructor(public navCtrl: NavController, public navParams: NavParams) {}
}
