"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatRoom = void 0;
var utils_1 = require("./utils");
var io_1 = require("./io");
var ChatRoom = /** @class */ (function () {
    function ChatRoom(nsp, id) {
        var _this = this;
        this.nsp = nsp;
        this.id = id;
        this.users = {};
        this.handleConnection = function (socket) {
            console.log(socket.id + ' connected to /' + _this.id);
            _this.users[socket.id] = {}; // Create user info
            socket.on('disconnect', _this.handleDisconnect(socket));
            socket.on('create', _this.handleCreate);
            socket.on('message', _this.handleMessage);
        };
        this.handleDisconnect = function (socket) {
            return function (msg) {
                console.log('disconnected from /' + _this.id + ' [' + msg + ']');
                delete _this.users[socket.id];
                if (Object.keys(_this.users).length === 0) {
                    ChatRoom.delete(_this.id);
                }
            };
        };
        this.handleCreate = function (socket) { };
        this.handleMessage = function (socket) { };
        this.nsp.on('connection', this.handleConnection);
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
        console.log('Room /' + id + 'has been removed.');
    };
    ChatRoom.chatRooms = {};
    return ChatRoom;
}());
exports.ChatRoom = ChatRoom;
