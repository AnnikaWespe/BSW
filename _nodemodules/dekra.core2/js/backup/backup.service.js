"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var storage_1 = require("@ionic/storage");
var file_1 = require("@ionic-native/file");
var STORAGE = new storage_1.Storage({
    name: 'myApp',
    storeName: 'keyvaluepairs',
    driverOrder: ['sqlite', 'indexeddb', 'websql', 'localstorage']
});
var environment_service_1 = require("../environment/environment.service");
var logger_1 = require("../logger/logger");
;
/**
 * The backup service is needed to make backups of all data
 * stored in the device storage
 *
 * This data may then saved to a file, which makes it possible
 * to read that file later and put all data back to the device storage
 */
var BackupService = (function () {
    function BackupService(logger, environmentService, file) {
        this.logger = logger;
        this.environmentService = environmentService;
        this.file = file;
        this.logger = this.logger.getInstance('BackupService');
        this.storage = STORAGE;
    }
    BackupService.prototype.init = function (configuration) {
        this.logger.log('BackupService init called with ', configuration);
        this.configuration = configuration;
        return this.storage.ready();
    };
    /**
     * Creates a backup of all data in storage and saves it to a text file
     */
    BackupService.prototype.createBackup = function () {
        var _this = this;
        if (!window['cordova']) {
            this.logger.warn('Cannot create a backup without window.cordova');
            return Promise.resolve();
        }
        return this.readDataFromStorage()
            .then(function (dataFromStorage) {
            return _this.file.writeFile(cordova.file.externalRootDirectory, _this.configuration.BACKUP_FILE_NAME, dataFromStorage, { replace: true });
        })
            .then(function () {
            return _this.file.checkDir(cordova.file.externalRootDirectory, _this.configuration.BACKUP_IMAGE_DIR);
        })
            .then(function (directoryExists) {
            if (!directoryExists) {
                return Promise.resolve({});
            }
            return _this.file.removeRecursively(cordova.file.externalRootDirectory, _this.configuration.BACKUP_IMAGE_DIR);
        })
            .then(function () {
            return _this.file.copyDir(_this.environmentService.getFilesystemRoot(), '', cordova.file.externalRootDirectory, _this.configuration.BACKUP_IMAGE_DIR);
        });
    };
    /**
     * Loads a backup from a text file in the filesystem and fills the
     * device storage from it
     */
    BackupService.prototype.loadBackup = function () {
        var _this = this;
        if (!window['cordova']) {
            this.logger.warn('Cannot load a backup without window.cordova');
            return Promise.resolve();
        }
        return this.file.readAsText(cordova.file.externalRootDirectory, this.configuration.BACKUP_FILE_NAME)
            .then(function (jsonDataFromFile) {
            return _this.writeDataToStorage(jsonDataFromFile);
        });
    };
    BackupService.prototype.readDataFromStorage = function () {
        var _this = this;
        return this.getKeys()
            .then(function (keys) {
            return _this.getItems(_this.filterKeys(keys));
        });
    };
    BackupService.prototype.writeDataToStorage = function (dataFromFile) {
        var _this = this;
        var parsedDataFromFile = JSON.parse(dataFromFile);
        var promiseArray = [];
        if (!Array.isArray(parsedDataFromFile)) {
            throw new Error('Data from file is not an array!');
        }
        parsedDataFromFile.forEach(function (element) {
            var promise = _this.storage.set(element.key, element.value);
            promiseArray.push(promise);
        });
        return Promise.all(promiseArray);
    };
    BackupService.prototype.getKeys = function () {
        return this.storage.keys();
    };
    BackupService.prototype.filterKeys = function (keys) {
        var _this = this;
        keys = keys.filter(function (key) {
            return (key.toString().indexOf(_this.configuration.MAIN_KEY) > -1);
        });
        return keys;
    };
    BackupService.prototype.getItems = function (keysArray) {
        var _this = this;
        var promiseArray = [];
        var backupData = [];
        keysArray.forEach(function (key) {
            var getPromise = _this.storage.get(key)
                .then(function (value) {
                backupData.push({
                    key: key,
                    value: value
                });
            });
            promiseArray.push(getPromise);
        });
        return Promise.all(promiseArray)
            .then(function () {
            // the backupData
            return JSON.stringify(backupData);
        });
    };
    return BackupService;
}());
BackupService.decorators = [
    { type: core_1.Injectable },
];
/** @nocollapse */
BackupService.ctorParameters = function () { return [
    { type: logger_1.LogService, },
    { type: environment_service_1.EnvironmentService, },
    { type: file_1.File, },
]; };
exports.BackupService = BackupService;
//# sourceMappingURL=backup.service.js.map