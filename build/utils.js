"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createColor = exports.createRoomID = void 0;
var color_convert_1 = __importDefault(require("color-convert"));
var nanoid_1 = require("nanoid");
exports.createRoomID = function () {
    return nanoid_1.nanoid(8);
};
exports.createColor = function () {
    var a = Math.random() * 2 - 1;
    var b = Math.random() * 2 - 1;
    var k = 90 / Math.sqrt(a * a + b * b);
    var lab = [40, a * k, b * k];
    console.log(lab);
    return '#' + color_convert_1.default.lab.hex(lab);
};
