import {Component, OnDestroy} from '@angular/core';
import {NavController, NavParams} from 'ionic-angular';
import {WebviewComponent} from "../webview/webview";

@Component({
  selector: 'settings-page-component',
  templateUrl: 'settings-page-component.html'
})
export class SettingsPageComponent implements OnDestroy {

  favoritesPush = true;
  accountInfoPush = true;
  enablePushesInGeneral = true;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.favoritesPush = (localStorage.getItem("favoritesPush") == "true");
    this.accountInfoPush = (localStorage.getItem("accountInfoPush") == "true");
    this.accountInfoPush = (localStorage.getItem("disableAllPushes") == "true");
  }

  title = "Einstellungen";

  getWebView(urlType, title, dataProtectionScreen, cacheContent) {
    this.navCtrl.push(WebviewComponent, {urlType: urlType, title: title, cacheContent: cacheContent})
  }

  ngOnDestroy() {
    if (this.enablePushesInGeneral) {
      localStorage.setItem("favoritesPush", this.favoritesPush.toString());
      localStorage.setItem("accountInfoPush", this.accountInfoPush.toString());
      localStorage.setItem("enablePushesInGeneral", "true");
    }
    else {
      localStorage.setItem("favoritesPush", "false");
      localStorage.setItem("accountInfoPush", "false");
      localStorage.setItem("enablePushesInGeneral", "false");
    }

  }
}
