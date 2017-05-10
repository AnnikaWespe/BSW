import { Component } from '@angular/core';
import {NavController, NavParams} from "ionic-angular";

@Component({
  selector: 'webview',
  templateUrl: 'webview.html'
})
export class WebviewComponent {

  title: string;
  url: string;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.url = navParams.get('url');
    this.title = navParams.get('title');
  }

}
