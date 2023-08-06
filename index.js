const loginForm = document.getElementById("login-form");
const loginButton = document.getElementById("login-form-submit");
const loginErrorMsg = document.getElementById("login-error-msg");

loginButton.addEventListener("click", (e) => {
    e.preventDefault();
    const username = loginForm.username.value;
    const password = loginForm.password.value;

    if (username === "guest" && password === "guest") {
        location.href = "login"
    } else {
        loginErrorMsg.style.opacity = 1;
    }
})

function selects(){  
    var ele = document.getElementsByName('cb');  
    for(var i=0; i<ele.length; i++){  
        if(ele[i].type=='checkbox')  
            ele[i].checked=true;  
    }  
}  
function deSelect(){  
    var ele = document.getElementsByName('cb');  
    for(var i=0; i<ele.length; i++){  
        if(ele[i].type=='checkbox')  
            ele[i].checked=false;  
    } 
}

function generate() {
    let min = Number(document.getElementById('minRange').value);
    let max = Number(document.getElementById('maxRange').value);
    
    for (let i = 1; i < 6; i++) {
        let input = document.getElementById('input' + i).value;
        if (input !== '') {
            let mult = (Math.random() * (max - min) + min) * .01 ;
            let output = (input * mult).toFixed(2)
            document.getElementById('output' + i).value = output;
        }
    }
    
}

