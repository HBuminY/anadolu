let profileBtn = document.getElementById("profileBtn");
profileBtn.href = "/u/"+localStorage.getItem("username");

function menuClicked(){
    let navbar = document.getElementById("navbar");

    if(navbar.style.display=="block"){
        navbar.style.display="none";
    }else if(navbar.style.display=="none"){
        navbar.style.display="block";
    };
}

let usersArray;
fetch('/usrlist')
    .then(response => response.text())
    .then(data =>{
        usersArray = data.split(",");
        console.log(usersArray);
        
        let list = document.getElementById("users");
        for(let i=0; i<usersArray.length; i++){
            let li = document.createElement("li");
            li.appendChild(document.createTextNode(usersArray[i]));
            list.appendChild(li);
        }
    });