import { Injectable } from '@angular/core';

import { Storage } from '@ionic/storage';
import { File } from '@ionic-native/file';

const STORAGE = new Storage({
  name: 'myApp', // MUST BE "myApp"!
  storeName: 'keyvaluepairs',
  driverOrder: ['sqlite', 'indexeddb', 'websql', 'localstorage']
});

import { EnvironmentService } from '../environment/environment.service';
import { LogService } from '../logger/logger';

export interface IElement {
  key: string;
  value: any;
};

export interface IBackupConfiguration {
  MAIN_KEY: string;
  BACKUP_FILE_NAME: string;
  BACKUP_IMAGE_DIR: string;
}

declare let cordova: any;

/**
 * The backup service is needed to make backups of all data
 * stored in the device storage
 *
 * This data may then saved to a file, which makes it possible
 * to read that file later and put all data back to the device storage
 */
@Injectable()
export class BackupService {
  private configuration: IBackupConfiguration;
  private storage: Storage;

  constructor(
    private logger: LogService,
    private environmentService: EnvironmentService,
    private file: File
  ) {
    this.logger = this.logger.getInstance('BackupService');

    this.storage = STORAGE;
  }

  init(configuration: IBackupConfiguration) {
    this.logger.log('BackupService init called with ', configuration);

    this.configuration = configuration;

    return this.storage.ready();
  }

  /**
   * Creates a backup of all data in storage and saves it to a text file
   */
  createBackup(): Promise<any> {
    if (!window['cordova']) {
      this.logger.warn('Cannot create a backup without window.cordova');
      return Promise.resolve();
    }

    return this.readDataFromStorage()
    .then((dataFromStorage: string) => {
      return this.file.writeFile(
        cordova.file.externalRootDirectory,
        this.configuration.BACKUP_FILE_NAME,
        dataFromStorage,
        {replace: true}
      );
    })

    // Finally backup all images too:
    // We need to remove the dest dir before copy,
    // else it will fail:
    //   https://ionicframework.com/docs/native/file/
    .then(() => {
      return this.file.checkDir(
        cordova.file.externalRootDirectory,
        this.configuration.BACKUP_IMAGE_DIR
      );
    })
    .then((directoryExists: boolean) => {
      if (!directoryExists) {
        return Promise.resolve({});
      }
      return this.file.removeRecursively(
        cordova.file.externalRootDirectory,
        this.configuration.BACKUP_IMAGE_DIR
      );
    })
    .then(() => {
      return this.file.copyDir(
        this.environmentService.getFilesystemRoot(),
        '',
        cordova.file.externalRootDirectory,
        this.configuration.BACKUP_IMAGE_DIR
      );
    });
  }

  /**
   * Loads a backup from a text file in the filesystem and fills the
   * device storage from it
   */
  loadBackup(): Promise<any> {
    if (!window['cordova']) {
      this.logger.warn('Cannot load a backup without window.cordova');
      return Promise.resolve();
    }

    return this.file.readAsText(
      cordova.file.externalRootDirectory,
      this.configuration.BACKUP_FILE_NAME
    )
    .then((jsonDataFromFile: string) => {
      return this.writeDataToStorage(jsonDataFromFile);
    });
  }


  private readDataFromStorage(): Promise<any> {
    return this.getKeys()
    .then((keys) => {
      return this.getItems(this.filterKeys(keys));
    });
  }

  private writeDataToStorage(dataFromFile: string): Promise<any> {
    let parsedDataFromFile = JSON.parse(dataFromFile);
    let promiseArray = [];

    if (!Array.isArray(parsedDataFromFile)) {
      throw new Error('Data from file is not an array!');
    }

    parsedDataFromFile.forEach((element: IElement) => {
      let promise = this.storage.set(element.key, element.value);
      promiseArray.push(promise);
    });

    return Promise.all(promiseArray);
  }

  private getKeys(): Promise<any> {
    return this.storage.keys();
  }

  private filterKeys(keys) {
    keys = keys.filter((key) => {
      return (key.toString().indexOf(this.configuration.MAIN_KEY) > -1);
    });
    return keys;
  }

  private getItems(keysArray): Promise<any> {
    let promiseArray = [];
    let backupData = [];
    keysArray.forEach((key) => {
      let getPromise = this.storage.get(key)
      .then((value) => {
        backupData.push(<IElement>{
          key: key,
          value: value
        });
      });
      promiseArray.push(getPromise);
    });

    return Promise.all(promiseArray)
    .then(() => {
      // the backupData
      return JSON.stringify(backupData);
    });
  }
}
