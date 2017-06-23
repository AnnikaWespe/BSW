import {} from 'jasmine';
import {
  TestBed
} from '@angular/core/testing';

import { DekraHttp } from '../http/http';
import { EnvironmentService } from './environment.service';
import { File } from '@ionic-native/file';

import { LOG_SERVICE_PROVIDER } from '../logger/logger';

describe('Environment service', () => {
  let environmentService: EnvironmentService;
  let file: File;

  beforeEach( () => {
    TestBed.configureTestingModule({
      providers: [
        LOG_SERVICE_PROVIDER,
        File,
        EnvironmentService
      ]
    });

    spyOn(DekraHttp, 'addGlobalRequestHeader');

    environmentService = TestBed.get(EnvironmentService);
    file = TestBed.get(File);
  });

  describe('#init', () => {

    it('should set the imei to "browser"', () => {
      environmentService.init();
      expect(environmentService.imei).toBe('browser');
    });

    it('should set a global request header with the imei for all further requests', () => {
      environmentService.init();
      expect(DekraHttp.addGlobalRequestHeader).toHaveBeenCalledWith({name: 'X-DEKRA-DeviceId', value: 'browser'});
    });

    it('should just fire the "dekraEnvironmentChanged" event given cordova is not defined', (done) => {
      environmentService.isApp = false;
      environmentService.dekraEnvironmentChanged$.subscribe((envService) => {
        expect(environmentService).toEqual(envService);
        done();
      });
      environmentService.init();
    });

    describe('given cordova is defined', () => {

      beforeEach(() => {
        environmentService.isApp = true;
        window['cordova'] = {
          file: {dataDirectory: 'the-data-directory'},
          plugins: {
            uid: {
              IMEI: 'The-IMEI'
            }
          }
        };
        environmentService.init();
      });

      it('should set the imei from the cordova uid plugin', () => {
        expect(environmentService.imei).toBe('The-IMEI');
      });

      it('should set a global request header with the device id for all further requests', () => {
        expect(DekraHttp.addGlobalRequestHeader).toHaveBeenCalledWith({name: 'X-DEKRA-DeviceId', value: 'The-IMEI'});
      });

      it('should set file system root from cordova', () => {
        expect(environmentService.filesystemRoot).toBe(window['cordova'].file.dataDirectory);
      });
    });

    describe('given cordova is defined, platform is "android" and the file "mode.xyz" exists on the filesystem', () => {

      beforeEach((done) => {
        environmentService.isApp = true;
        window['cordova'] = {
          platformId: 'android',
          file: {
            dataDirectory: 'the-data-directory',
            externalDataDirectory: 'externalDataDirectory'
          },
          plugins: {
            uid: {
              IMEI: 'The-IMEI'
            }
          }
        };

        let fileContent = 'SOME=19550128  ';
        spyOn(file, 'readAsText').and.returnValue(Promise.resolve(fileContent));
        environmentService.init();
        setTimeout(done);
      });

      it('should set dekra environment from the file', () => {
        expect(environmentService.dekraEnvironment).toBe('PRODUKTION');
      });

      it('should file system root from cordova', () => {
        expect(environmentService.filesystemRoot).toBe('externalDataDirectory');
      });
    });

    describe('given cordova is defined, platform is "android" and the file ' +
    '"mode.xyz" does not exist on the filesystem', () => {

      beforeEach((done) => {
        environmentService.isApp = true;
        window['cordova'] = {
          platformId: 'android',
          file: {dataDirectory: 'the-data-directory'},
          plugins: {
            uid: {
              IMEI: 'The-IMEI'
            }
          }
        };
        spyOn(file, 'readAsText').and.returnValue(Promise.resolve(null));
        environmentService.init();
        setTimeout(done);
      });

      it('should set default environment', () => {
        expect(environmentService.dekraEnvironment).toBe(environmentService.__DEFAULT_ENV__);
      });
    });

    describe('given cordova is defined and platform is "ios"', () => {

      beforeEach((done) => {
        environmentService.isApp = true;
        window['cordova'] = {
          platformId: 'ios',
          file: {dataDirectory: 'the-data-directory'},
          plugins: {
            uid: {
              IMEI: 'The-IMEI'
            }
          }
        };
        spyOn(file, 'readAsText').and.returnValue(Promise.resolve(null));
        environmentService.init();
        setTimeout(done);
      });

      it('should set default environment', () => {
        expect(environmentService.dekraEnvironment).toBe(environmentService.__DEFAULT_ENV__);
      });
    });

    describe('given cordova is defined and platform is not supported', () => {

      beforeEach((done) => {
        environmentService.isApp = true;
        window['cordova'] = {
          platformId: 'ios',
          file: {dataDirectory: 'the-data-directory'},
          plugins: {
            uid: {
              IMEI: 'The-IMEI'
            }
          }
        };
        spyOn(file, 'readAsText').and.returnValue(Promise.resolve(null));
        environmentService.init();
        setTimeout(done);
      });

      it('should set default environment', () => {
        expect(environmentService.dekraEnvironment).toBe(environmentService.__DEFAULT_ENV__);
      });
    });
  });

  describe('#getPlatform', () => {

    afterEach(() => {
      window['cordova'] = null;
    });

    it('should return the cordova platform id given cordova is defined', () => {
      environmentService.isApp = true;
      window['cordova'] = {platformId: 'android'};
      expect(environmentService.getPlatform()).toBe('android');
    });

    it('should return "browser" otherwise', () => {
      expect(environmentService.getPlatform()).toBe('browser');
    });
  });

  describe('#getFilesystemRoot', () => {

    it('should return filesystemRoot', () => {
      environmentService['filesystemRoot'] = 'foo';
      expect(environmentService.getFilesystemRoot())
      .toBe('foo');
    });
  });

  describe('#isConnected', () => {

    it('should return true given we are online and cordova network state is not "NONE"', () => {

      navigator['connection'] = {
        type: 'ONLINE'
      };
      window['Connection'] = {};

      environmentService.isApp = true;
      let isConnected = environmentService.isConnected();
      expect(isConnected).toBeTruthy();
    });
  });

  describe('#broadcastEvent', () => {

    it('should fire a dekraEnvironmentChanged$ event using an observable', () => {
      let spy = jasmine.createSpy('dekraEnvironmentChanged$ spy');
      environmentService.dekraEnvironmentChanged$.subscribe(spy);

      environmentService.broadcastEvent();

      expect(spy).toHaveBeenCalledWith(environmentService);
    });
  });
});
