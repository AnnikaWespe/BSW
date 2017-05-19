import {Component, ViewChild, AfterViewInit} from '@angular/core';
import {NavController, NavParams} from "ionic-angular";

@Component({
  selector: 'webview',
  templateUrl: 'webview.html'
})
export class WebviewComponent implements AfterViewInit {

  title: string;
  url;
  @ViewChild('iframe') iframe;
  @ViewChild('mytext') mytext;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    //this.url = navParams.get('url');
    this.url = "www.asdfasdfl.de";
    this.title = navParams.get('title');
  }

  ngAfterViewInit() {
    console.log(this.iframe, this.mytext);
  }

  onError(){
    console.log("there was an error");
  }
}


