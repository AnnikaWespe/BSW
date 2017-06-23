"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var Subject_1 = require("rxjs/Subject");
var file_1 = require("@ionic-native/file");
/**
 * Class represents a log message with a formatted timestamp.
 */
var LogObject = (function () {
    function LogObject(originalMessage, logLevel, instanceName, timestamp, groupLevel) {
        if (logLevel === void 0) { logLevel = 1; }
        if (instanceName === void 0) { instanceName = ''; }
        if (timestamp === void 0) { timestamp = new Date(); }
        if (groupLevel === void 0) { groupLevel = 0; }
        this.originalMessage = originalMessage;
        this.logLevel = logLevel;
        this.instanceName = instanceName;
        this.timestamp = timestamp;
        this.groupLevel = groupLevel;
    }
    Object.defineProperty(LogObject.prototype, "fullMessage", {
        get: function () {
            var messagePrefix = '';
            var result = [];
            var month = this.timestamp.getMonth() + 1;
            var timestamp = this.timestamp.getFullYear() + '-' + ('0' + month).slice(-2) + '-'
                + ('0' + this.timestamp.getDate()).slice(-2) + ' '
                + ('0' + this.timestamp.getHours()).slice(-2) + ':' + ('0' + this.timestamp.getMinutes()).slice(-2) + ':'
                + ('0' + this.timestamp.getSeconds()).slice(-2);
            if (this.instanceName !== undefined && this.instanceName !== '') {
                messagePrefix = timestamp + ' # ' + this.instanceName + ' # ';
            }
            else {
                messagePrefix = timestamp + ' # ';
            }
            messagePrefix = messagePrefix + '  '.repeat(this.groupLevel);
            result.push(messagePrefix);
            result = result.concat(this.originalMessage);
            return result;
        },
        enumerable: true,
        configurable: true
    });
    return LogObject;
}());
exports.LogObject = LogObject;
var LogLevels = (function () {
    function LogLevels() {
    }
    LogLevels.getLevel = function (logLevelName) {
        return this.map.find(function (item) { return item.name === logLevelName; }).level;
    };
    LogLevels.getName = function (logLevel) {
        return this.map.find(function (item) { return item.level === logLevel; }).name;
    };
    LogLevels.getConsoleMethod = function (logLevel) {
        var itemLevel = this.map.find(function (item) { return item.level === logLevel; });
        return itemLevel['consoleMethod'] || itemLevel.name;
    };
    return LogLevels;
}());
LogLevels.map = [
    { level: 1, name: 'log' },
    { level: 2, name: 'info' },
    { level: 3, name: 'warn' },
    { level: 4, name: 'error' },
    { level: 99, name: 'silent' }
];
exports.LogLevels = LogLevels;
/**
 * Class logs to the dev tools console
 */
var ConsoleLogger = (function () {
    function ConsoleLogger() {
    }
    ConsoleLogger.prototype.log = function (logObject) {
        var logLevelName = LogLevels.getConsoleMethod(logObject.logLevel);
        console[logLevelName].apply(console, logObject.fullMessage);
    };
    return ConsoleLogger;
}());
exports.ConsoleLogger = ConsoleLogger;
/**
 * Class logs to the filesystem
 */
var FileLogger = (function () {
    function FileLogger(file) {
        this.file = file;
    }
    FileLogger.prototype.setPaths = function (logFileSystemRoot, logFileName) {
        this.logFileSystemRoot = logFileSystemRoot;
        this.logFileName = logFileName;
    };
    FileLogger.prototype.log = function (logObject) {
        this.writeToFile(logObject.fullMessage);
    };
    FileLogger.prototype.writeToFile = function (logMessageArray) {
        var _this = this;
        var cordova = window['cordova'];
        // TODO: browser platform?
        if (!cordova || cordova.platformId === 'browser') {
            return false;
        }
        logMessageArray = logMessageArray.map(function (value) {
            // we want to support objects to in the resulting text file,
            // so "stringify" it!
            if (typeof value === 'object') {
                try {
                    return JSON.stringify(value);
                }
                catch (e) {
                    return value;
                }
                ;
            }
            return value;
        });
        var text = logMessageArray.join(' ') + '\n';
        // we need to check the file first...
        this.file.checkFile(this.logFileSystemRoot, this.logFileName)
            .then(function (fileExists) {
            if (fileExists) {
                return _this.file.writeExistingFile(_this.logFileSystemRoot, _this.logFileName, text);
            }
            else {
                return _this.file.writeFile(_this.logFileSystemRoot, _this.logFileName, text);
            }
        })
            .catch(function (error) {
            if (error.message === 'NOT_FOUND_ERR') {
                return _this.file.writeFile(_this.logFileSystemRoot, _this.logFileName, text);
            }
        });
    };
    return FileLogger;
}());
FileLogger.decorators = [
    { type: core_1.Injectable },
];
/** @nocollapse */
FileLogger.ctorParameters = function () { return [
    { type: file_1.File, },
]; };
exports.FileLogger = FileLogger;
/**
 * Class uses an observable in order to support multiple log types
 *
 * Maybe used like this:
 *
 * let logger = new LogService();
 * let consoleLogger = new ConsoleLogger();
 *
 * let fileLogger = new FileLogger(
 *   file: File,
 *   logFileSystemRoot,
 *   logFileName
 * );
 *
 * logger.log$.subscribe((message) => {
 *   consoleLogger.log(message);
 *   fileLogger.log(message);
 * });
 */
var LogService = (function () {
    function LogService(log$, instanceName, logLevel) {
        this.log$ = log$;
        this.instanceName = instanceName;
        this.groupLevel = 0;
        this.log$ = this.log$ || new Subject_1.Subject();
        this.setLogLevel(logLevel);
    }
    LogService.prototype.setLogLevel = function (logLevel) {
        if (!this.logLevelConfig) {
            this.logLevelConfig = { level: 1 };
        }
        if (logLevel) {
            if (logLevel.level) {
                this.logLevelConfig = logLevel;
            }
            else if (typeof logLevel === 'string') {
                var level = LogLevels.getLevel(logLevel);
                this.logLevelConfig.level = level;
                this.logLevelConfig.name = logLevel;
            }
            else if (typeof logLevel === 'number') {
                this.logLevelConfig.level = logLevel;
                this.logLevelConfig.name = LogLevels.getName(logLevel);
            }
        }
    };
    LogService.prototype.getInstance = function (instanceName) {
        var logger = new LogService(this.log$, instanceName, this.logLevelConfig);
        return logger;
    };
    LogService.prototype.logMessage = function (message, logLevel) {
        if (logLevel >= this.logLevelConfig.level) {
            this.log$.next(this.getLogObject(message, logLevel));
        }
    };
    LogService.prototype.log = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        this.logMessage(args, 1);
    };
    LogService.prototype.debug = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        this.log.apply(this, args);
    };
    LogService.prototype.info = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        this.logMessage(args, 2);
    };
    LogService.prototype.warn = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        this.logMessage(args, 3);
    };
    LogService.prototype.error = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        this.logMessage(args, 4);
    };
    LogService.prototype.assert = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        this.log.apply(this, args);
    };
    LogService.prototype.group = function () {
        this.groupLevel++;
    };
    LogService.prototype.groupEnd = function () {
        this.groupLevel--;
    };
    LogService.prototype.getLogObject = function (message, logLevel) {
        if (!Array.isArray(message)) {
            message = [message];
        }
        return new LogObject(message, logLevel, this.instanceName, new Date(), this.groupLevel);
    };
    return LogService;
}());
exports.LogService = LogService;
exports.LOG_SERVICE_PROVIDER = {
    provide: LogService,
    useFactory: function () { return new LogService(); }
};
//# sourceMappingURL=logger.js.map