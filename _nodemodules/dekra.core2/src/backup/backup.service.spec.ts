import {} from 'jasmine';
import {
  TestBed,
  async
} from '@angular/core/testing';
import { File } from '@ionic-native/file';

import { LOG_SERVICE_PROVIDER } from '../logger/logger';
import { EnvironmentService } from '../environment/environment.service';
import { BackupService } from './backup.service';


describe('BackupService', () => {
  let backupService: BackupService;
  let backupConfig = {
    MAIN_KEY: 'BACKUP_MAIN_KEY-', // e.g. "lbo-"
    BACKUP_FILE_NAME: 'dekra/logs/LBOBackup.txt',
    BACKUP_IMAGE_DIR: 'dekra/logs/LBOImages/'
  };
  let keyArray, dummyDataObject;
  let file: File;
  let environmentService: EnvironmentService;

  // tslint:disable-next-line
  let expectedDataFromStorageAsString = '[{"key":"BACKUP_MAIN_KEY-key1","value":{"foo":"bar"}},{"key":"BACKUP_MAIN_KEY-key2","value":{"foo":"bar"}},{"key":"BACKUP_MAIN_KEY-key3","value":{"foo":"bar"}}]';

  beforeEach( () => {
    TestBed.configureTestingModule({
      providers: [
        LOG_SERVICE_PROVIDER,
        BackupService,
        File,
        EnvironmentService
      ]
    });

    file = TestBed.get(File);
    backupService = TestBed.get(BackupService);
    environmentService = TestBed.get(EnvironmentService);

    keyArray = [
      'ignored-key',
      backupConfig.MAIN_KEY + 'key1',
      backupConfig.MAIN_KEY + 'key2',
      backupConfig.MAIN_KEY + 'key3'
    ];
    spyOn(backupService['storage'], 'keys')
    .and.returnValue(Promise.resolve(keyArray));

    spyOn(backupService['storage'], 'ready').and.returnValue(Promise.resolve());
    dummyDataObject = {foo: 'bar'};
    spyOn(backupService['storage'], 'get')
    .and.returnValue(Promise.resolve(dummyDataObject));
    spyOn(backupService['storage'], 'set')
    .and.returnValue(Promise.resolve());

    spyOn(file, 'writeFile').and.returnValue(Promise.resolve());
    spyOn(file, 'readAsText').and.returnValue(Promise.resolve(expectedDataFromStorageAsString));

    spyOn(file, 'checkDir').and.returnValue(Promise.resolve(true));
    spyOn(file, 'removeRecursively').and.returnValue(Promise.resolve());
    spyOn(file, 'copyDir').and.returnValue(Promise.resolve());

    spyOn(environmentService, 'getFilesystemRoot').and.returnValue('file-system-root');

    // mock cordova
    window['cordova'] = {
      file: { externalRootDirectory: 'externalRootDirectory' }
    };
  });

  afterEach(() => {
    delete window['cordova'];
  });

  describe('#init', () => {

    it('should set correct configs', () => {
      backupService.init(backupConfig);
      expect(backupService['configuration']).toBe(backupConfig);
      expect(backupService['storage'].ready).toHaveBeenCalled
      ();
    });
  });

  describe('#createBackup', () => {

    beforeEach(async(() => {
      backupService.init(backupConfig)
      .then(() => {
        backupService.createBackup();
      });
    }));

    it('should read all data found in device storage and write it to a text file', () => {
      expect(file.writeFile).toHaveBeenCalledWith(
        window['cordova'].file.externalRootDirectory,
        backupConfig.BACKUP_FILE_NAME,
        expectedDataFromStorageAsString,
        {replace: true}
      );
    });

    it('should backup all images on the device', () => {
      expect(file.checkDir).toHaveBeenCalledWith(
        window['cordova'].file.externalRootDirectory,
        backupConfig.BACKUP_IMAGE_DIR
      );

      expect(file.removeRecursively).toHaveBeenCalledWith(
        window['cordova'].file.externalRootDirectory,
        backupConfig.BACKUP_IMAGE_DIR
      );
      expect(file.copyDir).toHaveBeenCalledWith(
        'file-system-root',
        '',
        window['cordova'].file.externalRootDirectory,
        backupConfig.BACKUP_IMAGE_DIR
      );
    });
  });

  describe('#loadBackup', () => {

    beforeEach(async(() => {
      backupService.init(backupConfig)
      .then(() => {
        backupService.loadBackup();
      });
    }));

    it('should read the json data from the text file and store it to the device storage ', () => {
      expect(file.readAsText).toHaveBeenCalledWith(
        window['cordova'].file.externalRootDirectory,
        backupConfig.BACKUP_FILE_NAME
      );

      expect(backupService['storage'].set).toHaveBeenCalledTimes(3);

      let setArgs;
      setArgs = backupService['storage'].set['calls'].argsFor(0);
      expect(setArgs).toEqual(['BACKUP_MAIN_KEY-key1', {foo: 'bar'}]);

      setArgs = backupService['storage'].set['calls'].argsFor(1);
      expect(setArgs).toEqual(['BACKUP_MAIN_KEY-key2', {foo: 'bar'}]);

      setArgs = backupService['storage'].set['calls'].argsFor(2);
      expect(setArgs).toEqual(['BACKUP_MAIN_KEY-key3', {foo: 'bar'}]);
    });
  });
});
