"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.uniqID = void 0;
var nanoid_1 = require("nanoid");
exports.uniqID = function () {
    return nanoid_1.nanoid(8);
};
