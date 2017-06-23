import { Subject } from 'rxjs/Subject';
import { File } from '@ionic-native/file';
import { LogService } from '../logger/logger';
/**
 * Service for getting basic information about the current environment
 */
export declare class EnvironmentService {
    private logger;
    private file;
    dekraEnvironmentChanged$: Subject<{}>;
    private modeNames;
    __DEFAULT_ENV__: string;
    androidEnvFilePath: string;
    filesystemRoot: string;
    dekraEnvironment: string;
    /**
     * Returns the IMEI of the device if available
     * @method
     * @memberof dekra.core.environmentService
     * @returns {string}
     */
    imei: string;
    /**
     * Checks if the device is running in a app environment
     (Means "window.cordova" is defined)
     */
    isApp: boolean;
    /**
     * Checks if the device is running under windows operating system
     *
     * TODO consider removing this because we do not have dekra.bootsrap
     */
    isWindows: any;
    /**
     * Checks if the device has a camera
     */
    hasCamera: any;
    /**
     * Checks if the device has a barcode scanner
     */
    hasBarCodeScanner: boolean;
    /**
     * Checks if the device is dekra internal one
     */
    isDekraDevice: boolean;
    constructor(logger: LogService, file: File);
    /**
     * Init the environment service
     */
    init(): void;
    /**
     * Get platform we are running on or 'browser' if not on mobile device
     */
    getPlatform(): string;
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
    getFilesystemRoot(): string;
    /**
     * Check if a network connection is available
     */
    isConnected(): boolean;
    /**
     * Broadcast the dekraEnvironmentChanged$ event
     */
    broadcastEvent(): void;
}
