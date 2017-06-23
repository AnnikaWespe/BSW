"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Class wraps around "$http" from angular 1 and converts
 * its behaviour to use in angular 2 apps
 */
var HttpToNg1Wrapper = (function () {
    /**
     * This class will be used in angular-1 apps like so:
     *
     * angular.service('HttpToNg1Wrapper', [
     *  '$http', window.dekra2.HttpToNg1Wrapper
     * ]);
     *
     * which makes sure that this class will be instantiated by angular-1
     * with the correct $http instance.
     */
    function HttpToNg1Wrapper($http) {
        this.$http = $http;
    }
    HttpToNg1Wrapper.prototype.request = function (url, options) {
        var _this = this;
        return {
            toPromise: function () {
                var headers;
                var searchParams;
                // IMPORTANT: options.headers needs to be "instanceof Headers":
                // https://angular.io/docs/ts/latest/api/http/index/Headers-class.html
                if (options.headers && typeof options.headers.toJSON === 'function') {
                    headers = options.headers.toJSON();
                }
                // IMPORTANT: options.search needs to be "instanceof URLSearchParams":
                // https://angular.io/docs/ts/latest/api/http/index/URLSearchParams-class.html
                // We need to convert the paramsMap to a "normal" object!
                if (options.search && typeof options.search.paramsMap) {
                    searchParams = {};
                    options.search.paramsMap.forEach(function (paramsArray, searchKey) {
                        searchParams[searchKey] = paramsArray[0];
                    });
                }
                return _this.$http({
                    url: url,
                    method: options.method,
                    headers: headers,
                    params: searchParams,
                    data: options.body
                })
                    .then(function (response) {
                    var convertedResponse = {
                        json: function () { return response.data; },
                        text: function () { return response.data; },
                        status: response.status
                    };
                    return convertedResponse;
                })
                    .catch(function (errorResponse) {
                    var convertedResponse = {
                        json: function () { return errorResponse.data; },
                        text: function () { return errorResponse.data; },
                        status: errorResponse.status
                        // config: errorResponse.config,
                        // headers: errorResponse.headers
                    };
                    throw convertedResponse;
                });
            }
        };
    };
    HttpToNg1Wrapper.prototype.get = function (url, options) {
        if (options === void 0) { options = {}; }
        options.method = 'get';
        return this.request(url, options);
    };
    HttpToNg1Wrapper.prototype.post = function (url, body, options) {
        if (options === void 0) { options = {}; }
        options.body = body;
        options.method = 'post';
        return this.request(url, options);
    };
    HttpToNg1Wrapper.prototype.put = function (url, body, options) {
        if (options === void 0) { options = {}; }
        options.body = body;
        options.method = 'put';
        return this.request(url, options);
    };
    HttpToNg1Wrapper.prototype.delete = function (url, options) {
        if (options === void 0) { options = {}; }
        options.method = 'delete';
        return this.request(url, options);
    };
    return HttpToNg1Wrapper;
}());
exports.HttpToNg1Wrapper = HttpToNg1Wrapper;
//# sourceMappingURL=http-wrapper.js.map