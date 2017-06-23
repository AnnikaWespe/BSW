"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var http_1 = require("@angular/http");
var testing_1 = require("@angular/http/testing");
var Observable_1 = require("rxjs/Observable");
require("rxjs/add/operator/catch");
require("rxjs/add/observable/throw");
/**
 * Class extends angular2 http in order to intercept http requests
 *
 * We need two things:
 *   1. setting global request headers
 *   2. defining global error response handlers
 *
 * Thanks to:
 *   - http://stackoverflow.com/questions/34934009/handling-401s-globally-with-angular-2
 *   - http://www.adonespitogo.com/articles/angular-2-extending-http-provider/
 *
 * Also see https://jira.dekra.de/browse/MSK-142
 */
var DekraHttp = (function (_super) {
    __extends(DekraHttp, _super);
    function DekraHttp(backend, defaultOptions) {
        return _super.call(this, backend, defaultOptions) || this;
    }
    DekraHttp.addGlobalRequestHeader = function (header) {
        this.globalRequestHeaders[header.name] = header.value;
    };
    DekraHttp.removeGlobalRequestHeader = function (headerName) {
        delete this.globalRequestHeaders[headerName];
    };
    DekraHttp.addGlobalResponseErrorHandler = function (handler) {
        this.globalResponseErrorHandlers.push(handler);
    };
    DekraHttp.removeGlobalResponseErrorHandler = function (handler) {
        var index = this.globalResponseErrorHandlers.indexOf(handler);
        if (index > -1) {
            this.globalResponseErrorHandlers.splice(index, 1);
        }
    };
    /**
     * We only need to overwrite request method as angular http will call
     * this on each request type
     *
     * Call chain:
     *
     * 1. call from outside: dekraHttp.get(url, options)
     * 2. angular http.get now calls this method (with options now undefined and url instanceof request)
     * 3. we are calling super.request here
     */
    DekraHttp.prototype.request = function (url, options) {
        var _this = this;
        if (!(url instanceof http_1.Request)) {
            throw new Error('Calling dekraHttp.request directly is not allowed');
        }
        var request = url;
        // append globally set request headers
        for (var headerName in DekraHttp.globalRequestHeaders) {
            if (DekraHttp.globalRequestHeaders.hasOwnProperty(headerName)) {
                var headerValue = DekraHttp.globalRequestHeaders[headerName];
                request.headers.append(headerName, headerValue);
            }
        }
        return _super.prototype.request.call(this, request)
            .catch(function (errorResponse) {
            var requestMethod = _this.getRequestMethodFromRequest(request);
            var requestConfig = {
                url: request.url,
                method: requestMethod,
                options: options
            };
            if (requestMethod === 'post' || requestMethod === 'put' || requestMethod === 'patch') {
                // only possible if we pass an object here:
                // (but for example: could be content-disposition string...)
                try {
                    requestConfig.body = JSON.parse(request.getBody());
                }
                catch (e) {
                    // ignore
                }
            }
            DekraHttp.globalResponseErrorHandlers.forEach(function (handler) {
                handler(requestConfig, errorResponse);
            });
            return Observable_1.Observable.throw(errorResponse);
        });
    };
    DekraHttp.prototype.getRequestMethodFromRequest = function (request) {
        switch (request.method) {
            case http_1.RequestMethod.Get:
                return 'get';
            case http_1.RequestMethod.Post:
                return 'post';
            case http_1.RequestMethod.Put:
                return 'put';
            case http_1.RequestMethod.Patch:
                return 'patch';
            case http_1.RequestMethod.Delete:
                return 'delete';
            default:
                throw new Error('Unsupported request method: ' + request.method);
        }
    };
    return DekraHttp;
}(http_1.Http));
DekraHttp.globalRequestHeaders = {};
DekraHttp.globalResponseErrorHandlers = [];
DekraHttp.decorators = [
    { type: core_1.Injectable },
];
/** @nocollapse */
DekraHttp.ctorParameters = function () { return [
    { type: http_1.XHRBackend, },
    { type: http_1.RequestOptions, },
]; };
exports.DekraHttp = DekraHttp;
exports.DEKRA_HTTP_PROVIDER = {
    provide: http_1.Http,
    useFactory: function (backend, options) {
        return new DekraHttp(backend, options);
    },
    deps: [http_1.XHRBackend, http_1.BaseRequestOptions]
};
exports.DEKRA_HTTP_MOCK_PROVIDER = {
    provide: http_1.Http,
    useFactory: function (backend, options) {
        return new DekraHttp(backend, options);
    },
    deps: [testing_1.MockBackend, http_1.BaseRequestOptions]
};
//# sourceMappingURL=http.js.map