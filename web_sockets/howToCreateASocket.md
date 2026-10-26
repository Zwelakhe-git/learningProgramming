
```js
// socket.js
module.exports = (io) => {}
```

```js
// server.js
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const os = require('os');

dotenv.config();


const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
        origin: "*",
        methodds: ['GET', 'POST'],
        credentials: true
    }
});

const socket = require("./socket");
socket(io);

```