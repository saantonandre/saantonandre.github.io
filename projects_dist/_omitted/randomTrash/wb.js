var mobile = confirm("\"Ok\" if you are on mobile ");
var testMode;
if (mobile) {
    testMode = 0;
} else {
    testMode = 1;
}
window.onload = function () {
    var canvas = document.getElementById("canvas");
    var c = canvas.getContext("2d");
    var controls = document.getElementById("div2");
    controls.innerHTML = "<div class=\"btns\" id=\"leftKey\"><div id=\"child\"><img src=\"https://image.flaticon.com/icons/svg/76/76846.svg\" alt=\"jump\"></div></div><div class=\"btns\" id=\"rightKey\"><div id=\"child\"><img src=\"https://image.flaticon.com/icons/svg/76/76846.svg\" alt=\"jump\"></div></div><div class=\"btns\" id=\"upKey\"><div id=\"child\"><img src=\"https://image.flaticon.com/icons/svg/76/76721.svg\" alt=\"jump\"></div></div><div class=\"btns\" id=\"shoot\"><div id=\"child\"><img src=\"https://image.flaticon.com/icons/svg/64/64985.svg\" alt=\"jump\"></div></div>";
    var leftKey = document.getElementById("leftKey");
    var rightKey = document.getElementById("rightKey");
    var upKey = document.getElementById("upKey");
    var shootKey = document.getElementById("shoot");
    var g = 0;
    var yd = 0;
    var d = 3;
    var x = 100;
    var y = 280;
    var gunX = 8;
    var isJumping = false;
    var bt = x;
    var badx = 400;
    var bul = [];
    var cattivi = [];
    var direction = [];
    var bulForce = 1.5;
    //https://image.flaticon.com/icons/svg/76/76865.svg

    class player {
        constructor(x, y, gunX) {
            //cap
            this.fillStyle = c.fillStyle = "#ff5622";
            this.fillRect = c.fillRect(x + 0, y + 0 - 60, 10, 10);
            this.fillStyle = c.fillStyle = "#ff5622";
            this.fillRect = c.fillRect(x + 0, y + 10 - 60, 10, 10);
            this.fillStyle = c.fillStyle = "#ff5622";
            this.fillRect = c.fillRect(x + 10, y + 10 - 60, 10, 10);
            this.fillStyle = c.fillStyle = "#ff5622";
            this.fillRect = c.fillRect(x + -10, y + 10 - 60, 10, 10);
            //head
            this.fillStyle = c.fillStyle = "#ffcdd2";
            this.fillRect = c.fillRect(x + 0, y + 20 - 60, 10, 10);
            //shirt
            this.fillStyle = c.fillStyle = "#b39ddb";
            this.fillRect = c.fillRect(x + 0, y + 30 - 60, 10, 10);
            //gun
            this.fillStyle = c.fillStyle = "#555";
            this.fillRect = c.fillRect(x + gunX, y + 31 - 60, 12, 6);
            //pants
            this.fillStyle = c.fillStyle = "#ff9900";
            this.fillRect = c.fillRect(x + 0, y + 40 - 60, 10, 10);
            this.fillStyle = c.fillStyle = "#ff9900";
            this.fillRect = c.fillRect(x + 0, y + 50 - 60, 10, 10);
            this.stroke = c.stroke();
        }
    }

    class bg {
        constructor() {
            //sky
            this.fillStyle = c.fillStyle = "#3ab57a";
            this.fillRect = c.fillRect(0, 0, 900, 300);
            //rocks
            this.fillStyle = c.fillStyle = "#a37630";
            this.fillRect = c.fillRect(0, 100, 900, 200);
            this.fillStyle = c.fillStyle = "#b27418";
            this.fillRect = c.fillRect(0, 125, 900, 175);
            //sand
            this.fillStyle = c.fillStyle = "#ccdc39";
            this.fillRect = c.fillRect(0, 150, 900, 150);
            //sun
            this.fillStyle = c.fillStyle = "#eeff00";
            this.fillRect = c.fillRect(130, 0, 40, 40);
            //cactus
            this.fillStyle = c.fillStyle = "#2ba818";
            this.fillRect = c.fillRect(130, 170, 10, 60);
            this.fillRect = c.fillRect(140, 190, 20, 10);
            this.fillRect = c.fillRect(150, 180, 10, 10);

            this.fillRect = c.fillRect(330, 170, 10, 60);
            this.fillRect = c.fillRect(310, 190, 20, 10);
            this.fillRect = c.fillRect(310, 180, 10, 10);


            this.fillRect = c.fillRect(460, 170, 10, 60);
            this.fillRect = c.fillRect(470, 190, 20, 10);
            this.fillRect = c.fillRect(480, 180, 10, 10);
            this.fillRect = c.fillRect(440, 190, 20, 10);
            this.fillRect = c.fillRect(440, 200, 10, 10);

            this.fillRect = c.fillRect(520, 140, 10, 40);

            this.fillRect = c.fillRect(80, 140, 10, 50);
            this.stroke = c.stroke();
        }
    }

    class bullet {
        constructor(x) {
            this.fillStyle = c.fillStyle = "yellow";
            this.fillRect = c.fillRect(x, 252, 5, 5);
            this.stroke = c.stroke();
        }
    }

    class bad {
        constructor(x) {
            this.fillStyle = c.fillStyle = "black";
            this.fillRect = c.fillRect(x, 220, 20, 60);
            this.stroke = c.stroke();
        }
    }

    function shoot() {
        if (!isJumping) {
            this.x = x;
            this.to = gunX == 8; //bool
            if (this.to) {
                this.dir = 6;
            } else {
                this.dir = -6;
            }
            bul.push(this.x);
            direction.push(this.dir);
        }
    }

    function shootK() {
        shoot();
    }
    var whichOne;
    setInterval(spawn, 3000);

    function spawn() {
        cattivi.push(Math.floor(Math.random() * 1800));
    }
    var mouseDown = 0;

    if (!testMode) {
        document.body.ontouchstart = function () {
            ++mouseDown;
        }
        document.body.ontouchend = function () {
            --mouseDown;
        }
        requestAnimationFrame(loop);

        leftKey.addEventListener("touchstart", function () {
            whichOne = "L"
        });
        rightKey.addEventListener("touchstart", function () {
            whichOne = "R"
        });
        upKey.addEventListener("touchstart", function () {
            whichOne = "U"
        });
        shootKey.addEventListener("click", function () {
            whichOne = "s";
            shootK();
        });
    } else if (testMode) {

        document.body.onmousedown = function () {
            ++mouseDown;
        }
        document.body.onmouseup = function () {
            --mouseDown;
        }
        requestAnimationFrame(loop);

        leftKey.addEventListener("mousedown", function () {
            whichOne = "L"
            console.log(x);
        });
        rightKey.addEventListener("mousedown", function () {
            whichOne = "R"
        });
        upKey.addEventListener("mousedown", function () {
            whichOne = "U"
        });
        shootKey.addEventListener("click", function () {
            whichOne = "s";
            shootK();
        });

    }
    //MAIN LOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOP
    function loop() {
        c.clearRect(0, 0, 900, 300);
        c.clearRect(1350, 0, 450, 300);
        //300 canvas ACTUAL width:
        //450 canvas INGAME width
        if (x < 450)
            canvas.style.marginLeft = "0";
        if (x > 450 && x < 900)
            canvas.style.marginLeft = "-300px";
        if (x > 900 && x < 1350)
            canvas.style.marginLeft = "-600px";
        if (x > 1350)
            canvas.style.marginLeft = "-900px";

        //render
        var big = new bg();

        for (i = 0; i < cattivi.length; i++) {
            var cattivo = new bad(cattivi[i]);
            if (cattivi[i] > x)
                cattivi[i] -= 0.3;
            else
                cattivi[i] += 0.3;
        }

        for (j = 0; j < bul.length; j++) {
            var obj = new bullet(bul[j] += direction[j]);
            for (i = 0; i < cattivi.length; i++) {
                if (bul[j] > cattivi[i] && bul[j] < cattivi[i] + 40 && direction[j] > 0) {
                    cattivi[i] += bulForce;
                    if (bul[j] > cattivi[i] + 20)
                        delete bul[j];
                }

                if (bul[j] > cattivi[i] && bul[j] < cattivi[i] + 40 && direction[j] < 0) {
                    cattivi[i] -= bulForce;
                    if (bul[j] < cattivi[i] + 20)
                        delete bul[j];
                }
            }
            if (bul[j] < -10)
                delete bul[j];
        }

        if (mouseDown) {
            switch (whichOne) {
                case "L":
                    x -= d;
                    gunX = -8;
                    break;
                case "R":
                    x += d;
                    gunX = 8;
                    break;
                case "U":
                    if (!isJumping)
                        isJumping = true;
                    break;
            }
        } else whichOne = "";

        var boy = new player(x, y, gunX);

        if (isJumping) {
            yd = 10;
        }


        y += g;
        y -= yd;
        if (isJumping)
            g++;
        else g = 0;
        if (y > 280) {
            yd = 0;
            y = 280;
            isJumping = false;
        }


        requestAnimationFrame(loop);
    }

}
