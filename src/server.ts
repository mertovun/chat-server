import { io } from './io';
import { ChatRoom } from './ChatRoom';
import { EventTypes } from './EventTypes';

io.on('connection', (socket) => {
  console.log('connection - id: ' + socket.id + ' joined "/"');

  const chatroom = ChatRoom.new();
  //io.of('/' + chatroom.id);
  socket.emit(EventTypes.ROOM_CREATED, {
    nspId: chatroom.id,
  });
});
