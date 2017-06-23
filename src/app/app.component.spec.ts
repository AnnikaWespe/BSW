/*import {TestBed} from '@angular/core/testing';
// import {TestUtils} from 'dekra.core2';
import {BSWBonusApp} from './app.component';
import { Nav, Platform } from 'ionic-angular';

import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';

import {LoginPageComponent} from "../pages/login-page-component/login-component";
import {GoogleAnalytics} from "@ionic-native/google-analytics";
import {Http} from "@angular/http";
import {InitService} from "./init-service";
import {PushNotificationsService} from "../services/push-notifications-service";
import {Firebase} from "@ionic-native/firebase";

class NavMock {
  setRoot() {}
}

describe('App component', () => {
  let app: BSWBonusApp;
  let platform: Platform;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {provide: Nav, useClass: NavMock},
        SplashScreen,
        StatusBar
      ]
    });
    // TestUtils.configureIonicTestingModule([MyApp]);
    platform = new Platform();

    let splashScreen = TestBed.get(SplashScreen);
    let statusBar = TestBed.get(StatusBar);
    let googleAnalytics = TestBed.get(GoogleAnalytics);
    let http = TestBed.get(Http);
    let initService = TestBed.get(InitService);
    let firebase = TestBed.get(Firebase);
    let pushNotificationsService = TestBed.get(PushNotificationsService);



    app = new BSWBonusApp(
      platform,
      splashScreen,
      statusBar,
      googleAnalytics,
      http,
      initService,
      firebase,
      pushNotificationsService
    ); // = TestBed.get(MyApp);
    app.nav = TestBed.get(Nav);
  });

  it('should hold expected values', () => {
    expect(app).toBeDefined();
    expect(app.rootPage).toEqual(LoginPageComponent);
    expect(app.pages.length > 0).toBe(true);
  });

  describe('#initializeApp', () => {

    it('should initialize the app via device ready event', () => {
      spyOn(platform, 'ready').and.returnValue(Promise.resolve());

      app.initializeApp();
      expect(platform.ready).toHaveBeenCalled();
    });
  });

  describe('#openPage', () => {

    it('should set the page root', () => {
      spyOn(app.nav, 'setRoot');
      let page = {component: {}, parameters: {}};

      app.openPage(page);

      expect(app.nav.setRoot).toHaveBeenCalledWith(page.component, page.parameters);
    });
  });
});
*/
