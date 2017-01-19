import { Component, ViewChild } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { StatusBar, Splashscreen } from 'ionic-native';

import  {AddPurchasePageComponent} from '../pages/add-purchase-page-component/add-purchase-component';
import {OverviewPageComponent} from "../pages/overview-page-component/overview-component";
import {LoginPageComponent} from "../pages/login-page-component/login-component";
import {ActionsPageComponent} from "../pages/actions-page-component/actions-page-component";
import {LogoutPageComponent} from "../pages/logout-page-component/logout-page-component";
import {MyProfilePageComponent} from "../pages/my-profile-page-component/my-profile-page-component";
import {PartnerPageComponent} from "../pages/partner-page-component/partner-page-component";
import {SettingsPageComponent} from "../pages/settings-page-component/settings-page-component";




@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = LoginPageComponent;

  pagesGeneral: Array<{title: string, component: any, icon: string}>;
  pagesPersonal: Array<{title: string, component: any, icon: string}>;
  pageExit: {title: string, component: any, icon: string};

  constructor(public platform: Platform) {
    this.initializeApp();

    // used for an example of ngFor and navigation
    this.pagesGeneral = [
      { title: 'Übersicht', component: OverviewPageComponent, icon: "home"},
      { title: 'Aktionen', component: ActionsPageComponent, icon: "list"},
      { title: 'Partner', component: PartnerPageComponent, icon: "sunny"},
      { title: 'Einkauf nachtragen', component: AddPurchasePageComponent, icon: "cash"}]
    ;
    this.pagesPersonal = [
      { title: 'Mein Profil', component: MyProfilePageComponent, icon: "person"},
      { title: 'Einstellungen', component: SettingsPageComponent, icon:"settings"},
    ];
    this.pageExit = {title: "Abmelden", component: LogoutPageComponent, icon: "exit"}
  }

  initializeApp() {
    this.platform.ready().then(() => {
      StatusBar.styleDefault();
      Splashscreen.hide();
    });
  }

  openPage(page) {
    this.nav.setRoot(page.component);
  }
}
