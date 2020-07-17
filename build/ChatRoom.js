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
            socket.join('room');
            _this.users[socket.id] = {
                nickname: 'Anonymous_' + socket.id.substr(socket.id.length - 4),
                color: utils_1.createColor(),
            }; // Create user info
            _this.nsp.emit(EventTypes_1.EventTypes.ROOM_DATA, { users: _this.users });
            _this.nsp.emit(EventTypes_1.EventTypes.SYSTEM_MESSAGE, {
                type: SystemMessages_1.SystemMessages.JOINED,
                userId: socket.id,
            });
            //socket.on('connect', this.handleJoin);
            socket.on('disconnect', _this.handleDisconnect(socket));
            socket.on('create', _this.handleCreate);
            socket.on(EventTypes_1.EventTypes.MESSAGE, _this.handleMessage(socket));
        };
        this.handleDisconnect = function (socket) {
            return function (msg) {
                _this.nsp.emit(EventTypes_1.EventTypes.ROOM_DATA, { users: _this.users });
                _this.nsp.emit(EventTypes_1.EventTypes.SYSTEM_MESSAGE, {
                    type: SystemMessages_1.SystemMessages.LEFT,
                    userId: socket.id,
                });
                console.log('disconnected from /' + _this.id + ' [' + msg + ']');
                delete _this.users[socket.id];
            };
        };
        // private handleJoin = (socket: Socket) => {
        //   console.log(socket.id + ' joined to /' + this.id);
        // };
        this.handleCreate = function (socket) { };
        this.handleMessage = function (socket) {
            return function (msg) {
                var timestamp = Date.now();
                var message = {
                    userId: socket.id,
                    msg: msg,
                    timestamp: timestamp,
                };
                console.log(message);
                //TODO: emit MESSAGE_SENT event to the message owner,
                _this.nsp.to(socket.id).emit(EventTypes_1.EventTypes.MESSAGE_SENT, message);
                //TODO: emit MESSAGE_RECEIVED event to the rest
                socket.to('room').emit(EventTypes_1.EventTypes.MESSAGE_RECEIVED, message);
            };
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
