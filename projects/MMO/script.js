//canvas
var canvas = document.getElementById("canvas");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
var c = canvas.getContext("2d");
var user = {
    name: prompt("Enter your name", ""),
    y: 50,
    x: 50,
    key: "",
    L: false,
    R: false,
    T: false,
    B: false,
    speed: 3,
    accel: 0.25,
    xVel: 0,
    yVel: 0,
    size: 20
}
var coordsArr;

// Initialize Firebase
var config = {
    apiKey: "AIzaSyC_79ED3MbspytkUAI012iv-uRnqM3a7HU",
    authDomain: "mmoc-76047.firebaseapp.com",
    databaseURL: "https://mmoc-76047.firebaseio.com",
    projectId: "mmoc-76047",
    storageBucket: "",
    messagingSenderId: "816334987093"
};

firebase.initializeApp(config);
var database = firebase.database();
var ref = database.ref("coords");
console.log(database.ref("coords"));
ref.on("value", gotData, errData);
var ready = false;

function gotData(data) {
    coordsDB = data.val();
    coordsArr = Object.keys(data.val());
    console.log("data exchange" + coordsArr)
    onlyOneName();
    ready = true;
    // calls the loop once it got the data
}

// "registers" the player
function onlyOneName() {
    var samename = false;
    for (var i = 0; i < coordsArr.length; i++) {
        console.log(coordsDB[coordsArr[i]].name)
        if (user.name == coordsDB[coordsArr[i]].name) {
            if (samename) {
                ref.child(coordsArr[i]).remove();
            }
            samename = true;
            user.key = coordsArr[i];
            user.x = coordsDB[coordsArr[i]].x
            user.y = coordsDB[coordsArr[i]].y
        }
    }
    if (!samename) {
        ref.push({
            name: user.name,
            x: user.x,
            y: user.y
        })
    }
}

function errData(err) {
    console.log("error");
    console.log(err);
}
document.onclick = function (event) {
    x = event.clientX;
    y = event.clientY;
    /*
    if(coordsArr)
    var data = {
        name: name,
        x: x,
        y: y
    }
    ref.push(data);
*/
}

requestAnimationFrame(loop);

function loop() {
    c.clearRect(0, 0, canvas.width, canvas.height);
    if (ready) {
        for (var i = 0; i < coordsArr.length; i++) {
            var players = coordsDB[coordsArr[i]];
            if (coordsArr[i] == user.key) {
                drawPlayer();
            } else {
                c.fillRect(players.x, players.y, 20, 20);
                c.fillText(players.name, players.x - 10, players.y - 10);
            }
        }
    }
    requestAnimationFrame(loop);
}

function drawPlayer() {
    directionCheck();
    user.x += user.xVel;
    user.y += user.yVel;
    /*
            if (player.x>canvas.width){player.x=-player.size;}
            if (player.x<-player.size){player.x=canvas.width}
            if (player.y>canvas.height){player.y=-player.size;}
            if (player.y<-player.size){player.y=canvas.height}*/
    if (user.x > canvas.width) {
        user.x = -user.size;
        newRoom();
    }
    if (user.x < -user.size) {
        user.x = canvas.width;
        newRoom();
    }
    if (user.y > canvas.height) {
        user.y = -user.size;
        newRoom();
    }
    if (user.y < -user.size) {
        user.y = canvas.height;
        newRoom();
    }
    ref.child(user.key).update({
        x: user.x
    });
    ref.child(user.key).update({
        y: user.y
    });
    c.fillRect(user.x, user.y, 20, 20);
    c.fillText(user.name, user.x - 10, user.y - 10);
}

function directionCheck() {
    if (user.L || user.R) {
        if (user.R && user.xVel < user.speed) {
            user.xVel += user.accel;
        }
        if (user.L && user.xVel > -user.speed) {
            user.xVel -= user.accel;
        }
    } else {
        if (user.xVel !== 0) {
            (user.xVel > 0) ? user.xVel -= user.accel / 4: user.xVel += user.accel / 4;
        }
    }
    if (user.B || user.T) {
        if (user.B && user.yVel < user.speed) {
            user.yVel += user.accel;
        }
        if (user.T && user.yVel > -user.speed) {
            user.yVel -= user.accel;
        }
    } else {
        if (user.yVel !== 0) {
            (user.yVel > 0) ? user.yVel -= user.accel / 4: user.yVel += user.accel / 4;
        }
    }
}

window.addEventListener("keydown", function (event) {
    var key = event.keyCode;
    switch (key) {
        case 65: //left key down
            user.L = true;
            break;
        case 68: //right key down
            user.R = true;
            break;
        case 87: //top key down
            user.T = true;
            break;
        case 83: //bot key down
            user.B = true;
            break;
    }
});
window.addEventListener("keyup", function (event) {
    var key = event.keyCode;
    switch (key) {
        case 65: //left key down
            user.L = false;
            break;
        case 68: //right key down
            user.R = false;
            break;
        case 87: //top key down
            user.T = false;
            break;
        case 83: //bot key down
            user.B = false;
            break;
    }
});
