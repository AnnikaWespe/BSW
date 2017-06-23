"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var http_1 = require("@angular/http");
require("rxjs/add/operator/toPromise");
/**
 * Class implements a simple http buffer in order to queue up failed http
 * requests and retry them at a later time
 */
var HttpBuffer = (function () {
    function HttpBuffer(http) {
        this.http = http;
        this.bufferedRequests = [];
    }
    HttpBuffer.prototype.append = function (requestConfig) {
        this.bufferedRequests.push(requestConfig);
    };
    HttpBuffer.prototype.retryAll = function () {
        var _this = this;
        var requestPromises = [];
        this.bufferedRequests.forEach(function (bufferedRequest) {
            requestPromises.push(_this.retryHttpRequest(bufferedRequest));
        });
        var requestsPromise = Promise.all(requestPromises);
        this.bufferedRequests = [];
        return requestsPromise;
    };
    // TODO discuss if clearing the buffered requests is enough
    // TODO: cancel running requests?
    HttpBuffer.prototype.rejectAll = function () {
        this.bufferedRequests = [];
    };
    HttpBuffer.prototype.isEmpty = function () {
        return this.bufferedRequests.length === 0;
    };
    HttpBuffer.prototype.retryHttpRequest = function (requestConfig) {
        // TODO maybe we could use http.request() here:
        // https://angular.io/docs/js/latest/api/http/index/Http-class.html#!#request-anchor
        switch (requestConfig.type) {
            case 'get':
                return this.http.get(requestConfig.url, requestConfig.options).toPromise();
            case 'post':
                return this.http.post(requestConfig.url, requestConfig.body, requestConfig.options).toPromise();
            case 'put':
                return this.http.put(requestConfig.url, requestConfig.body, requestConfig.options).toPromise();
            case 'delete':
                return this.http.delete(requestConfig.url, requestConfig.options).toPromise();
        }
    };
    return HttpBuffer;
}());
HttpBuffer.decorators = [
    { type: core_1.Injectable },
];
/** @nocollapse */
HttpBuffer.ctorParameters = function () { return [
    { type: http_1.Http, },
]; };
exports.HttpBuffer = HttpBuffer;
//# sourceMappingURL=http-buffer.js.map