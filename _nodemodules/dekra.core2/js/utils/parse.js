"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Simple $parse() helper
 */
exports.parse = function (path) {
    var pathItems = path.split('.');
    return function (object) {
        var attribute = object;
        pathItems.forEach(function (pathItem) {
            attribute = !!attribute ? attribute[pathItem] : null;
        });
        return attribute;
    };
};
//# sourceMappingURL=parse.js.map