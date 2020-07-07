"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatRoom = void 0;
var utils_1 = require("./utils");
var server_1 = require("./server");
var ChatRoom = /** @class */ (function () {
    function ChatRoom(nsp) {
        this.nsp = nsp;
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
        } while (!ChatRoom.chatRooms[id]);
        var room = new ChatRoom(server_1.io.of(id));
        ChatRoom.chatRooms[id] = room;
        console.log(id);
        console.log(room.nsp);
        return room;
    };
    ChatRoom.deleteChatRoom = function (id) { };
    ChatRoom.users = {};
    ChatRoom.chatRooms = {};
    return ChatRoom;
}());
exports.ChatRoom = ChatRoom;
server_1.io.on('connection', function (socket) {
    console.log('connection - socket id ' + socket.id);
    socket.emit('greetings', { data: 'helloooo from server' });
    socket.on('greetings', function (data) {
        console.log(data);
    });
});
