"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var socket_io_1 = __importDefault(require("socket.io"));
var app = express_1.default();
var port = 3001;
//app.use(cors());
//app.get('/', (req, res) => res.send('Hello World!'));
var server = app.listen(port, function () {
    return console.log("Listening at http://localhost:" + port);
});
var io = socket_io_1.default(server);
io.on('connection', function (socket) {
    console.log('connection - socket id ' + socket.id);
    socket.emit('greetings', { data: 'helloooo from server' });
    socket.on('greetings', function (data) {
        console.log(data);
    });
});
