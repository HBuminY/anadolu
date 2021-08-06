if(localStorage.getItem("id")===null){
    window.location.replace("/");
}

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