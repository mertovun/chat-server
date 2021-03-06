"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var io_1 = require("./io");
var ChatRoom_1 = require("./ChatRoom");
var EventTypes_1 = require("./EventTypes");
io_1.io.on('connection', function (socket) {
    console.log('connection - id: ' + socket.id + ' joined "/"');
    var chatroom = ChatRoom_1.ChatRoom.newChatRoom();
    socket.emit(EventTypes_1.EventTypes.ROOM_CREATED, { id: chatroom.id });
    // socket.emit('greetings', { data: 'helloooo from server' });
    // socket.on('greetings', (data: any) => {
    //   console.log(data);
    // });
});
