"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventTypes = void 0;
var EventTypes;
(function (EventTypes) {
    EventTypes["ROOM_CREATED"] = "ROOM_CREATED";
    EventTypes["ROOM_DATA"] = "ROOM_DATA";
    EventTypes["MESSAGE"] = "MESSAGE";
    EventTypes["MESSAGE_RECEIVED"] = "MESSAGE_RECEIVED";
    EventTypes["MESSAGE_SENT"] = "MESSAGE_SENT";
    EventTypes["SYSTEM_MESSAGE"] = "SYSTEM_MESSAGE";
    EventTypes["JOIN_ROOM"] = "JOIN_ROOM";
})(EventTypes = exports.EventTypes || (exports.EventTypes = {}));
