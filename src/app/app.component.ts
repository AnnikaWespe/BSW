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
import {WebviewComponent} from "../pages/webview/webview";
import {Http, Headers} from "@angular/http";
import {InitService} from "./init-service";


@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any;
  pages: Array<{ title: string, component: any, parameters: {} }>;
  userLoggedIn = localStorage.getItem("securityToken");

  constructor(private platform: Platform,
              private splashScreen: SplashScreen,
              private statusBar: StatusBar,
              private ga: GoogleAnalytics,
              private http: Http,
              private initService: InitService) {
    this.setMenu();
    if (localStorage.getItem("securityToken")) {
      this.rootPage = OverviewPageComponent;
    }
    else {
      this.rootPage = LoginPageComponent;
    }
    localStorage.setItem("locationExact", "false");
    this.initializeApp();
    this.setWebViewsUrls();
    this.getUserData();
  }

  initializeApp() {
    this.platform.ready()
      .then(() => {
        this.startGoogleAnalyticsTracker();
        //this.statusBar.overlaysWebView(true);
        this.splashScreen.hide();
        this.getDevice();
      });
  }

  getUserData() {
    this.initService.getUserData().subscribe((res) => {
      console.log(res.json())
    })
  }

  startGoogleAnalyticsTracker() {
    if (localStorage.getItem("disallowUserTracking") === null) {
      localStorage.setItem("disallowUserTracking", "false");
    }
    if (localStorage.getItem("disallowUserTracking") === "false") {
      this.ga.startTrackerWithId('UA-99848389-1')
        .then(() => {
          this.ga.trackEvent('Login/Logout', 'Start der App');
        })
        .catch(e => console.log('Error starting GoogleAnalytics', e))
    }
  }

  setWebViewsUrls() {
    this.initService.getWebViewUrls().subscribe((res) => {
      let result = res.json();
      if (result.errors[0].beschreibung === "Erfolg") {
        localStorage.setItem("ImpressumWebviewUrl", result.response.bswAppWebviewUrl[0].webviewUrl);
        localStorage.setItem("DatenschutzWebviewUrl", result.response.bswAppWebviewUrl[1].webviewUrl);
        localStorage.setItem("KontaktWebviewUrl", result.response.bswAppWebviewUrl[2].webviewUrl);
        localStorage.setItem("VorteilsuebersichtWebviewUrl", result.response.bswAppWebviewUrl[3].webviewUrl);
        localStorage.setItem("ProfildatenWebviewUrl", result.response.bswAppWebviewUrl[4].webviewUrl);
        localStorage.setItem("BankdatenWebviewUrl", result.response.bswAppWebviewUrl[5].webviewUrl);
        localStorage.setItem("beitretenWebviewUrl", result.response.bswAppWebviewUrl[6].webviewUrl);
      }
      else {
        localStorage.setItem("noWebViewUrlsAvailable", "true");
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
    localStorage.removeItem("mitgliedId");
    if (localStorage.getItem("disallowUserTracking") === "false") {
      this.ga.trackEvent('Login/Logout', 'logout');
    }
    this.nav.setRoot(LoginPageComponent);
  }

  loadContactPage() {
    this.nav.push(WebviewComponent, {urlType: "KontaktWebviewUrl", title: "Kontakt"})
  }
}
