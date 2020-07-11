import { createRoomID } from './utils';
import { io } from './io';
import { Namespace, Socket } from 'socket.io';

const DELETE_ABANDONED_ROOM_IN_SECS = 5;

interface User {
  nickname?: string;
  color?: string;
}

export class ChatRoom {
  users: { [id: string]: User } = {};
  private constructor(public nsp: Namespace, public id: string) {
    this.nsp.on('connection', this.handleConnection);
    this.roomAbandonedCheck();
  }

  private handleConnection = (socket: Socket) => {
    console.log(socket.id + ' connected to /' + this.id);
    this.users[socket.id] = {}; // Create user info
    socket.on('disconnect', this.handleDisconnect(socket));
    socket.on('create', this.handleCreate);
    socket.on('message', this.handleMessage);
  };
  private handleDisconnect = (socket: Socket) => {
    return (msg: string) => {
      console.log('disconnected from /' + this.id + ' [' + msg + ']');
      delete this.users[socket.id];
    };
  };
  private handleCreate = (socket: Socket) => {};
  private handleMessage = (socket: Socket) => {};

  static chatRooms: { [key: string]: ChatRoom } = {};

  static new() {
    let id: string;
    do {
      id = createRoomID();
    } while (ChatRoom.chatRooms[id]);

    const room = new ChatRoom(io.of(id), id);
    ChatRoom.chatRooms[id] = room;
    return room;
  }
  static delete(id: string) {
    const nsp = ChatRoom.chatRooms[id].nsp;
    nsp.removeAllListeners();
    delete io.nsps['/' + id];
    delete ChatRoom.chatRooms[id];
    console.log('Room /' + id + ' has been removed.');
  }
  private roomAbandonedCheck() {
    let counter = 0;
    const interval = setInterval(() => {
      if (Object.keys(this.users).length === 0) {
        counter += 1;
      } else counter = 0;
      if (counter >= DELETE_ABANDONED_ROOM_IN_SECS) {
        clearInterval(interval);
        ChatRoom.delete(this.id);
        console.log(Object.keys(ChatRoom.chatRooms));
      }
    }, 1000);
  }
}
