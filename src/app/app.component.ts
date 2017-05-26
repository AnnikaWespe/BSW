import {Component, ViewChild, OnInit} from '@angular/core';
import {Nav, Platform} from 'ionic-angular';
import {SplashScreen} from '@ionic-native/splash-screen';
import {StatusBar} from '@ionic-native/status-bar';
import {GoogleAnalytics} from "@ionic-native/google-analytics";


import  {AddPurchasePageComponent} from '../pages/add-purchase-page-component/add-purchase-component';
import {OverviewPageComponent} from "../pages/overview-page-component/overview-component";
import {LoginPageComponent} from "../pages/login-page-component/login-component";
import {MyProfilePageComponent} from "../pages/my-profile-page-component/my-profile-page-component";
import {PartnerPageComponent} from "../pages/partner-page-component/partner-page-component";
import {SettingsPageComponent} from "../pages/settings-page-component/settings-page-component";
import {DeviceService} from "../services/device-data";


@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any;
  pages: Array<{ title: string, component: any, parameters: {} }>;


  constructor(private platform: Platform,
              private splashScreen: SplashScreen,
              private statusBar: StatusBar,
              private ga: GoogleAnalytics) {
    this.initializeApp();
    this.setMenu();
    localStorage.setItem("locationExact", "false");
    if (localStorage.getItem("securityToken")) {
      this.rootPage = OverviewPageComponent;
    }
    else {
      this.rootPage = LoginPageComponent;
    }
  }

  initializeApp() {
    this.platform.ready()
      .then(() => {
        if (localStorage.getItem("disallowUserTracking") === null) {
          localStorage.setItem("disallowUserTracking", "false");
        }
        this.statusBar.overlaysWebView(true);
        //this.statusBar.backgroundColorByHexString('#929395');
        this.splashScreen.hide();
        this.getDevice();
        if (localStorage.getItem("disallowUserTracking") === "false") {
          this.ga.startTrackerWithId('UA-99848389-1')
            .then(() => {
              console.log('Google analytics is ready now');
              this.ga.trackEvent('Login/Logout', 'Start der App');
            })
            .catch(e => console.log('Error starting GoogleAnalytics', e))
        }
      });
  }

  openPage(page) {
    this.nav.setRoot(page.component, page.parameters);
  }

  getDevice() {
    if (!this.platform.is('cordova')) {
      DeviceService.isInBrowser = true;
      console.log("isInBrowser");
    }
    else if (this.platform.is('ios')) {
      DeviceService.isIos = true;
      console.log("ios");
    }
    else if (this.platform.is('android')) {
      DeviceService.isAndroid = true;
      console.log("android");
    }
    else if (this.platform.is('windows')) {
      DeviceService.isIos = true;
      console.log("windowsPhone");
    }
  }

  setMenu() {
    this.pages = [
      {title: 'Übersicht', component: OverviewPageComponent, parameters: {}},
      {title: 'Vor Ort Partner', component: PartnerPageComponent, parameters: {type: "offlinePartnerPageComponent"}},
      {title: 'Online Partner', component: PartnerPageComponent, parameters: {type: "onlinePartnerPageComponent"}},
      {title: 'Einkauf nachtragen', component: AddPurchasePageComponent, parameters: {}},
      {title: 'Mein Profil', component: MyProfilePageComponent, parameters: {}},
      {title: 'Einstellungen', component: SettingsPageComponent, parameters: {}},
      {title: "Abmelden", component: LoginPageComponent, parameters: {}}]
  }

  logout() {
    localStorage.removeItem("securityToken");
    if (localStorage.getItem("disallowUserTracking") === "false") {
      this.ga.trackEvent('Login/Logout', 'logout');
    }
    this.nav.setRoot(LoginPageComponent);
  }
}
