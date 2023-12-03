initializeFirebase()

function id(arg) {
    return document.getElementById(arg);
}

function initializeFirebase() {
    var config = {
        apiKey: "AIzaSyC_79ED3MbspytkUAI012iv-uRnqM3a7HU",
        authDomain: "mmoc-76047.firebaseapp.com",
        databaseURL: "https://mmoc-76047.firebaseio.com",
        storageBucket: "myStorageBocket",
        messagingSenderId: "idhere"
    };
    //initialize firebase  
    firebase.initializeApp(config);
}

Audio.prototype.playy = function () {
    let aud = this;
    if (aud.paused) {
        let promise = aud.play();
        if (promise !== undefined) {
            promise.catch(function (e) {});
        }
    } else {
        aud.pause();
        aud.currentTime = 0;
        let promise = aud.play();
        if (promise !== undefined) {
            promise.catch(function (e) {});
        }
    }
};
var audio = [new Audio("insulto1.wav"),
             new Audio("insulto2.wav"),
             new Audio("bellagiocata.wav"),
             new Audio("wow.wav")]

function playAudio(arg) {
    console.log("insulto1")
    audio[arg].playy();
}
id("a").onclick = function () {
    ref.child("audio").update({
        a: 1,
    });
}
id("b").onclick = function () {
    ref.child("audio").update({
        b: 1,
    });
}
id("c").onclick = function () {
    ref.child("audio").update({
        c: 1,
    });
}
id("d").onclick = function () {
    ref.child("audio").update({
        d: 1,
    });
}


/*
coordsDB
    ball
        x
        y
    players
        0
        1
    score
        0
        1

*/
var database = firebase.database();
var ref = database.ref("pong");
ref.on("value", gotData, errData);
var ready = false;
var coordsDB;
var callOnce = true;

function gotData(data) {
    coordsDB = data.val();
    coordsArr = Object.keys(data.val());
    ready = true;
    if (user == "a") {
        player2.retrieve();
    } else if (user == "b") {
        player1.retrieve();
    } else {
        player1.retrieve();
        player2.retrieve();
    }
    if (callOnce) {
        callOnce = false;
        init();
        player1.init();
        player2.init();
        loop();
    }
    // calls the loop once it got the data
}

function errData(err) {
    console.log("error");
    console.log(err);
}
/*
HOW TO UPDATE

ref.child("ball").update({
    x: 0,
    y: 0
});
ref.child("players").update({
    
});
ref.child("score").update({
    x: 2,
    y: 2
});
*/

// Game itself starts here

// Canvas
var canvas = document.getElementById("canvas");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
var c = canvas.getContext("2d");
var options = {
    fieldWidth: 600,
    fieldHeight: 400,
}
var user = "none";

function init() {
    if (coordsDB.players.active.a == 0) {
        user = "a";
        ref.child("players").child("active").update({
            a: 1
        });
        console.log("you are player ONE")
    } else if (coordsDB.players.active.b == 0) {
        user = "b";
        ref.child("players").child("active").update({
            b: 1
        });
        console.log("you are player TWO")
    } else {
        console.log("you are a spectator")
        ref.child("players").child("active").update({
            spect: coordsDB.players.active.spect + 1
        });
    }
    if (coordsDB.players.active.a == 1 && coordsDB.players.active.b == 1) {
        ref.child("score").update({
            a: 0,
            b: 0
        });
    }

}
window.addEventListener('beforeunload', (event) => {
    // Cancel the event as stated by the standard.
    event.preventDefault();
    // Older browsers supported custom message
    event.returnValue = '';
    switch (user) {
        case "a":
            ref.child("players").child("active").update({
                a: 0
            });
            break;
        case "b":
            ref.child("players").child("active").update({
                b: 0
            });
            break;
        default:
            ref.child("players").child("active").update({
                spect: coordsDB.players.active.spect - 1
            });
    }
});
class Field {
    constructor() {
        this.w = options.fieldWidth;
        this.h = options.fieldHeight;
        this.y = (canvas.height - this.h) / 2;
        this.x = (canvas.width - this.w) / 2;
    }
    render() {
        c.fillStyle = "lightgray";
        c.fillRect(this.x + map.x, this.y + map.y, this.w, this.h);
    }
}
var field = new Field();

class Player {
    constructor(whom) {
        this.x = 0;
        this.y = 0;
        this.h = options.fieldHeight / 6;
        this.w = 20;
        this.up = false;
        this.down = false;
        this.yVel = 0;
        this.accel = 1;
        this.speed = 10;
        this.whom = whom;
        this.color = this.whom == "a" ? "#4bad49" : "#c43939";
        this.color2 = this.whom == "a" ? "#62e35f" : "#eb4444";
        this.hitboxUp = {
            x: this.x,
            y: this.y,
            w: this.w,
            h: this.h / 5 * 2
        };
        this.hitboxMid = {
            x: this.x,
            y: this.y + this.h / 5 * 2,
            w: this.w,
            h: this.h / 5,
        }
        this.hitboxDown = {
            x: this.x,
            y: this.y + this.h / 5 * 3,
            w: this.w,
            h: this.h / 5 * 2,
        }
    }
    compute() {
        if (this.up) {
            if (this.yVel > -this.speed) {
                this.yVel -= this.accel;
            }
        }
        if (this.down) {
            if (this.yVel < this.speed) {
                this.yVel += this.accel;
            }
        }
        if (!this.up && !this.down) {
            if (this.yVel > 0) {
                this.yVel -= this.accel;
            }
            if (this.yVel < 0) {
                this.yVel += this.accel;
            }
        }
        this.y += this.yVel;
        if (this.y < field.y) {
            this.y = field.y;
        } else if (this.y + this.h > field.y + field.h) {
            this.y = field.y + field.h - this.h;
        }
        this.hitboxUp.y = this.y;
        this.hitboxMid.y = this.y + this.h / 5 * 2;
        this.hitboxDown.y = this.y + this.h / 5 * 3;
    }
    render() {
        c.fillStyle = this.color;
        c.fillRect(this.x, this.y, this.w, this.h);
    }
    init() {
        if (this.whom == "a") {
            this.x = field.x;
        }
        if (this.whom == "b") {
            this.x = field.x - this.w + field.w;
        }
    }
    retrieve() {
        switch (user) {
            case "a":
                this.y = coordsDB.players.b + field.y;
                break;
            case "b":
                this.y = coordsDB.players.a + field.y;
                break;
        }
    }
}
var player1 = new Player("a");
var player2 = new Player("b");

document.getElementById("button").onclick = function () {
    ball.init();
}
class Ball {
    constructor() {
        this.w = 10;
        this.h = 10;
        this.x = field.x + field.w / 2 - this.h / 2;
        this.y = field.y + field.h / 2 - this.h / 2;
        this.xVel = 0;
        this.yVel = 0;
        this.speed = 5;
    }
    render() {
        c.fillStyle = "#445280";
        c.fillRect(this.x, this.y, this.w, this.h);

    }
    compute() {
        this.x += this.xVel;
        this.y += this.yVel;

    }
    colCheck() {
        //field colCheck
        if (this.x + this.w > field.x + field.w) {
            if (lineRect(
                    this.prevCenterX,
                    this.prevCenterY,
                    this.centerX,
                    this.centerY,
                    player2.x,
                    player2.y,
                    player2.w,
                    player2.h)) {
                explosion(ball);
                this.xVel = -this.xVel;
                this.x = player2.x - this.w - 1;
                ref.child("ball").update({
                    xVel: parseFloat((this.xVel * 1.05).toFixed(2)),
                    yVel: parseFloat((this.xVel * 1.05).toFixed(2)),
                    x: this.x - field.x
                });
                ref.update({
                    computing: "a"
                });
                coordsDB.computing = "a";
                computing = "a";
                return;
            } else {
                ref.child("score").update({
                    a: coordsDB.score.a + 1,
                });
                ball.init();
            }
        } else if (this.x < field.x) {
            if (lineRect(
                    this.prevCenterX,
                    this.prevCenterY,
                    this.centerX,
                    this.centerY,
                    player1.x,
                    player1.y,
                    player1.w,
                    player1.h)) {
                explosion(ball);
                this.xVel = -this.xVel;
                this.x = player1.x + player1.w + 1;
                ref.child("ball").update({
                    xVel: parseFloat((this.xVel * 1.05).toFixed(2)),
                    yVel: parseFloat((this.xVel * 1.05).toFixed(2)),
                    x: this.x - field.x
                });
                computing = "b";
                coordsDB.computing = "b";
                ref.update({
                    computing: "b"
                });
                return;

            } else {
                ref.child("score").update({
                    b: coordsDB.score.b + 1,
                });
                ball.init();
            }
        }
        if (this.y < field.y) {
            this.y = field.y;
            this.yVel = -this.yVel;
            ref.child("ball").update({
                yVel: parseFloat((this.yVel).toFixed(2))
            });
            explosion(ball);
        } else if (this.y + this.h > field.y + field.h) {
            this.y = field.y + field.h - this.h;
            this.yVel = -this.yVel;
            ref.child("ball").update({
                yVel: parseFloat((this.yVel).toFixed(2))
            });
            explosion(ball);
        }
        if (collided(this, player1)) {
            computing = "b";
            coordsDB.computing = "b";
            ref.update({
                computing: "b"
            });
            if (this.xVel < 0) {
                if (collided(this, player1.hitboxMid)) {
                    this.yVel / 2;
                } else if (collided(this, player1.hitboxUp)) {
                    if (this.yVel < 0) {
                        this.yVel *= 2;
                    }
                    if (this.yVel > 0) {
                        this.yVel = -this.yVel;
                    }
                } else if (collided(this, player1.hitboxDown)) {
                    if (this.yVel < 0) {
                        this.yVel = -this.yVel;
                    }
                    if (this.yVel > 0) {
                        this.yVel *= 2;
                    }
                }
                this.xVel = -this.xVel;
                this.x = player1.x + player1.w + 1;
                ref.child("ball").update({
                    xVel: parseFloat((this.xVel * 1.05).toFixed(2)),
                    yVel: parseFloat((this.xVel * 1.05).toFixed(2)),
                    x: this.x - field.x
                });
                explosion(ball);
            }
        } else if (collided(this, player2)) {
            computing = "a";
            coordsDB.computing = "a";
            ref.update({
                computing: "a"
            });
            if (this.xVel > 0) {
                if (collided(this, player2.hitboxMid)) {
                    this.yVel / 2;
                } else if (collided(this, player2.hitboxUp)) {
                    if (this.yVel < 0) {
                        this.yVel *= 2;
                    }
                    if (this.yVel > 0) {
                        this.yVel = -this.yVel;
                    }
                } else if (collided(this, player2.hitboxDown)) {
                    if (this.yVel < 0) {
                        this.yVel = -this.yVel;
                    }
                    if (this.yVel > 0) {
                        this.yVel *= 2;
                    }
                }
                this.xVel = -this.xVel;
                this.x = player2.x - this.w - 1;
                ref.child("ball").update({
                    xVel: parseFloat((this.xVel * 1.05).toFixed(2)),
                    yVel: parseFloat((this.xVel * 1.05).toFixed(2)),
                    x: this.x - field.x
                });
                explosion(ball);
            }
        }
    }
    init() {
        if (user == "a" || user == "b") {
            this.x = field.x + field.w / 2 - this.h / 2;
            this.y = field.y + field.h / 2 - this.h / 2;
            this.xVel = (user == "a") ? -this.speed : this.speed;
            this.yVel = Math.random() * this.speed - this.speed / 2;
            ref.child("ball").update({
                x: parseFloat((this.x - field.x).toFixed(2)),
                y: parseFloat((this.y - field.y).toFixed(2)),
                xVel: parseFloat((this.xVel).toFixed(2)),
                yVel: parseFloat((this.yVel).toFixed(2))
            });
            ref.update({
                computing: user
            });
            coordsDB.ball = {
                x: parseFloat((this.x - field.x).toFixed(2)),
                y: parseFloat((this.y - field.y).toFixed(2)),
                xVel: parseFloat((this.xVel).toFixed(2)),
                yVel: parseFloat((this.yVel).toFixed(2))
            }
        }
    }
}
var ball = new Ball();
var map = {
    x: 0,
    y: 0
}
var shake = 0;
class Score {
    constructor() {
        this.increase = 0;
        this.baseFontSize = 30;
        this.prevScoreA = 0;
        this.prevScoreB = 0;
    }
    render() {
        if (this.prevScoreA !== coordsDB.score.a) {
            this.prevScoreA = coordsDB.score.a;
            this.increase = 8;
        }
        if (this.prevScoreB !== coordsDB.score.b) {
            this.prevScoreB = coordsDB.score.b;
            this.increase = 8;
        }
        c.font = this.baseFontSize + this.increase + 'pt "Press Start 2P"';
        c.textAlign = 'center';
        c.fillStyle = 'black';
        c.fillText(coordsDB.score.a + ' | ' + coordsDB.score.b, canvas.width / 2, field.y / 2 + 30);

        c.font = '18pt "Press Start 2P"';
        c.fillStyle = '#4bad49';
        c.textAlign = 'left';
        if (coordsDB.players.active.a) {
            c.fillText('Player ONE', field.x, field.y + field.h + 30);
        }

        c.strokeText('Player ONE', field.x, field.y + field.h + 30);
        c.fillStyle = '#c43939';

        c.textAlign = 'right';
        if (coordsDB.players.active.b) {
            c.fillText('Player TWO', field.x + field.w, field.y + field.h + 30);
        }
        c.strokeText('Player TWO', field.x + field.w, field.y + field.h + 30);

        c.fillStyle = 'black';
        c.font = '14pt "Press Start 2P"';
        c.textAlign = 'center';
        c.fillText('spectators: ' + coordsDB.players.active.spect, canvas.width / 2, field.y + field.h + 60);

        if (this.increase) {
            this.increase -= 2;
        }
    }
}

var score = new Score();
var computing = "a";
var prevBallX = ball.x;

function loop() {
    setTimeout(loop, 1000 / 30);
    if (coordsDB.audio.a) {
        playAudio(0);
        coordsDB.audio.a = 0;
        ref.child("audio").update({
            a: 0,
        });
    }
    if (coordsDB.audio.b) {
        playAudio(1);
        coordsDB.audio.b = 0;
        ref.child("audio").update({
            b: 0,
        });
    }
    if (coordsDB.audio.c) {
        playAudio(2);
        coordsDB.audio.c = 0;
        ref.child("audio").update({
            c: 0,
        });
    }
    if (coordsDB.audio.d) {
        playAudio(3);
        coordsDB.audio.d = 0;
        ref.child("audio").update({
            d: 0,
        });
    }
    computing = coordsDB.computing;
    prevBallX = ball.x;
    c.clearRect(0, 0, canvas.width, canvas.height);
    c.fillStyle = "darkgray"
    c.fillRect(0, 0, canvas.width, canvas.height);
    if (shake) {
        shake--;
        map.x = Math.random() * 8 - 4;
        map.y = Math.random() * 8 - 4;
    } else {
        map.x = 0;
        map.y = 0;
    }
    field.render();
    switch (user) {
        case "a":
            player1.compute();
            break;
        case "b":
            player2.compute();
            break;
        default:
            player1.y = coordsDB.players.a + field.y;
            player2.y = coordsDB.players.b + field.y;
    }
    if (user == computing) {
        ball.compute();
        ball.colCheck();
        ref.child("ball").update({
            x: parseFloat((ball.x - field.x).toFixed(2)),
            y: parseFloat((ball.y - field.y).toFixed(2)),
            xVel: coordsDB.ball.xVel,
            yVel: coordsDB.ball.yVel
        });
    } else {
        ball.x = coordsDB.ball.x + field.x;
        ball.y = coordsDB.ball.y + field.y;
        let prevxVel = ball.xVel;
        let prevyVel = ball.yVel;
        ball.xVel = coordsDB.ball.xVel;
        ball.yVel = coordsDB.ball.yVel;
        if (prevxVel !== ball.xVel || prevyVel !== ball.yVel) {
            explosion(ball);
        }
    }
    if (user == "a") {
        ref.child("players").update({
            a: parseFloat((player1.y - field.y).toFixed(2))
        });
    } else if (user == "b") {
        ref.child("players").update({
            b: parseFloat((player2.y - field.y).toFixed(2))
        });
    }
    ball.render();
    player1.render();
    player2.render();
    score.render();
    renderParticles();
}

var particles = [];

function explosion(bullet) {
    shake = 4;
    var color = "#445280";
    var x = bullet.x;
    var y = bullet.y;
    var speedX = (-bullet.xVel / 3) * (bullet.speed / 3);
    var speedY = (-bullet.yVel / 3) * (bullet.speed / 3);
    var randNum = Math.floor(Math.random() * 15) + 1;
    for (iter = 0; iter < randNum; iter++) {
        particles.push({
            xVel: Math.random() * ((bullet.x < 0 || bullet.x + bullet.size > canvas.width) ? (speedX * 0.8) : (-speedX * 0.8)),
            yVel: Math.random() * ((bullet.x < 0 || bullet.x + bullet.size > canvas.width) ? (-speedY * 0.8) : (speedY * 0.8)),
            x: x,
            y: y,
            size: Math.random() * bullet.w,
            color: color
        });
    }
}

function renderParticles() {
    for (i = 0; i < particles.length; i++) {
        c.fillStyle = particles[i].color;
        c.fillRect(
            particles[i].x,
            particles[i].y,
            particles[i].size,
            particles[i].size);

        particles[i].x += particles[i].xVel;
        particles[i].y += particles[i].yVel;
        particles[i].xVel /= 1.02;
        particles[i].yVel /= 1.02;
        particles[i].size /= 1.05;
        if (particles[i].size < 0.1) {
            particles.splice(i, 1);
        }
    }
}

var activity = true;

function timer() {
    if (activity) {
        activity = 0;
    }else{
        disconnect(user);
        alert("Sei stato disconnesso per inattività :(");
    }
}



setInterval(timer, 30000);
document.addEventListener("keydown", function (evt) {
    activity = true;
    switch (evt.keyCode) {
        //up
        case 87:
        case 38:
            if (user == "a") {
                player1.up = true;
            }
            if (user == "b") {
                player2.up = true;
            }
            break;
            //down
        case 83:
        case 40:
            if (user == "a") {
                player1.down = true;
            }
            if (user == "b") {
                player2.down = true;
            }
            break;
    }
})

function disconnect(who) {
    switch (who) {
        case "a":
            ref.child("players").child("active").update({
                a: 0
            });
            break;
        case "b":
            ref.child("players").child("active").update({
                a: 0
            });
            break;

    }
}
document.addEventListener("keyup", function (evt) {
    switch (evt.keyCode) {
        //up
        case 87:
        case 38:
            if (user == "a") {
                player1.up = false;
            }
            if (user == "b") {
                player2.up = false;
            }
            break;
            //down
        case 83:
        case 40:
            if (user == "a") {
                player1.down = false;
            }
            if (user == "b") {
                player2.down = false;
            }
            break;
    }
})

function collided(a, b) {
    var square1 = a.hitbox ? a.hitbox : a;
    var square2 = b.hitbox ? b.hitbox : b;
    if (square1.x < square2.x + square2.w) {
        if (square1.x + square1.w > square2.x) {
            if (square1.y < square2.y + square2.h) {
                if (square1.y + square1.h > square2.y) {
                    return true;
                }
            }
        }
    }
    return false;
}



// LINE/RECTANGLE (float x1, float y1, float x2, float y2, float rx, float ry, float rw, float rh)
function lineRect(x1, y1, x2, y2, rx, ry, rw, rh) {
    // check if the line has hit any of the rectangle's sides
    // uses the Line/Line function below
    let left = lineLine(x1, y1, x2, y2, rx, ry, rx, ry + rh);
    let right = lineLine(x1, y1, x2, y2, rx + rw, ry, rx + rw, ry + rh);
    let top = lineLine(x1, y1, x2, y2, rx, ry, rx + rw, ry);
    let bottom = lineLine(x1, y1, x2, y2, rx, ry + rh, rx + rw, ry + rh);

    // if ANY of the above are true, the line
    // has hit the rectangle
    if (left || right || top || bottom) {
        return true;
    }
    return false;
}


// LINE/LINE (float x1, float y1, float x2, float y2, float x3, float y3, float x4, float y4)
function lineLine(x1, y1, x2, y2, x3, y3, x4, y4) {

    // calculate the direction of the lines
    let uA = ((x4 - x3) * (y1 - y3) - (y4 - y3) * (x1 - x3)) / ((y4 - y3) * (x2 - x1) - (x4 - x3) * (y2 - y1));
    let uB = ((x2 - x1) * (y1 - y3) - (y2 - y1) * (x1 - x3)) / ((y4 - y3) * (x2 - x1) - (x4 - x3) * (y2 - y1));

    // if uA and uB are between 0-1, lines are colliding
    if (uA >= 0 && uA <= 1 && uB >= 0 && uB <= 1) {
        return true;
    }
    return false;
}
