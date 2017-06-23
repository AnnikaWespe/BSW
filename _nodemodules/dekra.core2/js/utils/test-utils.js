"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var testing_1 = require("@angular/core/testing");
var http_1 = require("@angular/http");
var forms_1 = require("@angular/forms");
var ionic_angular_1 = require("ionic-angular");
var status_bar_1 = require("@ionic-native/status-bar");
var splash_screen_1 = require("@ionic-native/splash-screen");
var ng2_translate_1 = require("ng2-translate/ng2-translate");
var mocks_1 = require("./mocks");
/**
 * Class provides some static helper functions to use in specs
 */
var TestUtils = (function () {
    function TestUtils() {
    }
    TestUtils.prepareSuccessfullHttpResponse = function (mockBackend, responseData, headerData, status) {
        if (responseData === void 0) { responseData = { success: true }; }
        if (headerData === void 0) { headerData = {}; }
        if (status === void 0) { status = 200; }
        var response = new http_1.Response(new http_1.ResponseOptions({
            status: status,
            body: JSON.stringify(responseData),
            headers: new http_1.Headers(headerData)
        }));
        mockBackend.connections.subscribe(function (connection) {
            connection.mockRespond(response);
        });
    };
    TestUtils.prepareErrorHttpResponse = function (mockBackend, response, status) {
        if (status === void 0) { status = 500; }
        if (!response) {
            response = new http_1.Response(new http_1.ResponseOptions({ status: status }));
        }
        else if (!(response instanceof http_1.Response)) {
            response = new http_1.Response(new http_1.ResponseOptions({
                status: status,
                body: JSON.stringify(response)
            }));
        }
        mockBackend.connections.subscribe(function (connection) {
            connection.mockError(response);
        });
    };
    /**
     * Helper uses Angulars` "Testbed.configureTestingModule(any)" in order to
     * configure an ionic component together with all needed ionic class mocks
     * and automatic change detection
     *
     * Please read:
     *   * https://angular.io/docs/ts/latest/guide/testing.html
     *   * http://lathonez.com/2017/ionic-2-unit-testing/
     */
    TestUtils.configureIonicTestingModule = function (components) {
        return testing_1.TestBed.configureTestingModule({
            declarations: components.slice(),
            providers: [
                { provide: testing_1.ComponentFixtureAutoDetect, useValue: true },
                ionic_angular_1.App,
                ionic_angular_1.Form,
                ionic_angular_1.Keyboard,
                ionic_angular_1.DomController,
                ionic_angular_1.MenuController,
                ionic_angular_1.NavController,
                ionic_angular_1.LoadingController,
                ionic_angular_1.GestureController,
                ionic_angular_1.AlertController,
                status_bar_1.StatusBar,
                splash_screen_1.SplashScreen,
                { provide: ionic_angular_1.ModalController, useClass: mocks_1.ModalMock },
                { provide: ionic_angular_1.NavParams, useClass: mocks_1.NavMock },
                { provide: ionic_angular_1.Platform, useClass: mocks_1.PlatformMock },
                { provide: ionic_angular_1.Config, useClass: mocks_1.ConfigMock }
            ],
            imports: [
                forms_1.FormsModule,
                ionic_angular_1.IonicModule,
                forms_1.ReactiveFormsModule,
                ng2_translate_1.TranslateModule.forRoot()
            ]
        });
    };
    /**
     * Helper to compile and create a component using angulars` Testbed
     */
    TestUtils.createComponent = function (component) {
        return testing_1.TestBed.compileComponents()
            .then(function () {
            var fixture = testing_1.TestBed.createComponent(component);
            return {
                fixture: fixture,
                instance: fixture.debugElement.componentInstance,
                htmlElement: fixture.debugElement.nativeElement
            };
        });
    };
    return TestUtils;
}());
exports.TestUtils = TestUtils;
//# sourceMappingURL=test-utils.js.map