import {} from 'jasmine';
import {
  ConsoleLogger,
  FileLogger,
  LogObject,
  LogService
} from './logger';
import {
  TestBed
} from '@angular/core/testing';

import { File } from '@ionic-native/file';

describe('Logger', () => {
  let spyLogMessage;
  let file: File;
  let fileLogger;

  beforeEach( () => {
    TestBed.configureTestingModule({
      providers: [
        File,
        FileLogger
      ]
    });

    file = TestBed.get(File);
    fileLogger = TestBed.get(FileLogger);
  });

  describe('ConsoleLogger', () => {
    let consoleLogger = new ConsoleLogger();

    beforeEach(() => {
      spyOn(console, 'warn');
      spyOn(console, 'info');
    });

    it('should call the correct console method with logObject', () => {
      class MockLogObject extends LogObject {
        get fullMessage () { return ['fullMessage']; };
      }
      let logObject = new MockLogObject(['message'], 2);
      consoleLogger.log(logObject);
      expect(console.info).toHaveBeenCalledWith('fullMessage');
    });
  });

  describe('FileLogger', () => {

    beforeEach(() => {
      spyOn(file, 'writeFile');
      spyOn(file, 'checkFile').and.returnValue(Promise.resolve(false));
      fileLogger.setPaths('logFileSystemRoot', 'logFilePath');
    });

    describe('given window.cordova is not defined', () => {

      beforeEach(() => {
        window['cordova'] = null;
      });

      it('should not write to a file', (done) => {
        let d = new Date(2001, 0, 1, 1, 1, 1);
        fileLogger.log(new LogObject(['message1', {foo: 'bar'}], 1, 'instance', d));
        setTimeout(() => {
          expect(file.writeFile).not.toHaveBeenCalled();
          done();
        });
      });
    });

    describe('given window.cordova is defined', () => {

      beforeEach(() => {
        window['cordova'] = {};
      });

      afterEach(() => {
        window['cordova'] = null;
      });

      it('should use ionic native to write to a file', (done) => {
        let d = new Date(2001, 0, 1, 1, 1, 1);

        fileLogger.log(new LogObject(['message1', {foo: 'bar'}], 1, 'instance', d));

        expect(file.checkFile).toHaveBeenCalledWith(
          'logFileSystemRoot',
          'logFilePath',
        );
        setTimeout(() => {
          expect(file.writeFile).toHaveBeenCalledWith(
            'logFileSystemRoot',
            'logFilePath',
            '2001-01-01 01:01:01 # instance #  message1 {"foo":"bar"}\n'
          );
          done();
        });
      });

      it('should not write to a file given we are running on "browser" platform', (done) => {
        window['cordova'] = {platformId: 'browser'};
        let d = new Date(2001, 1, 1, 1, 1, 1);
        fileLogger.log(new LogObject(['message1', {foo: 'bar'}], 1, 'instance', d));

        setTimeout(() => {
          expect(file.writeFile).not.toHaveBeenCalled();
          done();
        });
      });
    });
  });

  describe('LogObject', () => {

    it('should use the defaults', () => {
      let logObject = new LogObject(['test']);
      expect(logObject.logLevel).toEqual(1);
      expect(logObject.originalMessage).toEqual(['test']);
      expect(logObject.instanceName).toEqual('');
      expect(logObject.groupLevel).toEqual(0);
    });

    it('should generate the correct fullmessage', () => {
      let d = new Date(2001, 0, 1, 1, 1, 1);
      let message = ['m1', 'm2'];
      let logObject = new LogObject(message, 1, 'instance', d, 3);
      expect(logObject.fullMessage).toEqual(['2001-01-01 01:01:01 # instance #       ', 'm1', 'm2']);
    });
  });

  describe('LogService', () => {
    let logService;

    beforeEach(() => {
      logService = new LogService();
      spyLogMessage = spyOn(logService, 'logMessage').and.callThrough();
    });

    it('should should redirect log messages to logMessage with correct message and priority', () => {
      logService.log('hello world');
      expect(spyLogMessage).toHaveBeenCalledWith(['hello world'], 1);
      spyLogMessage.calls.reset();
      logService.info('hello world');
      expect(spyLogMessage).toHaveBeenCalledWith(['hello world'], 2);
      spyLogMessage.calls.reset();
      logService.warn('hello world');
      expect(spyLogMessage).toHaveBeenCalledWith(['hello world'], 3);
      spyLogMessage.calls.reset();
      logService.error('hello world');
      expect(spyLogMessage).toHaveBeenCalledWith(['hello world'], 4);
    });

    it('should support multiple arguments of any type', () => {
      let data = {answer: 42};
      logService.log('hello world', data);
      expect(spyLogMessage).toHaveBeenCalledWith(['hello world', data], 1);
    });

    it('should publish logObject to the log$ stream', (done) => {
      let message: any;
      logService.log$.subscribe((logObject) => {
        message = logObject;
        done();
      });
      logService.log('hello world');
      expect(message.originalMessage).toEqual(['hello world']);
      expect(message.instanceName).toEqual('');
      expect(message.groupLevel).toEqual(0);
      expect(message.logLevel).toEqual(1);
    });

    describe('#getInstance', () => {
      let loggerChild;

      beforeEach(() => {
        loggerChild = logService.getInstance('newInstance');
        spyOn(loggerChild, 'logMessage');
      });

      it('should generate new logger instances with new Instance name', () => {
        loggerChild.log('hello world');
        expect(loggerChild.logMessage).toHaveBeenCalledWith(['hello world'], 1);
        expect(spyLogMessage).not.toHaveBeenCalledWith(['hello world'], 1);
        expect(loggerChild['instanceName']).toEqual('newInstance');
        expect(logService['instanceName']).toEqual(undefined);
      });
    });

    describe('given the log level set to "warn"', () => {
      let message: any = {};
      let spy;

      beforeEach(() => {
        spy = jasmine.createSpy('Publish spy');

        message = {originalMessage: 'notCalled'};
        logService.setLogLevel('warn');
      });

      it('should publish "warn" messages', () => {
        logService.log$.subscribe(spy);
        logService.warn('warning message');
        expect(spy).toHaveBeenCalledTimes(1);
      });

      it('Info Message is not published', () => {
        logService.log$.subscribe(spy);
        logService.info('info message');
        expect(spy).not.toHaveBeenCalled();
      });
    });
  });
});
