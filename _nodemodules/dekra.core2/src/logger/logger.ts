import { Injectable } from '@angular/core';

import { Subject } from 'rxjs/Subject';

import { File } from '@ionic-native/file';

// Declare the console as an ambient value so that TypeScript doesn't complain.
declare var console: any;

/**
 * Class represents a log message with a formatted timestamp.
 */
export class LogObject {
  constructor(
    public originalMessage: any[],
    public logLevel = 1,
    public instanceName = '',
    public timestamp: Date = new Date(),
    public groupLevel = 0,
  ) {}

  get fullMessage(): any[] {
    let messagePrefix = '';
    let result = [];

    let month = this.timestamp.getMonth() + 1;
    let timestamp = this.timestamp.getFullYear() + '-' + ('0' + month).slice(-2) + '-'
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
  }
}

export class LogLevels {
  private static map = [
    {level: 1,  name: 'log'},
    {level: 2,  name: 'info'},
    {level: 3,  name: 'warn'},
    {level: 4,  name: 'error'},
    {level: 99, name: 'silent'}
  ];

  public static getLevel(logLevelName: string): number {
    return this.map.find((item) => item.name === logLevelName).level;
  }

  public static getName(logLevel: number): string {
    return this.map.find((item) => item.level === logLevel).name;
  }

  public static getConsoleMethod(logLevel: number): string {
    let itemLevel = this.map.find((item) => item.level === logLevel);
    return itemLevel['consoleMethod'] || itemLevel.name;
  }
}

/**
 * Class logs to the dev tools console
 */
export class ConsoleLogger {

  public log(logObject: LogObject) {
    let logLevelName = LogLevels.getConsoleMethod(logObject.logLevel);
    console[logLevelName](...logObject.fullMessage);
  }
}

/**
 * Class logs to the filesystem
 */
@Injectable()
export class FileLogger {
  logFileSystemRoot: string;
  logFileName: string;

  constructor(
    private file: File
  ) {}

  public setPaths(logFileSystemRoot: string, logFileName: string) {
    this.logFileSystemRoot = logFileSystemRoot;
    this.logFileName = logFileName;
  }

  public log(logObject: LogObject) {
    this.writeToFile(logObject.fullMessage);
  }

  private writeToFile(logMessageArray: any[]) {
    let cordova = window['cordova'];

    // TODO: browser platform?
    if (!cordova || cordova.platformId === 'browser') {
      return false;
    }

    logMessageArray = logMessageArray.map((value) => {
      // we want to support objects to in the resulting text file,
      // so "stringify" it!
      if (typeof value === 'object') {
        try {
          return JSON.stringify(value);
        }
        catch (e) {
          return value;
        };
      }
      return value;
    });

    let text = logMessageArray.join(' ') + '\n';

    // we need to check the file first...
    this.file.checkFile(this.logFileSystemRoot, this.logFileName)
    .then((fileExists: boolean) => {
      if (fileExists) {
        return this.file.writeExistingFile(
          this.logFileSystemRoot,
          this.logFileName,
          text
        );
      }
      else {
        return this.file.writeFile(
          this.logFileSystemRoot,
          this.logFileName,
          text
        );
      }
    })
    .catch((error) => {
      if (error.message === 'NOT_FOUND_ERR') {
        return this.file.writeFile(
          this.logFileSystemRoot,
          this.logFileName,
          text
        );
      }
    });
  }
}

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
export class LogService {

  private groupLevel = 0;
  private logLevelConfig: any;

  constructor(
    public log$?: Subject<LogObject>,
    private instanceName?: string,
    logLevel?: any
  ) {
    this.log$ = this.log$ || new Subject();
    this.setLogLevel(logLevel);
   }

  public setLogLevel(logLevel: any) {
    if (!this.logLevelConfig) {
      this.logLevelConfig = {level: 1};
    }

    if (logLevel) {
      if (logLevel.level) {
        this.logLevelConfig = logLevel;
      }
      else if (typeof logLevel === 'string') {
        let level = LogLevels.getLevel(logLevel);
        this.logLevelConfig.level = level;
        this.logLevelConfig.name = logLevel;
      }
      else if (typeof logLevel === 'number') {
        this.logLevelConfig.level = logLevel;
        this.logLevelConfig.name = LogLevels.getName(logLevel);
      }
    }
  }

  public getInstance(instanceName: string): LogService {
    let logger =  new LogService(this.log$, instanceName, this.logLevelConfig);
    return logger;
  }

  public logMessage(message: any, logLevel: number) {
    if (logLevel >= this.logLevelConfig.level) {
      this.log$.next(this.getLogObject(message, logLevel));
    }
  }

  public log(...args: any[]): void {
    this.logMessage(args, 1);
  }

  public debug(...args: any[]): void {
    this.log(...args);
  }

  public info(...args: any[]): void {
    this.logMessage(args, 2);
  }

  public warn(...args: any[]): void {
    this.logMessage(args, 3);
  }

  public error(...args: any[]): void {
    this.logMessage(args, 4);
  }

  public assert(...args: any[]): void {
    this.log(...args);
  }

  public group(/*...args: any[]*/): void {
    this.groupLevel++;
  }

  public groupEnd(/*...args: any[]*/): void {
    this.groupLevel--;
  }

  private getLogObject(message: any, logLevel: number) {
    if (!Array.isArray(message)) {
      message = [message];
    }

    return new LogObject(
      message,
      logLevel,
      this.instanceName,
      new Date(),
      this.groupLevel,
    );
  }
}

export const LOG_SERVICE_PROVIDER = {
  provide: LogService,
  useFactory: () => { return new LogService(); }
};
