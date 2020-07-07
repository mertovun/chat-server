import { createRoomID } from './utils';
import { io } from './io';
import { Namespace, Socket } from 'socket.io';

interface User {
  nickname?: string;
  color?: string;
}

export class ChatRoom {
  users: { [id: string]: User } = {};
  private constructor(public nsp: Namespace, public id: string) {
    this.nsp.on('connection', this.handleConnection);
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
      if (Object.keys(this.users).length === 0) {
        ChatRoom.delete(this.id);
      }
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
    console.log('Room /' + id + 'has been removed.');
  }
}
