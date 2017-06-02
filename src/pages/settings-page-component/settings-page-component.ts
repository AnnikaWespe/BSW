import {Component, OnDestroy} from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import {WebviewComponent} from "../webview/webview";

@Component({
  selector: 'settings-page-component',
  templateUrl: 'settings-page-component.html'
})
export class SettingsPageComponent implements OnDestroy{

  favoritesPush = false;
  localPush = false;
  accountInfoPush = false;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.favoritesPush = (localStorage.getItem("favoritesPush")=="true");
    this.localPush = (localStorage.getItem("localPush")=="true");
    this.accountInfoPush = (localStorage.getItem("accountInfoPush")=="true");
  }

  title = "Einstellungen";

  getWebView(urlType, title, dataProtectionScreen, cacheContent){
    this.navCtrl.push(WebviewComponent, {url: urlType, title: title, cacheContent: cacheContent})
  }

  ngOnDestroy(){
    localStorage.setItem("favoritesPush", this.favoritesPush.toString());
    localStorage.setItem("localPush", this.localPush.toString());
    localStorage.setItem("accountInfoPush", this.accountInfoPush.toString());
  }
}
