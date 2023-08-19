const loginForm = document.getElementById("login-form");
const loginButton = document.getElementById("login-form-submit");
const loginErrorMsg = document.getElementById("login-error-msg");

if (loginButton) {
    loginButton.addEventListener("click", (e) => {
    e.preventDefault();
    const username = loginForm.username.value;
    const password = loginForm.password.value;

    if (username === "guest" && password === "guest") {
      location.href = "login";
    } else {
      loginErrorMsg.style.opacity = 1;
    }
  });
}

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
            let output = (input * mult).toFixed(2);
            document.getElementById('output' + i).value = output;
        }
    }
}

async function submitTips() {
  const data = {};
  for (let i = 1; i < 6; i++) {
    let output = document.getElementById('output' + i).value;
    let id = document.getElementById('id' + i).value;
    if (output !== '' && id !== '') {
      data[id] = output;
    } 
  }
  try {
    await fetch("http://localhost:3000/simulation", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    });
    window.location.href = "login";
  } catch (e) {
    console.error(e);
  }
}

const lists = document.getElementsByClassName("list");
const left = document.getElementById("left");
const right = document.getElementById("right");
const middle = document.getElementById("middle");

if (lists.length > 0 && left && right) {
  for (let list of lists) {
    list.addEventListener("dragstart", function (e) {
      let selected = e.target;

      right.addEventListener("dragover", function (e) {
        e.preventDefault();
      });
      right.addEventListener("drop", function (e) {
        right.appendChild(selected);
        selected = null;
      });
      left.addEventListener("dragover", function (e) {
        e.preventDefault();
      });
      left.addEventListener("drop", function (e) {
        left.appendChild(selected);
        selected = null;
      });
      if(middle) {
          middle.addEventListener("dragover", function (e) {
              e.preventDefault();
            });
            middle.addEventListener("drop", function (e) {
                middle.appendChild(selected);
                selected = null;
            });
        }
    });
  }
}

function next() {
    let middle = document.getElementById("middle");
    let waitress = middle.querySelectorAll("div.list");
    let waitressStorage = [];
    for (const element of waitress) {
        waitressStorage.push(element.getAttribute("data-value"))
    }
    localStorage.setItem("waitress", JSON.stringify(waitressStorage));

    let right = document.getElementById("right");
    let party = right.querySelectorAll("div.list");
    let partyStorage = [];
    for (const element of party) {
        partyStorage.push(element.getAttribute("data-value"))
    }
    localStorage.setItem("party", JSON.stringify(partyStorage));

    
    window.location.href = "otherWorkers";
}

async function submitData() {
    let right = document.getElementById("right");
    let workers = right.querySelectorAll("div.list");
    let workerStorage = [];
    for (const element of workers) {
        workerStorage.push(element.getAttribute("data-value"));
    }
    let waitressStorage = JSON.parse(localStorage.getItem("waitress"));
    let partyStorage = JSON.parse(localStorage.getItem("party"));

    const data = {
        waitress: waitressStorage,
        party: partyStorage,
        workers: workerStorage
    };
    try {
        await fetch("http://localhost:3000/otherWorkers", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(data)
        });
        window.location.href = "login";
      } catch (e) {
        console.error(e);
      }
}