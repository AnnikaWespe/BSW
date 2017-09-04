import {Component, ViewChild, OnInit, Pipe, PipeTransform} from '@angular/core';
import {Events, Nav, Platform} from 'ionic-angular';
import {SplashScreen} from '@ionic-native/splash-screen';
import {GoogleAnalytics} from "@ionic-native/google-analytics";


import {AddPurchasePageComponent} from '../pages/add-purchase-page-component/add-purchase-component';
import {OverviewPageComponent} from "../pages/overview-page-component/overview-component";
import {LoginPageComponent} from "../pages/login-page-component/login-component";
import {MyProfilePageComponent} from "../pages/my-profile-page-component/my-profile-page-component";
import {PartnerPageComponent} from "../pages/partner-page-component/partner-page-component";
import {SettingsPageComponent} from "../pages/settings-page-component/settings-page-component";
import {DeviceService} from "../services/device-data";
import {WebviewComponent} from "../pages/webview/webview";
import {InitService} from "./init-service";
import {PushNotificationsService} from "../services/push-notifications-service";
import {StatusBar} from "@ionic-native/status-bar";
import {PartnerDetailComponent} from "../pages/partner-page-component/partner-detail-component/partner-detail-component";
import {PartnerService} from "../services/partner-service";
import {AuthService} from '../services/auth-service';
import {PushesListPageComponent} from "../pages/pushes-list/pushes-list";
import {SavePartnersService} from "../pages/partner-page-component/partner-detail-component/save-partners-service";
import {LocationService} from "../services/location-service";
import {ExternalSiteService} from "../services/external-site-service";

declare let cordova: any;

@Component({
  templateUrl: 'app.html'
})

export class BSWBonusApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any;
  pages: Array<{ title: string, component: any, parameters: {} }>;
  user;

  jsonObject = {
    'to': 'id',
    'notification': {
      'body': 'Zwei Ihrer Favoriten haben seit heute neue Aktionen',
      'title': 'Neue Aktionen',
      'icon': 'newpromotion'
    },
    'data': {
      'typ': 'promotion',
      'partnerfirmaId': ['69852'],
      'pfNummer': ["asdf", "1234", "62750000", "35280000", "34880000", "30080000", "30010000", "61310001", "11015201", "68700000", "72010000", "77230051", "77990000", "72790000", "72800000", "72910000", "72970000", "73260000", "81700000", "30010374", "73620000", "73440031", "34150448", "77000060", "89420999", "11047828", "34730000", "35460128", "74000033", "74000038", "11051103", "11052211", "37182081", "11036374", "74000104", "74000105", "74000199", "74000433", "38192039", "74000752"]
    }
  }


  constructor(private platform: Platform,
              private splashScreen: SplashScreen,
              private ga: GoogleAnalytics,
              private initService: InitService,
              public events: Events,
              private pushNotificationsService: PushNotificationsService,
              private statusBar: StatusBar,
              private partnerService: PartnerService,
              private savePartnerService: SavePartnersService,
              private authService: AuthService,
              private locationService: LocationService,
              private externalSiteService: ExternalSiteService) {
    this.user = this.authService.getUser();
    this.registerForUserLogInEvent();
    this.setMenu();
    this.initializeApp();
    // localStorage.setItem("locationExact", "false");

    this.setWebViewsUrls();
  }

  initializeApp() {
    this.platform.ready()
      .then(() => {
          this.splashScreen.hide();
          this.setRootPage();

          if (this.platform.is("android")) {
            this.statusBar.overlaysWebView(false);
            this.statusBar.backgroundColorByHexString('#929395');
          } else {
            this.statusBar.overlaysWebView(true);
            this.statusBar.styleDefault();
          }

          this.getDevice();

        },
        (err) => {
          this.setRootPage()
        });
  }


  setRootPage() {
    if (this.user.loggedIn) {
      this.rootPage = OverviewPageComponent;
    }
    else {
      this.rootPage = LoginPageComponent;
    }
  }

  startGoogleAnalyticsTracker(id) {

    if (localStorage.getItem("disallowUserTracking") === null) {
      localStorage.setItem("disallowUserTracking", "false");
    }

    if (localStorage.getItem("disallowUserTracking") === "false") {
      this.ga.setOptOut(false);
      this.ga.setAnonymizeIp(true);
      this.ga.startTrackerWithId(id)
        .then(() => {
          this.ga.trackEvent('Login/Logout', 'Start der App');
        })
        .catch(e => console.log('Error starting GoogleAnalytics', e))
    } else {
      this.ga.setOptOut(true);
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
      if (this.user.securityToken) {
        //this.managePushes(this.mitgliedId, this.securityToken);
      }
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
      {title: 'Vor-Ort-Partner', component: PartnerPageComponent, parameters: {type: "offlinePartnerPageComponent"}},
      {title: 'Online-Partner', component: PartnerPageComponent, parameters: {type: "onlinePartnerPageComponent"}},
      {title: 'Einkauf nachtragen', component: AddPurchasePageComponent, parameters: {}},
      {title: 'Mein Profil', component: MyProfilePageComponent, parameters: {}},
      {title: 'Einstellungen', component: SettingsPageComponent, parameters: {}},
      {title: "Abmelden", component: LoginPageComponent, parameters: {}}]
  }

  logoutUser() {
    this.savePartnerService.clearRecentPartners();
    //this.savePartnerService.clearFavoritePartners() ;
    this.authService.logout();

    this.nav.setRoot(LoginPageComponent);
  }

  loginUser() {
    this.nav.setRoot(LoginPageComponent);
  }

  loadContactPage() {
    this.externalSiteService.gotToExternalSite("KontaktWebviewUrl");
  }

  registerForUserLogInEvent() {
    this.events.subscribe('user:loggedOut', () => {
      this.user = {loggedIn: false};
      console.log(this.user);
    });
    this.events.subscribe('user:loggedIn', (user) => {
      this.user = user;
      console.log(this.user);
    });
  }

  /* copied from settings page */
  getWebView(urlType, title, dataProtectionScreen, cacheContent) {
    this.nav.push(WebviewComponent, {urlType: urlType, title: title, cacheContent: cacheContent})
  }



}
