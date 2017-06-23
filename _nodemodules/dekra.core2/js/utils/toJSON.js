"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Method takes a source object and returns a "json representation" which is
 * used to send via HTTP or store in client side storage like
 * localstorage or indexed db
 *
 * It is possible to exclude properties via the `exclude` parameter
 */
function toJSON(source, excludes, includes, compact) {
    if (excludes === void 0) { excludes = []; }
    if (includes === void 0) { includes = []; }
    if (compact === void 0) { compact = true; }
    var target = {};
    for (var key in source) {
        if (source.hasOwnProperty(key)) {
            var value = source[key];
            if (includes.length > 0 && includes.indexOf(key) === -1) {
                continue;
            }
            if (excludes.length > 0 && excludes.indexOf(key) > -1) {
                continue;
            }
            if (key === '$$hashKey') {
                continue;
            }
            if (compact && !value) {
                continue;
            }
            target[key] = (!!value && typeof value.toJSON === 'function') ? value.toJSON() : value;
        }
    }
    return target;
}
exports.toJSON = toJSON;
//# sourceMappingURL=toJSON.js.map