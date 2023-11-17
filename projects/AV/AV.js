window.onload = function () {
    var canvas = document.getElementById("area2");
    var c = canvas.getContext("2d");
    var red = document.getElementById("red");
    var yellow = document.getElementById("yellow");
    var lightblue = document.getElementById("lightblue");
    var orange = document.getElementById("orange");
    var green = document.getElementById("green");
    var pink = document.getElementById("pink");
    var load = document.getElementById("load");
    var start = document.getElementById("start");
    var logo = document.getElementById("logo-animation");
    var cs = getComputedStyle(canvas);
    var width = parseInt(cs.getPropertyValue('width'), 10);
    var height = parseInt(cs.getPropertyValue('height'), 10);
    var cols1 = ['#e01d1c', '#ddd02b', '#2ab3a6']
    var cols2 = ['#ee7e1c', '#71b634', '#e5518d']
    var y1 = [];
    var col1 = [];
    var height1 = [];
    var y2 = [];
    var col2 = [];
    var height2 = [];
    var speed = 1.5;
    var white = "white"
    var door1 = white;
    var door2 = white;
    var livesSrc = document.getElementById("lives");
    var lives = 500;
    var score = 0;
    var pts = document.getElementById("points");
    var once = 0;
    canvas.width = width;
    canvas.height = height;

    start.onclick = function () {
        document.body.style.backgroundColor = "white";
        logo.style.display = "none";
        load.style.display = "block";
        start.style.display = "none";
        requestAnimationFrame(loop);
        spawn1();
        spawn2();
    }

    function tchStart(x) {
        x.style.width = '90%';
        x.style.marginLeft = '5%';
        x.style.filter = 'brightness(1.5)';
        window.navigator.vibrate(100);

    }

    function tchEnd(x) {
        x.style.width = '70%';
        x.style.marginLeft = '15%';
        x.style.filter = 'brightness(1)';
    }
    var easy = [3000, 1200];
    var normal = [2000, 800];
    var hard = [1500, 500];
    var difficulty = easy;

    function spawn1() {
        y1.push(-(canvas.width / 4))
        col1.push(cols1[Math.floor(Math.random() * 3)]);
        height1.push(canvas.width / 3);
        setTimeout(spawn1, Math.floor(Math.random() * difficulty[0]) + difficulty[1]);
    }

    function spawn2() {
        y2.push(-(canvas.width / 4))
        col2.push(cols2[Math.floor(Math.random() * 3)]);
        height2.push(canvas.width / 3);
        setTimeout(spawn2, Math.floor(Math.random() * difficulty[0]) + difficulty[1]);
    }
    //                              MOBILE CONTROLS
    red.ontouchstart = function () {
        tchStart(red);
        door1 = cols1[0];
    }
    red.ontouchend = function () {
        tchEnd(red);
        door1 = white;
    }

    yellow.ontouchstart = function () {
        tchStart(yellow);
        door1 = cols1[1];
    }
    yellow.ontouchend = function () {
        tchEnd(yellow);
        door1 = white;
    }

    lightblue.ontouchstart = function () {
        tchStart(lightblue);
        door1 = cols1[2];
    }
    lightblue.ontouchend = function () {
        tchEnd(lightblue);
        door1 = white;
    }

    orange.ontouchstart = function () {
        tchStart(orange);
        door2 = cols2[0];
    }
    orange.ontouchend = function () {
        tchEnd(orange);
        door2 = white;
    }

    green.ontouchstart = function () {
        tchStart(green);
        door2 = cols2[1];
    }
    green.ontouchend = function () {
        tchEnd(green);
        door2 = white;
    }

    pink.ontouchstart = function () {
        tchStart(pink);
        door2 = cols2[2];
    }
    pink.ontouchend = function () {
        tchEnd(pink);
        door2 = white;
    }


    //                              PC CONTROLS
    red.onmousedown = function () {
        tchStart(red);
        door1 = cols1[0];
    }
    red.onmouseup = function () {
        tchEnd(red);
        door1 = white;
    }

    yellow.onmousedown = function () {
        tchStart(yellow);
        door1 = cols1[1];
    }
    yellow.onmouseup = function () {
        tchEnd(yellow);
        door1 = white;
    }

    lightblue.onmousedown = function () {
        tchStart(lightblue);
        door1 = cols1[2];
    }
    lightblue.onmouseup = function () {
        tchEnd(lightblue);
        door1 = white;
    }

    orange.onmousedown = function () {
        tchStart(orange);
        door2 = cols2[0];
    }
    orange.onmouseup = function () {
        tchEnd(orange);
        door2 = white;
    }

    green.onmousedown = function () {
        tchStart(green);
        door2 = cols2[1];
    }
    green.onmouseup = function () {
        tchEnd(green);
        door2 = white;
    }

    pink.onmousedown = function () {
        tchStart(pink);
        door2 = cols2[2];
    }
    pink.onmouseup = function () {
        tchEnd(pink);
        door2 = white;
    }



    class leftRect {
        constructor(y, col, height) {
            this.fillStyle = c.fillStyle = col;
            this.fillRect = c.fillRect(canvas.width / 10, y, canvas.width / 3, height);
            this.stroke = c.stroke();
        }
    }
    class rightRect {
        constructor(y, col, height) {
            this.fillStyle = c.fillStyle = col;
            this.fillRect = c.fillRect(canvas.width / 30 * 17, y, canvas.width / 3, height);
            this.stroke = c.stroke();
        }
    }

    function loop() {
        c.clearRect(0, 0, canvas.width, canvas.height);
        c.fillStyle = "black";
        c.fillRect(0, 0, canvas.width, canvas.height);
        c.stroke();
        for (i = 0; i < y1.length; i++) {
            new leftRect(y1[i], col1[i], height1[i]);
            y1[i] += speed;
            if (y1[i] + height1[i] >= canvas.height / 5 * 4 && y1[i] + height1[i] <= canvas.height / 20 * 17) {
                if (col1[i] == door1) {
                    height1[i] -= speed;
                    if (lives > 1) {
                        score += speed;
                    }
                    if (height1[i] < 1) {
                        delete y1[i];
                    }
                }
            }
            if (y1[i] > canvas.height / 20 * 17) {
                col1[i] = "#60000c";
                lives -= 1;
            }
            if (y1[i] > canvas.height) {
                delete y1[i]
            }
        }


        for (i = 0; i < y2.length; i++) {
            new rightRect(y2[i], col2[i], height2[i]);
            y2[i] += speed;
            if (y2[i] + height2[i] >= canvas.height / 5 * 4 && y2[i] + height2[i] <= canvas.height / 20 * 17) {
                if (col2[i] == door2) {
                    height2[i] -= speed;
                    if (lives > 1) {
                        score += speed;
                    }
                    if (height2[i] < 1) {
                        delete y2[i];
                    }
                }
            }
            if (y2[i] > canvas.height / 20 * 17) {
                col2[i] = "#60000c";
                lives -= 1;
            }
            if (y2[i] > canvas.height) {
                delete y2[i]
            }
        }
        c.fillStyle = door1;
        c.fillRect(0, canvas.height / 5 * 4, canvas.width / 2, canvas.height / 20)
        c.stroke();
        c.fillStyle = door2;
        c.fillRect(canvas.width / 2, canvas.height / 5 * 4, canvas.width / 2, canvas.height / 20)
        c.stroke();
        points.innerHTML = score;
        if (lives < 1) {
            livesSrc.innerHTML = 'YOU LOST';

        } else {
            livesSrc.innerHTML = "Hp: " + lives;
        }
        if (score > 350 && score < 1500 && once === 0) {
            speed = 1.5;
            difficulty = normal;
            document.getElementById("stage1").innerHTML = "STAGE 2";
            document.getElementById("stage1").id = "stage2";
            once = 1;
        }
        if (score > 1500 && score < 3000 && once == 1) {
            speed = 2.5;
            difficulty = hard;
            document.getElementById("stage2").innerHTML = "STAGE 3";
            document.getElementById("stage2").id = "stage3";
            once = 2;
        }
        if (score > 3000 && once == 2) {
            speed = 4;
            difficulty = hard;
            document.getElementById("stage3").innerHTML = "STAGE 4";
            document.getElementById("stage3").id = "stage4";
            once = 3

        }
        requestAnimationFrame(loop);
    }


}
