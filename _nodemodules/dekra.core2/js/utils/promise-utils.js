"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Class implements some static promise helper methods in order to extend
 * native es6 promises when necessary
 */
var PromiseUtils = (function () {
    function PromiseUtils() {
    }
    /**
     * Custom allSettled implementation inspired by angular $q.
     *
     * Takes an array of promises and waits for all of them to resolve or reject
     * but does not care if one of them rejects, in the end it just resolves
     * with the values of the promises (resolved or rejected)
     *
     * Heavily based on https://gist.github.com/Reshetnyak/5f5a204353e24c59eacee1cd16cb9c31
     *
     * More discussion: http://stackoverflow.com/questions/30569182/promise-allsettled-in-babel-es6-implementation
     */
    PromiseUtils.allSettled = function (promises) {
        // Wrap each promise from array with promise which
        // resolves in both cases, either resolved of rejected
        var wrap = function (promise) {
            return new Promise(function (resolve) {
                return promise
                    .then(function (result) { return resolve(result); })
                    .catch(function (reason) { return resolve(reason); });
            });
        };
        // Provide array of promises which can only be resolved
        return Promise.all(promises.map(wrap));
    };
    return PromiseUtils;
}());
exports.PromiseUtils = PromiseUtils;
//# sourceMappingURL=promise-utils.js.map