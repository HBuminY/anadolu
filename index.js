//#region settings
const portMode = "build"  // test or build as string
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

function validateEmail(email) {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

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

function updateAccObj(){
    fs.readFile(accountsDoc, (err, data)=>{
        accountsObj = JSON.parse(data);
    });
}
updateAccObj();
//#endregion


//#region EXPRESS EVENTS
app.get("/", (req, res) => {
    res.sendFile(__dirname+"/public/new/newcomer.html");
});

app.get("/u/:username",(req, res)=>{
    res.sendFile(__dirname+"/public/spe/user.html");
});

app.get("/get/:type&:target", (req, res)=>{
    console.log(req.params);
    if(req.params.type=="userdata"){
        console.log("1");
        if(accountsObj[req.params.target]!=undefined){
            let user = accountsObj[req.params.target];
            res.send(JSON.stringify(
                {
                    "err":"",
                    "tpoint":user.tpoint
                }
            ));
        }else{
            res.send(JSON.stringify(
                {
                    "err":"unvalid user"
                }
            ));
        }
    };
});

app.get("/test", (req, res)=>{ 
    let authObj = JSON.parse(req.headers.authorization);
    let username = authObj.username;
    let password = authObj.password;
    if(username in accountsObj){
        if(password == accountsObj[username].password){
            res.sendStatus("200");
        }else{
            res.sendStatus("401");
        };
    }else{
        res.sendStatus("401");
    };
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
                console.log("register request recieved");

                let data = msg.data;
                let username = data.username.toLowerCase();
                let password = data.password;
                let email = data.email;

                const registerCondition = [
                    accountsObj[username]==undefined,
                    username.length<=10,
                    username.length>=3,
                    password.length<=15,
                    password.length>=7,
                    validateEmail(email)
                ];
                const badRegMessages = [
                    "existing name",
                    "username must be shorther than 10 characters",
                    "username must be longer than 3 characters",
                    "password must be shorther than 15 characters",
                    "password must be longer than 7 characters",
                    "unvalid email"
                ]

                console.log(registerCondition);

                if (!registerCondition.includes(false)) {
                    accountsObj[username]={
                        "password":password,
                        "email":email,
                        "id":uuidv4(),
                        "tpoint":0
                    };
                    fs.writeFile(accountsDoc, JSON.stringify(accountsObj), (err)=>{
                        if (err) throw err;
                    });
                    ws.send(JSON.stringify({"type":"registered"}));
                }else{
                    var errArr=[];
                    for(let i=0; i<registerCondition.filter(x => x === false).length; i++){
                        let errIndex = registerCondition.indexOf(false,-i);
                        let errMsg = badRegMessages[errIndex];
                        errArr.push(errMsg);
                    };
                    console.log(errArr);
                    ws.send(JSON.stringify(
                        {  
                            "type":"unvalid regObj",
                            "errArr":errArr
                        }
                    ));
                }
            };

            if(msg.type=="loginObj"){ //HANDLING LOGIN REQUEST
                console.log("login request arrived");

                let data = msg.data;
                let username = data.username.toLowerCase();
                let password = data.password;

                const loginCondition = [
                    accountsObj[username]!==undefined,
                    accountsObj[username]!==undefined ? password==accountsObj[username].password : false
                ];

                if (!loginCondition.includes(false)) {
                    ws.send(JSON.stringify(
                        {
                            "type":"logged",
                            "id":accountsObj[username].id,
                            "username":username
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