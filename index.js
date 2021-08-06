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

//OTHER
const fs = require("fs");
const { v4: uuidv4 } = require('uuid');
//#endregion


//#region FILE SYSTEM
let accountsObj;
const accountsDoc = __dirname+"/database/accounts.json";

fs.readFile(accountsDoc, (err, data)=>{
    accountsObj = JSON.parse(data);
});
//#endregion


//#region EXPRESS EVENTS
app.get("/", (req, res) => {
    res.sendFile(__dirname+"/public/newcomer.html");
});

app.get("/u/:username",(req, res)=>{
    res.sendFile(__dirname+"/public/user.html");
});
//#endregion


//#region WS EVENTS
ws.on('connection', (ws)=>{
    console.log("someone connected");

    ws.on('message', (message)=>{
        try {
            let msg = JSON.parse(message);
            if(portMode=="test"){console.log(msg);};

            if(msg.type=="regObj"){ //HANDLING REGISTER REQUEST
                console.log("register request arrived");

                let data = msg.data;
                let username = data.username;
                let password = data.password;

                const registerCondition = [
                    accountsObj[username]==undefined,
                    username.length<=10,
                    username.length>=3
                ];

                if (!registerCondition.includes(false)) {
                    accountsObj[username]={
                        "password":password,
                        "id":uuidv4(),
                        "tpoint":0
                    };
                    fs.writeFile(accountsDoc, JSON.stringify(accountsObj), (err)=>{
                        if (err) throw err;
                    });
                    ws.send(JSON.stringify({"type":"registered"}));
                }

                ws.send("register request recieved");
            };

            if(msg.type=="loginObj"){ //HANDLING LOGIN REQUEST
                console.log("login request arrived");

                let data = msg.data;
                let username = data.username;
                let password = data.password;

                const loginCondition = [
                    accountsObj[username]!==undefined,
                    accountsObj[username]!==undefined ? password==accountsObj[username].password : false
                ];

                if (!loginCondition.includes(false)) {
                    ws.send(JSON.stringify(
                        {
                            "type":"logged",
                            "id":accountsObj[username].id
                        }
                    ));
                    console.log("login request accepted");
                }else{
                    ws.send(JSON.stringify(
                        {
                            "type":"unvalidLogin"
                        }
                    ));
                };
            };

        } catch (err) {
            console.log("unvalid message\n", err);
            console.log("\n"+message);
        };
    });
});
//#endregion


//#region LISTEN FOR REQUESTS
const listener = server.listen(PORT, ()=>{
    console.log("listening at port "+ listener.address().port);
});
//#endregion