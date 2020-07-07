import express from 'express';
import cors from 'cors';

import socketio from 'socket.io';

const app = express();
const port = 3001;

app.use(cors());

const server = app.listen(port, () =>
  console.log(`Listening at http://localhost:${port}`)
);

app.get('/', (req, res) => res.send('Hello World!'));

export const io = socketio(server);
