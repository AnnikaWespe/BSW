import { NgModule } from '@angular/core';
import { HttpModule, Http, XHRBackend, BaseRequestOptions } from '@angular/http';
import { File } from '@ionic-native/file';
import { DekraHttp } from './http/http';
import { HttpBuffer } from './http/http-buffer';
import { LogService, FileLogger } from './logger/logger';
import { EnvironmentService } from './environment/environment.service';
import { BackupService } from './backup/backup.service';

export function createLogger() {
  return new LogService();
};
export function createDekraHttp(backend, options) {
  return new DekraHttp(backend, options);
};


@NgModule({
  imports: [
    HttpModule
  ],

  providers: [
    {
      provide: LogService,
      useFactory: createLogger
    },
    File,
    FileLogger,

    // this makes sure our DekraHttp class will be used for each "Http" injection!
    XHRBackend,
    BaseRequestOptions,
    {
      provide: Http,
      useFactory: createDekraHttp,
      deps: [XHRBackend, BaseRequestOptions]
    },

    HttpBuffer,
    EnvironmentService,
    BackupService
  ],

  declarations: [

  ],

  entryComponents: [

  ],

  exports: [

  ]
})
export class CoreModule { }
