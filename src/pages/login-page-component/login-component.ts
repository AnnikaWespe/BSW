import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

/*
  Generated class for the LoginComponent page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-login-component',
  templateUrl: 'login-component.html',
})
export class LoginComponent {

  logoUrl: string = "/../../assets/icon/BSW_logo.svg";
  constructor(public navCtrl: NavController, public navParams: NavParams) {}

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginComponentPage');
  }

}
