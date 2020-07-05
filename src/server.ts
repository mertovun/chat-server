import express from 'express';
import cors from 'cors';

import socketio from 'socket.io';

const app = express();
const port = 3001;

//app.use(cors());

//app.get('/', (req, res) => res.send('Hello World!'));

const server = app.listen(port, () =>
  console.log(`Listening at http://localhost:${port}`)
);

const io = socketio(server);

io.on('connection', (socket) => {
  console.log('connection - socket id ' + socket.id);

  socket.emit('greetings', { data: 'helloooo from server' });
  socket.on('greetings', (data: any) => {
    console.log(data);
  });
});
