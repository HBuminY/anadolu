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
    let notify = document.getElementById("notify");
    try {
        data = JSON.parse(data);
        console.log(data);

        if(data.type=="registered"){
            notify.style.color="green"
            notify.innerText="Your Account is Succesfully Created"
        }else if(data.type=="unvalid regObj"){
            notify.style.color="red"
            notify.innerText=data.errArr.toString().replace(/,/g, "\n")
        };
    } catch (err) {
        console.log(err);
    }
};

function register(){
    let nameElem = document.getElementById("nameInp");
    let pswElem = document.getElementById("pswInp");
    let emailElem = document.getElementById("emailInp");

    let regObject = {
        "type":"regObj",
        "data":{
            "username":nameElem.value,
            "password":pswElem.value,
            "email":emailElem.value
        }
    }
    pswElem.value="";
    ws.send(JSON.stringify(regObject));
};