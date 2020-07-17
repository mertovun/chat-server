import { createRoomID, createColor } from './utils';
import { io } from './io';
import { Namespace, Socket } from 'socket.io';
import { EventTypes } from './EventTypes';
import { SystemMessages } from './SystemMessages';

const DELETE_ABANDONED_ROOM_IN_SECS = 5;

interface User {
  nickname: string;
  color: string;
}
interface Message {
  userId: string;
  msg: string;
  timestamp: number;
}

interface SysMessage {
  type: SystemMessages;
  userId?: string;
}

export class ChatRoom {
  users: { [id: string]: User } = {};
  private constructor(public nsp: Namespace, public id: string) {
    this.nsp.on('connect', this.handleConnection);
    this.roomAbandonedCheck();
  }

  private handleConnection = (socket: Socket) => {
    console.log(socket.id + ' joined to /' + this.id);
    socket.join('room');
    this.users[socket.id] = {
      nickname: 'Anonymous_' + socket.id.substr(socket.id.length - 4),
      color: createColor(),
    }; // Create user info
    this.nsp.emit(EventTypes.ROOM_DATA, { users: this.users });
    this.nsp.emit(EventTypes.SYSTEM_MESSAGE, {
      type: SystemMessages.JOINED,
      userId: socket.id,
    });
    //socket.on('connect', this.handleJoin);
    socket.on('disconnect', this.handleDisconnect(socket));
    socket.on('create', this.handleCreate);
    socket.on(EventTypes.MESSAGE, this.handleMessage(socket));
  };
  private handleDisconnect = (socket: Socket) => {
    return (msg: string) => {
      this.nsp.emit(EventTypes.ROOM_DATA, { users: this.users });
      this.nsp.emit(EventTypes.SYSTEM_MESSAGE, {
        type: SystemMessages.LEFT,
        userId: socket.id,
      });
      console.log('disconnected from /' + this.id + ' [' + msg + ']');
      delete this.users[socket.id];
    };
  };
  // private handleJoin = (socket: Socket) => {
  //   console.log(socket.id + ' joined to /' + this.id);
  // };
  private handleCreate = (socket: Socket) => {};
  private handleMessage = (socket: Socket) => {
    return (msg: string): void => {
      const timestamp: number = Date.now();
      const message: Message = {
        userId: socket.id,
        msg: msg,
        timestamp,
      };
      console.log(message);
      //TODO: emit MESSAGE_SENT event to the message owner,
      this.nsp.to(socket.id).emit(EventTypes.MESSAGE_SENT, message);
      //TODO: emit MESSAGE_RECEIVED event to the rest

      socket.to('room').emit(EventTypes.MESSAGE_RECEIVED, message);
    };
  };

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
