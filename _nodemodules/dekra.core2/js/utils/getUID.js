"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Helper to generate a UID
 */
exports.getUID = function () {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0, v = c === 'x' ? r : r & 0x3 | 0x8; // tslint:disable-line
        return v.toString(16);
    });
};
//# sourceMappingURL=getUID.js.map