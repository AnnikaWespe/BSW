import {Component, ViewChild, AfterViewInit} from '@angular/core';
import {NavController, NavParams} from "ionic-angular";

@Component({
  selector: 'webview',
  templateUrl: 'webview.html'
})
export class WebviewComponent {

  title: string;
  url;
  @ViewChild('iframe') iframe;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    //this.url = navParams.get('url');
    this.url = "http://whatsmyuseragent.org/"
    this.title = navParams.get('title');
  }
}


