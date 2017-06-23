"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var http_1 = require("@angular/http");
var file_1 = require("@ionic-native/file");
var http_2 = require("./http/http");
var http_buffer_1 = require("./http/http-buffer");
var logger_1 = require("./logger/logger");
var environment_service_1 = require("./environment/environment.service");
var backup_service_1 = require("./backup/backup.service");
function createLogger() {
    return new logger_1.LogService();
}
exports.createLogger = createLogger;
;
function createDekraHttp(backend, options) {
    return new http_2.DekraHttp(backend, options);
}
exports.createDekraHttp = createDekraHttp;
;
var CoreModule = (function () {
    function CoreModule() {
    }
    return CoreModule;
}());
CoreModule.decorators = [
    { type: core_1.NgModule, args: [{
                imports: [
                    http_1.HttpModule
                ],
                providers: [
                    {
                        provide: logger_1.LogService,
                        useFactory: createLogger
                    },
                    file_1.File,
                    logger_1.FileLogger,
                    // this makes sure our DekraHttp class will be used for each "Http" injection!
                    http_1.XHRBackend,
                    http_1.BaseRequestOptions,
                    {
                        provide: http_1.Http,
                        useFactory: createDekraHttp,
                        deps: [http_1.XHRBackend, http_1.BaseRequestOptions]
                    },
                    http_buffer_1.HttpBuffer,
                    environment_service_1.EnvironmentService,
                    backup_service_1.BackupService
                ],
                declarations: [],
                entryComponents: [],
                exports: []
            },] },
];
/** @nocollapse */
CoreModule.ctorParameters = function () { return []; };
exports.CoreModule = CoreModule;
//# sourceMappingURL=core.module.js.map