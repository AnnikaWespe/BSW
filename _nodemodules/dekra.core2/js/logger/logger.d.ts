import { Subject } from 'rxjs/Subject';
import { File } from '@ionic-native/file';
/**
 * Class represents a log message with a formatted timestamp.
 */
export declare class LogObject {
    originalMessage: any[];
    logLevel: number;
    instanceName: string;
    timestamp: Date;
    groupLevel: number;
    constructor(originalMessage: any[], logLevel?: number, instanceName?: string, timestamp?: Date, groupLevel?: number);
    readonly fullMessage: any[];
}
export declare class LogLevels {
    private static map;
    static getLevel(logLevelName: string): number;
    static getName(logLevel: number): string;
    static getConsoleMethod(logLevel: number): string;
}
/**
 * Class logs to the dev tools console
 */
export declare class ConsoleLogger {
    log(logObject: LogObject): void;
}
/**
 * Class logs to the filesystem
 */
export declare class FileLogger {
    private file;
    logFileSystemRoot: string;
    logFileName: string;
    constructor(file: File);
    setPaths(logFileSystemRoot: string, logFileName: string): void;
    log(logObject: LogObject): void;
    private writeToFile(logMessageArray);
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
export declare class LogService {
    log$: Subject<LogObject>;
    private instanceName;
    private groupLevel;
    private logLevelConfig;
    constructor(log$?: Subject<LogObject>, instanceName?: string, logLevel?: any);
    setLogLevel(logLevel: any): void;
    getInstance(instanceName: string): LogService;
    logMessage(message: any, logLevel: number): void;
    log(...args: any[]): void;
    debug(...args: any[]): void;
    info(...args: any[]): void;
    warn(...args: any[]): void;
    error(...args: any[]): void;
    assert(...args: any[]): void;
    group(): void;
    groupEnd(): void;
    private getLogObject(message, logLevel);
}
export declare const LOG_SERVICE_PROVIDER: {
    provide: typeof LogService;
    useFactory: () => LogService;
};
