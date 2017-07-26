import {Component, ViewChild, OnInit} from '@angular/core';
import {Events, Nav, Platform} from 'ionic-angular';
import {SplashScreen} from '@ionic-native/splash-screen';
import {GoogleAnalytics} from "@ionic-native/google-analytics";


import  {AddPurchasePageComponent} from '../pages/add-purchase-page-component/add-purchase-component';
import {OverviewPageComponent} from "../pages/overview-page-component/overview-component";
import {LoginPageComponent} from "../pages/login-page-component/login-component";
import {MyProfilePageComponent} from "../pages/my-profile-page-component/my-profile-page-component";
import {PartnerPageComponent} from "../pages/partner-page-component/partner-page-component";
import {SettingsPageComponent} from "../pages/settings-page-component/settings-page-component";
import {DeviceService} from "../services/device-data";
import {WebviewComponent} from "../pages/webview/webview";
import {InitService} from "./init-service";
import {PushNotificationsService} from "../services/push-notifications-service";
import {Firebase} from "@ionic-native/firebase";
import {StatusBar} from "@ionic-native/status-bar";


@Component({
  templateUrl: 'app.html'
})
export class BSWBonusApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any;
  pages: Array<{ title: string, component: any, parameters: {} }>;
  userLoggedIn = localStorage.getItem("securityToken") !== null;
  name;
  title;
  salutation;
  lastName;
  mitgliedId;
  securityToken;

  constructor(private platform: Platform,
              private splashScreen: SplashScreen,
              private ga: GoogleAnalytics,
              private initService: InitService,
              public events: Events,
              private firebase: Firebase,
              private pushNotificationsService: PushNotificationsService,
              private statusBar: StatusBar) {
    events.subscribe("userLoggedIn", (id, token) => {
      this.userLoggedIn = true;
      this.mitgliedId = id;
      this.securityToken = token;
      this.getUserData( id, token);
      this.setWebViewsUrls();
    });
    this.mitgliedId = localStorage.getItem("mitgliedId");
    this.securityToken = localStorage.getItem("securityToken");
    this.setMenu();
    this.initializeApp();
    localStorage.setItem("locationExact", "false");
    if(this.securityToken){
      let title = localStorage.getItem("userTitle");
      this.title = (title == "null") ? "" : title;
      this.salutation = localStorage.getItem("salutation");
      this.lastName = localStorage.getItem("lastName");
    }
    this.setWebViewsUrls();
  }

  initializeApp() {
    this.platform.ready()
      .then(() => {
          this.splashScreen.hide();
          this.setRootPage();
          this.statusBar.overlaysWebView(false);
          this.statusBar.backgroundColorByHexString('#929395');
          this.getDevice();
        },
        (err) => {
          this.setRootPage()
        });
  }


  setRootPage() {
    if (localStorage.getItem("securityToken")) {
      this.rootPage = OverviewPageComponent;
    }
    else {
      this.rootPage = LoginPageComponent;
    }
  }

  getUserData(mitgliedId, securityToken) {
    this.initService.getUserData(mitgliedId, securityToken).subscribe((res) => {
        let result = res.json();
        if (result.errors[0].beschreibung === "Erfolg") {
          let data = result.response.list[0].row;
          this.lastName = data.NAME;
          this.salutation = data.ANREDE;
          this.title = data.TITEL || "";
          localStorage.setItem("userTitle", data.TITEL);
          localStorage.setItem("salutation", data.ANREDE);
          localStorage.setItem("firstName", data.VORNAME);
          localStorage.setItem("lastName", data.NAME);
        }
        else{
          console.log("in getUserData", result.errors[0].beschreibung);
        }
      },
      (error) => {
        let title = localStorage.getItem("userTitle");
        this.title = (title == "null") ? "" : title;
        this.lastName = localStorage.getItem("lastName");
        this.salutation = localStorage.getItem("salutation");
      }
    )
  }

  startGoogleAnalyticsTracker(id) {
    if (localStorage.getItem("disallowUserTracking") === null) {
      localStorage.setItem("disallowUserTracking", "false");
    }
    if (localStorage.getItem("disallowUserTracking") === "false") {
      this.ga.startTrackerWithId(id)
        .then(() => {
          this.ga.trackEvent('Login/Logout', 'Start der App');
        })
        .catch(e => console.log('Error starting GoogleAnalytics', e))
    }
  }

  setWebViewsUrls() {
    this.initService.setWebViewUrls();
  }


  openPage(page) {
    this.nav.setRoot(page.component, page.parameters);
  }

  getDevice() {
    if (!this.platform.is('cordova')) {
      DeviceService.isInBrowser = true;
      console.log("isInBrowser");
    }
    else {
      this.managePushes();
      if (this.platform.is('ios')) {
        DeviceService.isIos = true;
        this.startGoogleAnalyticsTracker("UA-64402282-1");
        console.log("ios");
      }
      else if (this.platform.is('android')) {
        DeviceService.isAndroid = true;
        this.startGoogleAnalyticsTracker("UA-64402282-2");

        console.log("android");
      }
      else if (this.platform.is('windows')) {
        DeviceService.isIos = true;
        console.log("windowsPhone");
      }
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
    localStorage.removeItem("userTitle");
    localStorage.removeItem("salutation");
    localStorage.removeItem("firstName");
    localStorage.removeItem("lastName");
    if (localStorage.getItem("disallowUserTracking") === "false") {
      this.ga.trackEvent('Login/Logout', 'logout');
    }
    this.nav.setRoot(LoginPageComponent);
    this.userLoggedIn = false;
  }


  loadContactPage() {
    this.nav.push(WebviewComponent, {urlType: "KontaktWebviewUrl", title: "Kontakt"})
  }


  managePushes() {
    let firebaseToken = localStorage.getItem("firebaseToken");
    if (firebaseToken == null) {
      this.firebase.getToken()
        .then(token => {
          if (token) {
            this.updateToken(token);
          }
        })
    }
    this.firebase.onTokenRefresh()
      .subscribe((token) => {
        this.updateToken(token)
      });
    if (localStorage.getItem("updatePushNotificationsNextTime") == "true") {
      let token = localStorage.getItem("firebaseToken") || "";
      this.pushNotificationsService.sendPushNotificationsRequest(token, "").subscribe((res) => {
        console.log("result from Firebase API request", res.json().errors[0]);
        localStorage.setItem("updatePushNotificationsNextTime", "false");
      });
    }
  }

  updateToken(token) {
    let oldToken = localStorage.getItem("firebaseToken") || "";
    localStorage.setItem("firebaseToken", token);
    this.pushNotificationsService.sendPushNotificationsRequest(token, oldToken).subscribe((res) => {
      console.log("result from Firebase API request", res.json().errors[0])
    });
  }

}

