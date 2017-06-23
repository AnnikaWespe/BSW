"use strict";
// from https://github.com/lathonez/clicker/blob/master/src/mocks.ts
Object.defineProperty(exports, "__esModule", { value: true });
/* tslint:disable */
// IONIC:
var AlertMock = (function () {
    function AlertMock() {
    }
    AlertMock.prototype.create = function () {
        var rtn = {};
        rtn['present'] = (function () { return true; });
        return rtn;
    };
    // function actually on the AlertClass (not AlertController), but using these interchangably for now
    AlertMock.prototype.dismiss = function () {
        return new Promise(function (resolve) {
            resolve();
        });
    };
    return AlertMock;
}());
exports.AlertMock = AlertMock;
var ToastMock = (function () {
    function ToastMock() {
    }
    ToastMock.prototype.create = function () {
        var rtn = {};
        rtn['present'] = (function () { return true; });
        return rtn;
    };
    return ToastMock;
}());
exports.ToastMock = ToastMock;
var ConfigMock = (function () {
    function ConfigMock() {
    }
    ConfigMock.prototype.get = function () {
        return '';
    };
    ConfigMock.prototype.getBoolean = function () {
        return true;
    };
    ConfigMock.prototype.getNumber = function () {
        return 1;
    };
    ConfigMock.prototype.setTransition = function () {
        return;
    };
    return ConfigMock;
}());
exports.ConfigMock = ConfigMock;
var FormMock = (function () {
    function FormMock() {
    }
    FormMock.prototype.register = function () {
        return true;
    };
    return FormMock;
}());
exports.FormMock = FormMock;
var ModalMock = (function () {
    function ModalMock() {
    }
    ModalMock.prototype.create = function () { };
    return ModalMock;
}());
exports.ModalMock = ModalMock;
var NavMock = (function () {
    function NavMock() {
    }
    NavMock.prototype.pop = function () {
        return new Promise(function (resolve) {
            resolve();
        });
    };
    NavMock.prototype.push = function () {
        return new Promise(function (resolve) {
            resolve();
        });
    };
    NavMock.prototype.getActive = function () {
        return {
            'instance': {
                'model': 'something',
            },
        };
    };
    NavMock.prototype.setRoot = function () {
        return true;
    };
    NavMock.prototype.popToRoot = function () {
        return true;
    };
    NavMock.prototype.get = function () {
    };
    return NavMock;
}());
exports.NavMock = NavMock;
var PlatformMock = (function () {
    function PlatformMock() {
    }
    PlatformMock.prototype.ready = function () {
        return new Promise(function (resolve) {
            resolve('READY');
        });
    };
    PlatformMock.prototype.registerBackButtonAction = function () {
        return (function () { return true; });
    };
    PlatformMock.prototype.hasFocus = function () {
        return true;
    };
    PlatformMock.prototype.doc = function () {
        return document;
    };
    PlatformMock.prototype.is = function () {
        return true;
    };
    PlatformMock.prototype.getElementComputedStyle = function () {
        return {
            paddingLeft: '10',
            paddingTop: '10',
            paddingRight: '10',
            paddingBottom: '10',
        };
    };
    PlatformMock.prototype.onResize = function (callback) {
        return callback;
    };
    PlatformMock.prototype.registerListener = function () {
        return (function () { return true; });
    };
    PlatformMock.prototype.win = function () {
        return window;
    };
    PlatformMock.prototype.raf = function () {
        return 1;
    };
    PlatformMock.prototype.timeout = function (callback, timer) {
        return setTimeout(callback, timer);
    };
    PlatformMock.prototype.cancelTimeout = function () {
        // do nothing
    };
    PlatformMock.prototype.getActiveElement = function () {
        return document['activeElement'];
    };
    return PlatformMock;
}());
exports.PlatformMock = PlatformMock;
var StorageMock = (function () {
    function StorageMock() {
    }
    StorageMock.prototype.get = function () {
        return new Promise(function (resolve) {
            resolve({});
        });
    };
    StorageMock.prototype.set = function (key, value) {
        return new Promise(function (resolve) {
            resolve({ key: key, value: value });
        });
    };
    StorageMock.prototype.remove = function (key) {
        return new Promise(function (resolve) {
            resolve({ key: key });
        });
    };
    StorageMock.prototype.query = function () {
        return new Promise(function (resolve) {
            resolve({
                res: {
                    rows: [{}]
                }
            });
        });
    };
    return StorageMock;
}());
exports.StorageMock = StorageMock;
var MenuMock = (function () {
    function MenuMock() {
    }
    MenuMock.prototype.close = function () {
        return new Promise(function (resolve) {
            resolve();
        });
    };
    return MenuMock;
}());
exports.MenuMock = MenuMock;
var AppMock = (function () {
    function AppMock() {
    }
    AppMock.prototype.getActiveNav = function () {
        return new NavMock();
    };
    return AppMock;
}());
exports.AppMock = AppMock;
/* tslint:enable */
//# sourceMappingURL=mocks.js.map