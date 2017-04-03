import { Component } from '@angular/core';
import {NavParams, NavController} from "ionic-angular";

/*
  Generated class for the LoginWebview component.

  See https://angular.io/docs/ts/latest/api/core/index/ComponentMetadata-class.html
  for more info on Angular 2 Components.
*/
@Component({
  selector: 'login-webview',
  templateUrl: 'login-webview.html'
})
export class LoginWebviewComponent {

  title: string;
  url: string;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.url = navParams.get('url');
    this.title = navParams.get('title');
  }

}
