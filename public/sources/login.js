let type;
let protocol = window.location.protocol;
if(protocol=="http:"){type="ws"
}else if(protocol=="https:"){type="wss"};

let url = `${type}://${window.location.hostname}:${window.location.port}/ws`
let ws = new WebSocket(url);

/*
This website does not collect not send your ip to any server.
The script below is created as part of a feature that's to be added in the future for safety of the service.

ws.onopen = () => {
    console.log("connected!");
    //
    fetch("https://api.db-ip.com/v2/free/self")
      .then(response => response.json())
      .then(data => {
        ws.send(JSON.stringify(data));
      });
};
*/

ws.onmessage = (msg)=>{
    let data = msg.data;
    try {
        data = JSON.parse(data);
        console.log(data);

        if(data.type=="logged"){
            console.log(data.id);
        };
    } catch (err) {
        console.log("unvalid message\n"+err);
    }
};

function login(){
    let nameElem = document.getElementById("nameInp");
    let pswElem = document.getElementById("pswInp");

    let regObject = {
        "type":"loginObj",
        "data":{
            "username":nameElem.value,
            "password":pswElem.value
        }
    }
    ws.send(JSON.stringify(regObject));
};