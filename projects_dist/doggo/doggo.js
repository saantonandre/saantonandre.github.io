window.onload = function () {
    var doggo_theme = document.getElementById("doggo_theme");
    doggo_theme.loop = true;
    var once = 1;
    var canvas = document.getElementById("canvas");
    var DOGGO_IDLE = document.getElementById("doggo_idle");
    var DOGGO_RUN = document.getElementById("doggo_run");
    var DOGGO_JUMP = document.getElementById("doggo_jump");
    var doggo_trail = document.getElementById("doggo_trail");
    var speedBuy1 = document.getElementById("speedBuy1");
    var run = document.getElementById("run");
    var bg_1 = document.getElementById("bg_1");
    var bg_2 = document.getElementById("bg_2");
    var bg_3 = document.getElementById("bg_3");
    var bg_4 = document.getElementById("bg_4");
    var c = canvas.getContext("2d");
    c.imageSmoothingEnabled = false;
    var doggoSpeed = document.getElementById("speed");
    canvas.width = window.innerWidth;
    canvas.height = canvas.width / 3 * 2;
    var colors = ["#fff", "#f0f", "#ff0", "#0ff", "#00f", "#0f0", "#f00", "#000"];
    var doggo = {
        x: canvas.width / 10,
        y: canvas.height / 14 * 8,
        size: 64,
        xVel: 0,
        speed: 50000,
        accel: 0.03125,
        facingLeft: false,
        action: "idle",
        currentSprite: DOGGO_IDLE,
        frame: 0,
        frameCD: 0,
        frameDelay: 6,
        L: false,
        R: false
    };

    var texts = ["wow", "i so fast", "lolol", "yyyyyyy", "*barks*", "such speeed", "many wows/h", "shibe is hurry", "fastestest than evry", "i think shibe is buged", "airodynamic design", "amaze", "*mlem*", "*mlem^2*", "nevr get me lol", "gotta go fast", "so fast such furios"];
    var rand = Math.floor(Math.random() * texts.length);
    var rand2 = Math.floor(Math.random() * 7);
    var rand3 = Math.floor(Math.random() * 7);

    function newRand() {
        rand = Math.floor(Math.random() * texts.length);
        rand2 = Math.floor(Math.random() * 7);
        rand3 = Math.floor(Math.random() * 7);
        textY = 0;
    }
    drawTxt(texts[rand], colors[rand2], colors[rand3]);
    var initText = 0;



    requestAnimationFrame(loop);

    function loop() {
        c.clearRect(0, 0, canvas.width, canvas.height);
        renderMap();
        startTxt();
        if (doggo.xVel > 20) {
            drawTrail();
        }
        initText;
        drawDoggo(doggo);
        renderGrass();
        doggoSpeed.innerHTML = "DOGGO SPEED: " + Math.round(doggo.xVel * 2) + " Km/h";
        requestAnimationFrame(loop);
    }


    var mapmove = 0;
    var mapmove1 = 0;
    var textY = 0;

    function drawTxt(text, color1, color2) {
        c.font = '12px "Press Start 2P", cursive';
        c.fillStyle = color1;
        c.strokeStyle = color2;
        c.lineWidth = 0.3;
        c.fillText(text, doggo.x + 64, doggo.y + 20 + textY);
        c.strokeText(text, doggo.x + 64, doggo.y + 20 + textY);
        textY -= 0.5;
        if (textY < -30) {
            newRand();
        }
    }
    doggo.whichSprite = function (DOGGO) {
        switch (DOGGO.action) {
            case "idle":
                return DOGGO_IDLE;
            case "run":
                return DOGGO_RUN;
            case "jump":
                return DOGGO_JUMP;
        }
    }

    function startTxt() {
        c.font = '20px "Press Start 2P", cursive';
        c.fillStyle = "#ff0";
        c.strokeStyle = "#000";
        c.lineWidth = 1;
        c.fillText('doggo is fast', doggo.x - mapmove1 / 2, doggo.y);
        c.strokeText('doggo is ', doggo.x - mapmove1 / 2, doggo.y);
        c.fillStyle = "#0f0";
        c.strokeStyle = "#000";
        c.fillText('doggo is good', doggo.x + mapmove1 / 2, doggo.y - 50);
        c.strokeText('doggo is ', doggo.x + mapmove1 / 2, doggo.y - 50);
        if (mapmove1 > canvas.width * 2) {
            initText = drawTxt(texts[rand], colors[rand2], colors[rand3]);
        }
    }

    function drawDoggo(doggo) {
        if (doggo.xVel !== 0) {
            doggo.frameDelay = 40 / doggo.xVel;
        } else {
            doggo.frameDelay = 8
        }
        directionCheck();
        mapmove += doggo.xVel;
        mapmove1 += doggo.xVel;
        if (mapmove > canvas.width * 24) {
            mapmove = 0;
        }
        doggo.currentSprite = doggo.whichSprite(doggo);
        c.drawImage(
            doggo.currentSprite, /* The sprite that should be rendered */
            0, /* The x position of the sprite */
            doggo.frame, /* The y position of the sprite */
            64, /* The size of the sprite cut (width) */
            64, /* The size of the sprite cut (height) */
            doggo.x, /* The position of the cut on the canvas (x) */
            doggo.y, /* The position of the cut on the canvas (y) */
            doggo.size, /* The size of the cut on the canvas (width) */
            doggo.size /* The size of the cut on the canvas (height) */
        );
        nextSpriteFrame(doggo);
    }

    var trail = {
        size: 64,
        currentSprite: doggo_trail,
        frame: 0,
        frameCD: 0,
        frameDelay: 4
    };

    function drawTrail() {
        c.drawImage(
            trail.currentSprite, /* The sprite that should be rendered */
            0, /* The x position of the sprite */
            trail.frame, /* The y position of the sprite */
            64, /* The size of the sprite cut (width) */
            64, /* The size of the sprite cut (height) */
            doggo.x - trail.size, /* The position of the cut on the canvas (x) */
            doggo.y + doggo.size - trail.size, /* The position of the cut on the canvas (y) */
            trail.size, /* The size of the cut on the canvas (width) */
            trail.size /* The size of the cut on the canvas (height) */
        );
        trail.size = doggo.xVel / 10 + 10;
        if (trail.size>256){
            trail.size=256;
        }
        nextSpriteFrame(trail);
    }






    function nextSpriteFrame(entity) {
        entity.frameCD++;
        if (entity.frameCD >= entity.frameDelay) {
            entity.frame += entity.currentSprite.width;
            entity.frameCD = 0;
        }
        if (entity.frame >= entity.currentSprite.height) {
            if (entity.currentSprite == DOGGO_JUMP) {
                entity.action = "idle";
                entity.R = false;
            }
            entity.frame = 0;
        }
    }

    function renderMap() {
        c.drawImage(bg_4, 0, 0, canvas.width, canvas.height);
        for (it = 0; it < 48; it++) {
            c.drawImage(bg_3, -mapmove / 24 + canvas.width * it, 0, canvas.width, canvas.height);
            c.drawImage(bg_2, -mapmove / 6 + canvas.width * it, 0, canvas.width, canvas.height);
        }
    }

    function renderGrass() {
        for (it = 0; it < 48; it++) {
            c.drawImage(bg_1, -mapmove + canvas.width * it, 0, canvas.width, canvas.height);
        }
    }


    function directionCheck() {
        if (doggo.L || doggo.R) {
            if (doggo.R && doggo.xVel < doggo.speed) {
                doggo.xVel += doggo.accel;
            }
            if (doggo.L && doggo.xVel > -doggo.speed) {
                doggo.xVel -= doggo.accel;
            }
        } else {
            if (doggo.xVel === 0) {
                doggo.action = "idle";
            } else if (doggo.xVel !== 0) {

                (doggo.xVel > 0) ? (doggo.action = "run", doggo.xVel -= doggo.accel * 8 + speedGain / 128) : doggo.xVel += doggo.accel / 4;
            }
        }
        if (doggo.xVel < 0) {
            doggo.xVel = 0;
        }
    }
    var speedGain = 2.7;
    var mult_1 = 10;


    speedBuy1.onclick = function () {
        if (doggo.xVel > mult_1) {
            doggo.xVel -= mult_1;
            speedGain *= 1.2;
            mult_1 *= 2;
            speedBuy1.innerHTML = "buy SPEED<br/><br/>(" + mult_1 * 2 + " Km/h)";
        }
    }

    /*
    window.addEventListener("touchstart",rightButtonDown);
    window.addEventListener("touchend",rightButtonUp);
    window.addEventListener("dblclick",leftButtonDown);
    */
    run.addEventListener("click", clickFunc);

    function clickFunc() {
        doggo.xVel += speedGain;
        if (once) {
            doggo_theme.play();
            once = 0;
        }
    }

    /*
    window.addEventListener("keydown", function (event) {
        var key = event.keyCode;
        switch (key) {
            case 39: //right key down
                rightButtonDown();
                break;
            case 37: //left key down
                leftButtonDown();
                break;
        }
    });
    window.addEventListener("keyup", function (event) {
        var key = event.keyCode;
        switch (key) {
            case 39: //right key up
                rightButtonUp();
                break;
        }
    });
    */




};
