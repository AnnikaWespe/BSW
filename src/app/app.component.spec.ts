import {TestBed} from '@angular/core/testing';
// import {TestUtils} from 'dekra.core2';
import {MyApp} from './app.component';
import { Nav, Platform } from 'ionic-angular';

import {LoginPageComponent} from "../pages/login-page-component/login-component";

class NavMock {
  setRoot() {}
}

// describe('App component', () => {
//   let app: MyApp;
//   let platform: Platform;
//
//   beforeEach(() => {
//     TestBed.configureTestingModule({
//       providers: [
//         {provide: Nav, useClass: NavMock}
//       ]
//     });
//     // TestUtils.configureIonicTestingModule([MyApp]);
//     platform = new Platform()
//     app = new MyApp(platform); // = TestBed.get(MyApp);
//     app.nav = TestBed.get(Nav);
//   });
//
//   it('should hold expected values', () => {
//     expect(app).toBeDefined();
//     expect(app.rootPage).toEqual(LoginPageComponent);
//     expect(app.pages.length > 0).toBe(true);
//   });
//
//   describe('#initializeApp', () => {
//
//     it('should initialize the app via device ready event', () => {
//       spyOn(platform, 'ready').and.returnValue(Promise.resolve());
//
//       app.initializeApp();
//       expect(platform.ready).toHaveBeenCalled();
//     });
//   });
//
//   describe('#openPage', () => {
//
//     it('should set the page root', () => {
//       spyOn(app.nav, 'setRoot');
//       let page = {component: {}, parameters: {}};
//
//       app.openPage(page);
//
//       expect(app.nav.setRoot).toHaveBeenCalledWith(page.component, page.parameters);
//     });
//   });
// });
