//#region settings
const portMode = "test"  // test or build as string
//#endregion


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

let PORT = -1;
if(portMode == "test"){
    PORT = 8585;
}else if(portMode == "build"){
    PORT = process.env.PORT;
};

// WEBSOCKETS
const WebSocketServer = require("ws").Server;
const ws = new WebSocketServer({server: server, path: "/ws"});

//FILESYSTEM
const fs = require("fs");
//#endregion


//#region FILE SYSTEM
let accountsObj;

fs.readFile(__dirname+"/database/accounts.json", (err, data)=>{
    accountsObj = JSON.parse(data);
});
//#endregion


//#region EXPRESS EVENTS
app.get("/", (req, res) => {
    res.sendFile(__dirname+"/public/home.html");
});
//#endregion


//#region WS EVENTS
ws.on('connection', (ws)=>{
    console.log("someone connected");

    ws.on('message', (message)=>{
        try {
            let msg = JSON.parse(message);
            if(msg.type=="regObj"){
                console.log("register data arrived");

                let data = msg.data;
                let username = data.username;
                let password = data.password;

                const registerCondition = [
                    accountsObj[username]==undefined,
                    username.length<=10,
                    username.length>=3
                ];

                if (!registerCondition.includes(false)) {
                    console.log("valid register");
                }

                ws.send("register request recieved");
            };

        } catch (e) {
            console.log("unvalid message", e);
        };
    });
});
//#endregion


//#region LISTEN FOR REQUESTS
const listener = server.listen(PORT, ()=>{
    console.log("listening at port "+ listener.address().port);
});
//#endregion