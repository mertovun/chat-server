"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatRoom = void 0;
var utils_1 = require("./utils");
var io_1 = require("./io");
var ChatRoom = /** @class */ (function () {
    function ChatRoom(nsp, id) {
        this.nsp = nsp;
        this.id = id;
        this.users = {};
        this.handleConnection = function (socket) { };
        this.handleDisconnect = function (socket) { };
        this.handleCreate = function (socket) { };
        this.handleMessage = function (socket) { };
        this.nsp.on('connection', this.handleConnection);
        this.nsp.on('disconnect', this.handleDisconnect);
        this.nsp.on('create', this.handleCreate);
        this.nsp.on('message', this.handleMessage);
    }
    ChatRoom.newChatRoom = function () {
        var id;
        do {
            id = utils_1.uniqID();
        } while (ChatRoom.chatRooms[id]);
        var room = new ChatRoom(io_1.io.of(id), id);
        ChatRoom.chatRooms[id] = room;
        console.log(room.id);
        console.log(room.nsp.connected);
        return room;
    };
    ChatRoom.deleteChatRoom = function (id) { };
    ChatRoom.chatRooms = {};
    return ChatRoom;
}());
exports.ChatRoom = ChatRoom;
