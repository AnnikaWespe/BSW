import { TestBed, ComponentFixtureAutoDetect } from '@angular/core/testing';

import {
  Response,
  ResponseOptions,
  Headers
} from '@angular/http';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import {
  App,
  DomController,
  MenuController,
  NavController,
  NavParams,
  LoadingController,
  GestureController,
  AlertController,
  ModalController,
  Platform,
  Config,
  Keyboard,
  Form,
  IonicModule
}  from 'ionic-angular';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { TranslateModule } from 'ng2-translate/ng2-translate';


import {
  ConfigMock,
  NavMock,
  PlatformMock,
  // AlertMock
  // LoaderMock,
  ModalMock,
  // DomControllerMock
} from './mocks';


/**
 * Class provides some static helper functions to use in specs
 */
export class TestUtils {

  public static prepareSuccessfullHttpResponse(
    mockBackend,
    responseData: any = {success: true},
    headerData: any = {},
    status = 200
  ) {

    let response = new Response(
      new ResponseOptions({
        status: status,
        body: JSON.stringify(responseData),
        headers: new Headers(headerData)
      })
    );

    mockBackend.connections.subscribe(connection => {
      connection.mockRespond(response);
    });
  }

  public static prepareErrorHttpResponse(
    mockBackend,
    response?: Response | any,
    status = 500
  ) {
    if (!response) {
      response = new Response(new ResponseOptions({status: status}));
    }
    else if (!(response instanceof Response)) {
      response = new Response(new ResponseOptions({
        status: status,
        body: JSON.stringify(response)
      }));
    }
    mockBackend.connections.subscribe(connection => {
      connection.mockError(response);
    });
  }

  /**
   * Helper uses Angulars` "Testbed.configureTestingModule(any)" in order to
   * configure an ionic component together with all needed ionic class mocks
   * and automatic change detection
   *
   * Please read:
   *   * https://angular.io/docs/ts/latest/guide/testing.html
   *   * http://lathonez.com/2017/ionic-2-unit-testing/
   */
  public static configureIonicTestingModule(components: Array<any>): typeof TestBed {
    return TestBed.configureTestingModule({
      declarations: [
        ...components,
      ],
      providers: [
        {provide: ComponentFixtureAutoDetect, useValue: true},

        App,
        Form,
        Keyboard,
        DomController,
        MenuController,
        NavController,
        LoadingController,
        GestureController,
        AlertController,
        StatusBar,
        SplashScreen,
        {provide: ModalController, useClass: ModalMock},
        {provide: NavParams, useClass: NavMock},
        {provide: Platform, useClass: PlatformMock},
        {provide: Config, useClass: ConfigMock}
      ],
      imports: [
        FormsModule,
        IonicModule,
        ReactiveFormsModule,
        TranslateModule.forRoot()
      ]
    });
  }

  /**
   * Helper to compile and create a component using angulars` Testbed
   */
  public static createComponent(component: any): Promise<any> {
    return TestBed.compileComponents()
    .then(() => {
      let fixture: any = TestBed.createComponent(component);
      return {
        fixture:     fixture,
        instance:    fixture.debugElement.componentInstance,
        htmlElement: fixture.debugElement.nativeElement
      };
    });
  }
}
