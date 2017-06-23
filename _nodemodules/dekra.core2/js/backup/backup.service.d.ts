/// <reference types="localforage" />
import { File } from '@ionic-native/file';
import { EnvironmentService } from '../environment/environment.service';
import { LogService } from '../logger/logger';
export interface IElement {
    key: string;
    value: any;
}
export interface IBackupConfiguration {
    MAIN_KEY: string;
    BACKUP_FILE_NAME: string;
    BACKUP_IMAGE_DIR: string;
}
/**
 * The backup service is needed to make backups of all data
 * stored in the device storage
 *
 * This data may then saved to a file, which makes it possible
 * to read that file later and put all data back to the device storage
 */
export declare class BackupService {
    private logger;
    private environmentService;
    private file;
    private configuration;
    private storage;
    constructor(logger: LogService, environmentService: EnvironmentService, file: File);
    init(configuration: IBackupConfiguration): Promise<LocalForage>;
    /**
     * Creates a backup of all data in storage and saves it to a text file
     */
    createBackup(): Promise<any>;
    /**
     * Loads a backup from a text file in the filesystem and fills the
     * device storage from it
     */
    loadBackup(): Promise<any>;
    private readDataFromStorage();
    private writeDataToStorage(dataFromFile);
    private getKeys();
    private filterKeys(keys);
    private getItems(keysArray);
}
