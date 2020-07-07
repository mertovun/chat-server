"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createRoomID = void 0;
var nanoid_1 = require("nanoid");
exports.createRoomID = function () {
    return nanoid_1.nanoid(8);
};
