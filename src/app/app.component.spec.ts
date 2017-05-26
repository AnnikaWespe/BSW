import {TestBed} from '@angular/core/testing';
// import {TestUtils} from 'dekra.core2';
import {MyApp} from './app.component';
import { Nav, Platform } from 'ionic-angular';

import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';

import {LoginPageComponent} from "../pages/login-page-component/login-component";
import {GoogleAnalytics} from "@ionic-native/google-analytics";

class NavMock {
  setRoot() {}
}

describe('App component', () => {
  let app: MyApp;
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

    app = new MyApp(
      platform,
      splashScreen,
      statusBar,
      googleAnalytics
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
