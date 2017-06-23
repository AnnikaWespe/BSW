"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var Subject_1 = require("rxjs/Subject");
var file_1 = require("@ionic-native/file");
var http_1 = require("../http/http");
var logger_1 = require("../logger/logger");
/**
 * Service for getting basic information about the current environment
 */
var EnvironmentService = (function () {
    function EnvironmentService(logger, file) {
        this.logger = logger;
        this.file = file;
        this.dekraEnvironmentChanged$ = new Subject_1.Subject();
        // DEKRA germany specific mappings and paths:
        // mapping from names to mode numbers
        // private _modeNumbers = {
        //   ITU: '19850219',
        //   PRODUKTION: '19550128',
        //   SYSTEMTEST: '201405'
        // };
        // // mapping from numbers to mode names
        this.modeNames = {
            '19850219': 'ITU',
            '19550128': 'PRODUKTION',
            '201405': 'SYSTEMTEST'
        };
        this.__DEFAULT_ENV__ = 'ITU';
        // public
        this.androidEnvFilePath = 'dekra/ident/mode.xyz';
        // set in run()
        this.filesystemRoot = '';
        this.dekraEnvironment = this.__DEFAULT_ENV__;
        /**
         * Returns the IMEI of the device if available
         * @method
         * @memberof dekra.core.environmentService
         * @returns {string}
         */
        this.imei = '';
        /**
         * Checks if the device is running in a app environment
         (Means "window.cordova" is defined)
         */
        this.isApp = !!window['cordova'];
        /**
         * Checks if the device is running under windows operating system
         *
         * TODO consider removing this because we do not have dekra.bootsrap
         */
        this.isWindows = window['_isWindows'];
        /**
         * Checks if the device has a camera
         */
        this.hasCamera = window.navigator && window.navigator['camera'];
        /**
         * Checks if the device has a barcode scanner
         */
        this.hasBarCodeScanner = true;
        /**
         * Checks if the device is dekra internal one
         */
        this.isDekraDevice = false;
        this.logger = logger.getInstance('EnvironmentService');
    }
    /**
     * Init the environment service
     */
    EnvironmentService.prototype.init = function () {
        var _this = this;
        var cordova = window['cordova'];
        // get IMEI
        if (this.isApp) {
            if (cordova.plugins.uid && cordova.plugins.uid.IMEI) {
                this.imei = cordova.plugins.uid.IMEI;
            }
            else {
                this.imei = 'imei not available';
            }
        }
        else {
            this.imei = 'browser';
        }
        this.logger.debug('Got IMEI: ' + this.imei);
        http_1.DekraHttp.addGlobalRequestHeader({ name: 'X-DEKRA-DeviceId', value: this.imei });
        this.dekraEnvironment = this.__DEFAULT_ENV__;
        if (!this.isApp) {
            // just broadcast once to get all core dependent stuff up-to-date
            setTimeout(function () {
                _this.logger.info('Broadcasting dekraEnvironmentChanged: ' + _this.dekraEnvironment);
                _this.broadcastEvent();
            }, 500);
            return;
        }
        // -- we are running as cordova app ---
        // read dekra files on device
        this.filesystemRoot = cordova.file.dataDirectory;
        var initPromise;
        var error;
        switch (this.getPlatform()) {
            case 'android':
                // read mode.xyz file if available
                initPromise = this.file.readAsText(cordova.file.externalRootDirectory, this.androidEnvFilePath)
                    .then(function (fileContent) {
                    if (typeof fileContent !== 'string') {
                        error = new Error('mode.xyz file not found');
                        _this.logger.error(error.message);
                        return Promise.reject(error);
                    }
                    var environmentFromFile = fileContent['split']('=')[1].trim();
                    for (var modeName in _this.modeNames) {
                        if (environmentFromFile.startsWith(modeName)) {
                            _this.dekraEnvironment = _this.modeNames[modeName];
                        }
                    }
                    _this.logger.info('Got environment from mode.xyz: ' + _this.dekraEnvironment);
                    _this.isDekraDevice = true;
                    // externalDataDirectory may be null...
                    if (cordova.file.externalDataDirectory !== null) {
                        _this.filesystemRoot = cordova.file.externalDataDirectory;
                    }
                });
                break;
            case 'ios':
                initPromise = Promise.reject({});
                break;
            // TODO what about the browser platform?
            // case 'browser':
            //   break;
            default:
                initPromise = Promise.reject({});
                break;
        }
        // broadcast event after all promises are resolved
        initPromise
            .then(function () {
            _this.broadcastEvent();
        })
            .catch(function () {
            _this.logger.error('Environment change fallback to ' + _this.__DEFAULT_ENV__);
            _this.dekraEnvironment = _this.__DEFAULT_ENV__;
            _this.broadcastEvent();
        });
    };
    /**
     * Get platform we are running on or 'browser' if not on mobile device
     */
    EnvironmentService.prototype.getPlatform = function () {
        if (this.isApp) {
            return window['cordova'].platformId;
        }
        else {
            return 'browser';
        }
    };
    /**
     * Get filesystem root path for data storage
     *
     * This is one of the cordova.file.* constants and is determined as follows:
     *  Android:
     *    for DEKRA devices, this is cordova.file.externalDataDirectory if external
     *    storage is available; otherwise it is cordova.file.dataDirectory
     *
     *    for non-DEKRA devices, this is cordova.file.dataDirectory
     *
     *  iOS & Windows:
     *    this is cordova.file.dataDirectory
     */
    EnvironmentService.prototype.getFilesystemRoot = function () {
        return this.filesystemRoot;
    };
    /**
     * Check if a network connection is available
     */
    EnvironmentService.prototype.isConnected = function () {
        var isConnected = navigator.onLine; // jshint ignore:line
        // needs cordova plugin: org.apache.cordova.network-information
        // cordova plugin add org.apache.cordova.network-information
        if (this.isApp) {
            var networkState = navigator['connection'].type;
            /*
             let states = {};
             states[Connection.UNKNOWN]  = 'Unknown connection';
             states[Connection.ETHERNET] = 'Ethernet connection';
             states[Connection.WIFI]     = 'WiFi connection';
             states[Connection.CELL_2G]  = 'Cell 2G connection';
             states[Connection.CELL_3G]  = 'Cell 3G connection';
             states[Connection.CELL_4G]  = 'Cell 4G connection';
             states[Connection.CELL]     = 'Cell generic connection';
             states[Connection.NONE]     = 'No network connection';
             console.log('MIKE network state: ' +states[networkState]);
             */
            isConnected = networkState && (networkState !== Connection.NONE);
        }
        return isConnected;
    };
    /**
     * Broadcast the dekraEnvironmentChanged$ event
     */
    EnvironmentService.prototype.broadcastEvent = function () {
        this.dekraEnvironmentChanged$.next(this);
    };
    return EnvironmentService;
}());
EnvironmentService.decorators = [
    { type: core_1.Injectable },
];
/** @nocollapse */
EnvironmentService.ctorParameters = function () { return [
    { type: logger_1.LogService, },
    { type: file_1.File, },
]; };
exports.EnvironmentService = EnvironmentService;
//# sourceMappingURL=environment.service.js.map