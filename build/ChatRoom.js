"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatRoom = void 0;
var utils_1 = require("./utils");
var io_1 = require("./io");
var EventTypes_1 = require("./EventTypes");
var SystemMessages_1 = require("./SystemMessages");
var DELETE_ABANDONED_ROOM_IN_SECS = 5;
var ChatRoom = /** @class */ (function () {
    function ChatRoom(nsp, id) {
        var _this = this;
        this.nsp = nsp;
        this.id = id;
        this.users = {};
        this.handleConnection = function (socket) {
            console.log(socket.id + ' joined to /' + _this.id);
            _this.users[socket.id] = {}; // Create user info
            _this.nsp.emit(EventTypes_1.EventTypes.ROOM_DATA, { users: _this.users });
            socket.emit(EventTypes_1.EventTypes.SYSTEM_MESSAGE, { msg: SystemMessages_1.SystemMessages.JOIN });
            socket.on('connect', _this.handleJoin);
            socket.on('disconnect', _this.handleDisconnect(socket));
            socket.on('create', _this.handleCreate);
            socket.on(EventTypes_1.EventTypes.MESSAGE, _this.handleMessage);
        };
        this.handleDisconnect = function (socket) {
            return function (msg) {
                console.log('disconnected from /' + _this.id + ' [' + msg + ']');
                delete _this.users[socket.id];
            };
        };
        this.handleJoin = function (socket) {
            console.log(socket.id + ' joined to /' + _this.id);
        };
        this.handleCreate = function (socket) { };
        this.handleMessage = function (msg) {
            console.log(msg);
            //TODO: emit MESSAGE_SENT event to the message owner,
            //TODO: emit MESSAGE_RECEIVED event to the rest
        };
        this.nsp.on('connect', this.handleConnection);
        this.roomAbandonedCheck();
    }
    ChatRoom.new = function () {
        var id;
        do {
            id = utils_1.createRoomID();
        } while (ChatRoom.chatRooms[id]);
        var room = new ChatRoom(io_1.io.of(id), id);
        ChatRoom.chatRooms[id] = room;
        return room;
    };
    ChatRoom.delete = function (id) {
        var nsp = ChatRoom.chatRooms[id].nsp;
        nsp.removeAllListeners();
        delete io_1.io.nsps['/' + id];
        delete ChatRoom.chatRooms[id];
        console.log('Room /' + id + ' has been removed.');
    };
    ChatRoom.prototype.roomAbandonedCheck = function () {
        var _this = this;
        var counter = 0;
        var interval = setInterval(function () {
            if (Object.keys(_this.users).length === 0) {
                counter += 1;
            }
            else
                counter = 0;
            if (counter >= DELETE_ABANDONED_ROOM_IN_SECS) {
                clearInterval(interval);
                ChatRoom.delete(_this.id);
                console.log(Object.keys(ChatRoom.chatRooms));
            }
        }, 1000);
    };
    ChatRoom.chatRooms = {};
    return ChatRoom;
}());
exports.ChatRoom = ChatRoom;
