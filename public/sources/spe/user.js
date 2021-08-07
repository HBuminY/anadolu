let profElem = document.getElementById("userProfile");
let profName = window.location.href.split("/").pop();
let url = "/get/userdata&"+profName;
fetch(url)
    .then(response => response.json())
    .then(
        (data)=>{
            if(data.err==""){
                profElem.innerText=
                `
                Profile Name : ${profName}
                \n
                Traveller Points : ${data.tpoint}
                `;
            }else{
                console.log(data.err);

                profElem.innerText=
                `
                Profile Doesn't Exist
                `;
            }
        }
    );

function menuClicked(){
    let navbar = document.getElementById("navbar");

    if(navbar.style.display=="block"){
        navbar.style.display="none";
    }else if(navbar.style.display=="none"){
        navbar.style.display="block";
    };
}