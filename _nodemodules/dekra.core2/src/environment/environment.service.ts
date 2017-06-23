import { Injectable } from '@angular/core';

import { Subject } from 'rxjs/Subject';

import { File } from '@ionic-native/file';

import { DekraHttp } from '../http/http';
import { LogService } from '../logger/logger';

// make Connection (from cordova-network-info plugin) global variable know to tsc
declare var Connection: any;

/**
 * Service for getting basic information about the current environment
 */
@Injectable()
export class EnvironmentService {

  public dekraEnvironmentChanged$ = new Subject();

  // DEKRA germany specific mappings and paths:
  // mapping from names to mode numbers
  // private _modeNumbers = {
  //   ITU: '19850219',
  //   PRODUKTION: '19550128',
  //   SYSTEMTEST: '201405'
  // };

  // // mapping from numbers to mode names
  private modeNames = {
    '19850219': 'ITU',
    '19550128': 'PRODUKTION',
    '201405': 'SYSTEMTEST'
  };

  public __DEFAULT_ENV__ = 'ITU';

  // public
  public androidEnvFilePath = 'dekra/ident/mode.xyz';

  // set in run()
  public filesystemRoot = '';

  public dekraEnvironment = this.__DEFAULT_ENV__;

  /**
   * Returns the IMEI of the device if available
   * @method
   * @memberof dekra.core.environmentService
   * @returns {string}
   */
  public imei = '';

  /**
   * Checks if the device is running in a app environment
   (Means "window.cordova" is defined)
   */
  public isApp = !!window['cordova'];

  /**
   * Checks if the device is running under windows operating system
   *
   * TODO consider removing this because we do not have dekra.bootsrap
   */
  public isWindows = window['_isWindows'];

  /**
   * Checks if the device has a camera
   */
  public hasCamera = window.navigator && window.navigator['camera'];

  /**
   * Checks if the device has a barcode scanner
   */
  public hasBarCodeScanner = true;

  /**
   * Checks if the device is dekra internal one
   */
  public isDekraDevice = false;

  constructor(
    private logger: LogService,
    private file: File
  ) {
    this.logger = logger.getInstance('EnvironmentService');
  }

  /**
   * Init the environment service
   */
  public init(): void {
    let cordova = window['cordova'];

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

    DekraHttp.addGlobalRequestHeader({name: 'X-DEKRA-DeviceId', value: this.imei});

    this.dekraEnvironment = this.__DEFAULT_ENV__;

    if (!this.isApp) {
      // just broadcast once to get all core dependent stuff up-to-date
      setTimeout(() => {
        this.logger.info('Broadcasting dekraEnvironmentChanged: ' + this.dekraEnvironment);
        this.broadcastEvent();
      }, 500);

      return;
    }

    // -- we are running as cordova app ---
    // read dekra files on device
    this.filesystemRoot = cordova.file.dataDirectory;
    let initPromise;
    let error;

    switch (this.getPlatform()) {
      case 'android':
        // read mode.xyz file if available
        initPromise = this.file.readAsText(
          cordova.file.externalRootDirectory,
          this.androidEnvFilePath
        )
        .then((fileContent) => {
          if (typeof fileContent !== 'string') {
            error = new Error('mode.xyz file not found');
            this.logger.error(error.message);
            return Promise.reject(error);
          }

          let environmentFromFile = fileContent['split']('=')[1].trim();
          for (let modeName in this.modeNames) {
            if (environmentFromFile.startsWith(modeName)) {
              this.dekraEnvironment = this.modeNames[modeName];
            }
          }
          this.logger.info('Got environment from mode.xyz: ' + this.dekraEnvironment);
          this.isDekraDevice = true;

          // externalDataDirectory may be null...
          if (cordova.file.externalDataDirectory !== null) {
            this.filesystemRoot = cordova.file.externalDataDirectory;
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
    .then(() => {
      this.broadcastEvent();
    })
    .catch(() => {
      this.logger.error('Environment change fallback to ' + this.__DEFAULT_ENV__);
      this.dekraEnvironment = this.__DEFAULT_ENV__;
      this.broadcastEvent();
    });
  }

  /**
   * Get platform we are running on or 'browser' if not on mobile device
   */
  public getPlatform(): string {
    if (this.isApp) {
      return window['cordova'].platformId;
    }
    else {
      return 'browser';
    }
  }

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
  public getFilesystemRoot(): string {
    return this.filesystemRoot;
  }

  /**
   * Check if a network connection is available
   */
  public isConnected(): boolean {
    let isConnected = navigator.onLine; // jshint ignore:line

    // needs cordova plugin: org.apache.cordova.network-information
    // cordova plugin add org.apache.cordova.network-information
    if (this.isApp) {
      let networkState = navigator['connection'].type;
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
  }

  /**
   * Broadcast the dekraEnvironmentChanged$ event
   */
  public broadcastEvent(): void {
    this.dekraEnvironmentChanged$.next(this);
  }
}
