"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.io = void 0;
var express_1 = __importDefault(require("express"));
var cors_1 = __importDefault(require("cors"));
var socket_io_1 = __importDefault(require("socket.io"));
var app = express_1.default();
var port = 3001;
app.use(cors_1.default());
var server = app.listen(port, function () {
    return console.log("Listening at http://localhost:" + port);
});
app.get('/', function (req, res) { return res.send('Hello World!'); });
exports.io = socket_io_1.default(server);
