//#region imports and stuff
// EXPRESS
const express = require("express");
const router = express.Router();
const app = express();

app.use(express.static("public"));
app.use("/", router);

// HTTP
const http = require("http");
const server = http.createServer(app);

const PORT = listener.address().port;

// WEBSOCKETS
const WebSocketServer = require("ws").Server;
const wss = new WebSocketServer({server: server, path: "/ws"});

//FILESYSTEM
const fs = require("fs");
//#endregion

//#region EXPRESS EVENTS
app.get("/", (req, res) => {
    res.sendFile(__dirname+"/views/home.html");
});
//#endregion

//#region WS EVENTS
wss.on('connection', (ws)=>{
    console.log("someone connected");
});
//#endregion

//#region LISTEN FOR REQUESTS
server.listen(PORT, ()=>{
    console.log("listening at localhost:5555");
});
//#endregion