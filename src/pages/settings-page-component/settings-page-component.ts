import {Component, OnDestroy} from '@angular/core';
import {NavController, NavParams} from 'ionic-angular';
import {WebviewComponent} from "../webview/webview";
import {Firebase} from "@ionic-native/firebase";
import {PushNotificationsService} from "../../services/push-notifications-service";

@Component({
  selector: 'settings-page-component',
  templateUrl: 'settings-page-component.html'
})
export class SettingsPageComponent implements OnDestroy {

  favoritesPush: boolean;
  accountInfoPush: boolean;
  localReminder: boolean;
  enablePushesInGeneral: boolean;
  disablePushesInGeneral: boolean;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private pushNotificationsService: PushNotificationsService) {
    this.favoritesPush = (localStorage.getItem("favoritesPush") == "false") ? false : true;
    this.accountInfoPush = (localStorage.getItem("accountInfoPush") == "false") ? false : true;
    this.localReminder = (localStorage.getItem("localReminder") == "false") ? false : true;
    this.enablePushesInGeneral = (localStorage.getItem("enablePushesInGeneral") == "false") ? false : true;
    this.disablePushesInGeneral = !this.enablePushesInGeneral;
  }

  title = "Einstellungen";

  getWebView(urlType, title, dataProtectionScreen, cacheContent) {
    this.navCtrl.push(WebviewComponent, {urlType: urlType, title: title, cacheContent: cacheContent})
  }

  ngOnDestroy() {
    this.enablePushesInGeneral = !this.disablePushesInGeneral;
    if (this.enablePushesInGeneral) {
      localStorage.setItem("favoritesPush", this.favoritesPush.toString());
      localStorage.setItem("accountInfoPush", this.accountInfoPush.toString());
      localStorage.setItem("localReminder", this.localReminder.toString());
      localStorage.setItem("enablePushesInGeneral", "true");
    }
    else {
      localStorage.setItem("favoritesPush", "false");
      localStorage.setItem("accountInfoPush", "false");
      localStorage.setItem("localReminder", "false");
      localStorage.setItem("enablePushesInGeneral", "false");
    }
    this.updatePushRequests();
  }

  updatePushRequests() {
   this.pushNotificationsService.sendPushNotificationsRequestWithNewSettings(this.favoritesPush, this.accountInfoPush, this.enablePushesInGeneral).subscribe((res) => {
   console.log("result from Firebase API request", res.json().errors[0]);
   }, (err) => {
   localStorage.setItem("updatePushNotificationsNextTime", "true");
   });
   }
}
