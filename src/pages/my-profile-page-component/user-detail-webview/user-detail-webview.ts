import { Component } from '@angular/core';
import {NavController, NavParams} from "ionic-angular";

@Component({
  selector: 'user-detail-webview',
  templateUrl: 'user-detail-webview.html'
})
export class UserDetailWebviewComponent {

  title: string;
  url: string;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.url = navParams.get('url');
    this.title = navParams.get('title');
  }

}
