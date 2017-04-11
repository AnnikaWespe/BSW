import {Component, ViewChild, OnInit} from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';

import  {AddPurchasePageComponent} from '../pages/add-purchase-page-component/add-purchase-component';
import {OverviewPageComponent} from "../pages/overview-page-component/overview-component";
import {LoginPageComponent} from "../pages/login-page-component/login-component";
import {MyProfilePageComponent} from "../pages/my-profile-page-component/my-profile-page-component";
import {PartnerPageComponent} from "../pages/partner-page-component/partner-page-component";
import {SettingsPageComponent} from "../pages/settings-page-component/settings-page-component";
import {DeviceService} from "../services/device-data";
import {FilterData} from "../services/filter-data";


@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = LoginPageComponent;
  pages: Array<{title: string, component: any, parameters: {}}>;


  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar
  ) {
    this.initializeApp();
    this.setMenu();
  }

  initializeApp() {
    this.platform.ready()
    .then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();

      this.getDevice();
    });
  }

  openPage(page) {
    this.nav.setRoot(page.component, page.parameters);
  }

  getDevice(){
    if (!this.platform.is('cordova')){
      DeviceService.isInBrowser = true;
      console.log("isInBrowser");
    }
    else if (this.platform.is('ios')){
      DeviceService.isIos = true;
      console.log("ios");
    }
    else if (this.platform.is('android')){
      DeviceService.isAndroid = true;
      console.log("android");
    }
    else if (this.platform.is('windows')){
      DeviceService.isIos = true;
      console.log("windowsPhone");
    }
  }

  setMenu(){
    this.pages = [
      { title: 'Übersicht', component: OverviewPageComponent, parameters: {}},
      { title: 'Vor Ort Partner', component: PartnerPageComponent, parameters: {type: "offlinePartnerPageComponent"}},
      { title: 'Online Partner', component: PartnerPageComponent, parameters: {type: "onlinePartnerPageComponent"}},
      { title: 'Einkauf nachtragen', component: AddPurchasePageComponent, parameters: {}},
      { title: 'Mein Profil', component: MyProfilePageComponent, parameters: {}},
      { title: 'Einstellungen', component: SettingsPageComponent, parameters: {}},
      {title: "Abmelden", component: LoginPageComponent, parameters: {}}]
  }
}
