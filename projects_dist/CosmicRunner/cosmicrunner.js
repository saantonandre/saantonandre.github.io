function silentErrorHandler() {
    return true;
}
//window.onerror = silentErrorHandler;
window.onload = function () {
    var divofdivs = document.getElementById("divofdivs");
    var results = document.getElementById("results");
    var hidden = document.getElementById("hidden");
    var logoAnimation = document.getElementById("logo-animation");
    var start = document.getElementById("start");
    var coinSound = new Audio("/coinsound.mp3");
    var coinSound2 = new Audio("/coinsound.mp3");
    var coinSound3 = new Audio("/coinsound.mp3");
    var fuu = new Audio("/fuu.mp3");
    var walkingsound = new Audio("/walking.mp3");
    walkingsound.loop = true;
    var sillymusic = new Audio("/sillymusic.mp3");
    sillymusic.loop = true;
    sillymusic.volume = 0.8;
    start.onclick = function () {
        sillymusic.play();
        setTimeout(sillymusic.pause(), 600);
        hidden.style.visibility = "visible";
        logoAnimation.style.display = "none";
        walkingsound.play();
        walkingsound.pause();
        fuu.play();
        fuu.pause();
        coinSound.volume = 0.35;
        coinSound.play();
        coinSound.pause();
        coinSound2.volume = 0.35;
        coinSound2.play();
        coinSound2.pause();
        coinSound3.volume = 0.35;
        coinSound3.play();
        coinSound3.pause();
        var ONCE = false;
        var morti = document.getElementById("morti");
        var coinspan = document.getElementById("coinspan");
        var coinsEarned = 0;
        var sprite = document.getElementById("sprite");
        var sprite2 = document.getElementById("sprite2");
        var sprite3 = document.getElementById("sprite3");
        var monsterSprite = document.getElementById("monsterSprite");
        var canvas = document.getElementById("canvas");
        var leftArrow = document.getElementById("left");
        var rightArrow = document.getElementById("right");
        var upArrow = document.getElementById("up");
        var c = canvas.getContext('2d');
        var easyMode = document.getElementById("easyMode");
        var mediumMode = document.getElementById("mediumMode");
        var hardMode = document.getElementById("hardMode");
        var spaceBees = document.getElementById("spaceBees");
        var difficultyArr = [5000, 1500, 400, 300];
        var coinX = [0, 100, 200, 300, 400, 500, 600];
        var difficulty = 0;
        var diff = 0;
        var distance = document.getElementById("distance");
        var player;
        var alive = true;
        var deaths = 0;
        var spriteP = sprite;
        var gravity = 0.1;
        var mouseX;
        var mouseY;
        var Boxes = [];
        var movBoxes = [];
        var leftKey = false;
        var rightKey = false;
        // ALL THE VARIABLE NEEDED FOR SPRITE RENDERING 
        var px = 384;
        var py = 326;
        var pxWalk = [0, 128, 256, 384, 512, 640, 768, 896, 0, 128, 256];
        var pyWalk = [163, 163, 163, 163, 163, 163, 163, 163, 326, 326, 326];
        var pxWalk2 = [896, 768, 640, 512, 384, 256, 128, 0, 896, 768, 640];
        var pyWalk2 = [163, 163, 163, 163, 163, 163, 163, 163, 326, 326, 326];
        var pxRun2 = [896, 768, 640, 512, 384, 256, 128, 0];
        var pxRun = [0, 128, 256, 384, 512, 640, 768, 896];
        var pyRun = [0, 0, 0, 0, 0, 0, 0, 0];
        var monsterSpriteX = [0, 100, 200, 300, 400, 500, 600, 700, 800]
        var walk = 0;
        var run = 0;
        var jump1 = [512, 640];
        var jump2 = [384, 256];
        var jumpY = 326;
        var ii = 0;
        var jj = 0;
        var blockL = false;
        var blockR = false;
        var bgBoxes = [];
        var coins = [];
        var increment = 0;
        var spawning = setInterval(spawnObstacle, difficultyArr[difficulty])
        var iterCoin = 0;
        var iterCoin2 = 0;
        var jumpCounter = 0;
        // ADJUSTING CANVAS SIZE TO THE SCREEN
        canvas.width = document.body.clientWidth;
        canvas.height = document.body.clientHeight;

        setTimeout(function () {
            canvas.width = Math.max(window.innerWidth, document.body.clientWidth);
            canvas.height = Math.max(window.innerHeight, document.body.clientHeight);
            generateBgBoxes();
        }, 100);

        var gradient = c.createLinearGradient(0, 0, canvas.width, 0);
        gradient.addColorStop(0, '#02111D');
        gradient.addColorStop(0.4, '#037BB5');
        gradient.addColorStop(1, '#02111D');
        var gradient2 = c.createLinearGradient(0, 0, canvas.width, 0);
        gradient2.addColorStop(0, '#02111D');
        gradient2.addColorStop(0.4, '#A00');
        gradient2.addColorStop(1, '#02111D');

        //document.addEventListener("mousemove", trackPos);
        //document.addEventListener("dblclick", jump);
        // DIFFICULTIES

        // you can do more stuff with the player variable
        easyMode.addEventListener("click", function () {
            if (difficulty !== 0) {
                difficulty = 0;
                easyMode.style.transform = "scale(1.2)";
                easyMode.style.opacity = "0.9";

                mediumMode.style.transform = "";
                mediumMode.style.opacity = "0.5";
                hardMode.style.transform = "";
                hardMode.style.opacity = "0.5";
                spaceBees.style.transform = "";
                spaceBees.style.opacity = "0.5";
            }
        });
        mediumMode.addEventListener("click", function () {
            if (difficulty !== 1) {
                difficulty = 1;
                mediumMode.style.transform = "scale(1.2)";
                mediumMode.style.opacity = "0.9";

                easyMode.style.transform = "";
                easyMode.style.opacity = "0.5";
                hardMode.style.transform = "";
                hardMode.style.opacity = "0.5";
                spaceBees.style.transform = "";
                spaceBees.style.opacity = "0.5";
            }
        });
        hardMode.addEventListener("click", function () {
            if (difficulty !== 2) {
                difficulty = 2;
                hardMode.style.transform = "scale(1.2)";
                hardMode.style.opacity = "0.9";

                mediumMode.style.transform = "";
                mediumMode.style.opacity = "0.5";
                easyMode.style.transform = "";
                easyMode.style.opacity = "0.5";
                spaceBees.style.transform = "";
                spaceBees.style.opacity = "0.5";
            }
        });
        spaceBees.addEventListener("click", function () {
            if (difficulty !== 3) {
                difficulty = 3;
                spaceBees.style.transform = "scale(1.2)";
                spaceBees.style.opacity = "0.9";

                mediumMode.style.transform = "";
                mediumMode.style.opacity = "0.5";
                hardMode.style.transform = "";
                hardMode.style.opacity = "0.5";
                easyMode.style.transform = "";
                easyMode.style.opacity = "0.5";
            }
        });
        // MOBILE CONTROLS
        leftArrow.addEventListener("touchstart", function () {
            leftKey = true
            leftArrow.style.transform = "scale(1.5)";
            leftArrow.style.opacity = "1";
        });
        rightArrow.addEventListener("touchstart", function () {
            rightKey = true
            rightArrow.style.transform = "scale(1.5)";
            rightArrow.style.opacity = "1";
        });
        upArrow.addEventListener("touchstart", jump);
        upArrow.addEventListener("touchstart", function () {
            upArrow.style.transform = "scale(1.5)";
            upArrow.style.opacity = "1";
        });
        upArrow.addEventListener("touchend", function () {
            upArrow.style.transform = "";
            upArrow.style.opacity = "0.5";
        });

        leftArrow.addEventListener("touchend", function () {
            leftKey = false
            leftArrow.style.transform = "";
            leftArrow.style.opacity = "0.5";
        });
        rightArrow.addEventListener("touchend", function () {
            rightKey = false
            rightArrow.style.transform = "";
            rightArrow.style.opacity = "0.5";
        });
        // PC CONTROLS
        leftArrow.addEventListener("mousedown", function () {
            leftKey = true;
            leftArrow.style.transform = "scale(1.5)";
            leftArrow.style.opacity = "1";
        });
        rightArrow.addEventListener("mousedown", function () {
            rightKey = true
            rightArrow.style.transform = "scale(1.5)";
            rightArrow.style.opacity = "1";

        });
        upArrow.addEventListener("mousedown", jump);
        upArrow.addEventListener("mousedown", function () {
            upArrow.style.transform = "scale(1.5)";
            upArrow.style.opacity = "1";
        });
        document.addEventListener("mouseup", function () {
            upArrow.style.transform = "";
            upArrow.style.opacity = "0.5";
            leftKey = false
            leftArrow.style.transform = "";
            leftArrow.style.opacity = "0.5";
            rightKey = false
            rightArrow.style.transform = "";
            rightArrow.style.opacity = "0.5";
        });
        document.addEventListener("keydown", function (e) {
            if (e.key == "ArrowUp") {
                jump();
                upArrow.style.transform = "scale(1.5)";
                upArrow.style.opacity = "1";
            } else {
                upArrow.style.transform = "";
                upArrow.style.opacity = "0.5";
            }
            if (e.key == 'ArrowLeft') {
                leftKey = true;
                leftArrow.style.transform = "scale(1.5)";
                leftArrow.style.opacity = "1";
            } else {
                leftKey = false;
                leftArrow.style.transform = "";
                leftArrow.style.opacity = "0.5";
            }
            if (e.key == 'ArrowRight') {
                rightKey = true;
                rightArrow.style.transform = "scale(1.5)";
                rightArrow.style.opacity = "1";
            } else {
                rightKey = false;
                rightArrow.style.transform = "";
                rightArrow.style.opacity = "0.5";
            }
        })

        function spawnPlayer() {
            player = {
                idle: false,
                run: false,
                walk: false,
                width: 40,
                height: 60,
                x: canvas.width / 5 * 2,
                y: 60,
                xVel: 0,
                yVel: 0,
                speed: 10,
                friction: 0.7,
                grounded: false,
                jumping: false,
                jumpForce: 5,
                draw: function () {
                    c.drawImage(spriteP, spriteX, spriteY, 128, 163, this.x, this.y, this.width, this.height);
                }
            };
        }
        // CREATING TERRAIN (x, y, width, height)
        class bgBox {
            constructor() {
                bgBoxes.push({
                    x: Math.random() * canvas.width,
                    y: Math.random() * canvas.height,
                    width: Math.random() * 2,
                    height: Math.random() * 2
                });
            }
        }

        function generateBgBoxes() {
            for (i = 0; i < 300; i++) {
                new bgBox()
            }
        }
        var monsters = [];
        class Monster {
            constructor(xx) {
                monsters.push({
                    x: xx,
                    y: -60,
                    width: 30,
                    height: 60,
                    yVel: 0,
                    sprite: 0,
                    movement: 0
                });
            }
        }
        class Box {
            constructor(xx, yy, ww, hh, dynamic) {
                Boxes.push({
                    x: xx,
                    y: yy,
                    width: ww,
                    height: hh,
                    dynamicBox: (dynamic === undefined) ? false : true
                });
            }
        }
        class movBox {
            constructor(xx, yy, ww, hh, ySp, xSp, rX, rY) {
                movBoxes.push({
                    x: xx,
                    y: yy,
                    width: ww,
                    height: hh,
                    ySpeed: (ySp === undefined) ? 0 : ySp,
                    xSpeed: (xSp === undefined) ? 0 : xSp,
                    rangeX: (rX === undefined) ? 0 : rX,
                    rangeY: (rY === undefined) ? 0 : rY
                });
            }
        }
        class Coin {
            constructor(xx, yy) {
                coins.push({
                    x: xx,
                    y: yy
                });
            }
        }

        function spawnObstacle() {
            if (difficulty === 3) {
                new movBox(-100, Math.floor(Math.random() * 500), Math.floor(Math.random() * 5) + 1, Math.floor(Math.random() * 5) + 1, (Math.random() * 5) - 2.5, Math.random() * 4);
            } else {
                new movBox(-100, Math.floor(Math.random() * 500), Math.floor(Math.random() * 100) + 10, Math.floor(Math.random() * 100) + 10, (Math.random() * 5) - 2.5, Math.random() * 4);
            }
        }

        function initializeMap() {
            Boxes = [];
            movBoxes = []; //height 60 y 0
            new Box(canvas.width / 5 * 2 + 10000, 0, 10, 10, true)
            new Box(canvas.width / 5 * 2 - 25, 60, 10, 100, true)
            new Box(canvas.width / 5 * 2 + 60, 60, 10, 100)
            new Box(canvas.width / 5 * 2 - 25, 160, 95, 5)
            new Box(canvas.width / 5 * 2 - 25, 60, 95, 5)
            new Box(10, 300, 160, 10, true);
            new Box(180, 380, 200, 10);
            new Box(250, 260, 300, 10);
            new Box(450, 320, 300, 10);
            new Box(450, 180, 300, 10);
            new Box(460, 182, 360, 70, true);
            new Box(750, 180, 30, 300);
            new Box(850, 180, 30, 300);
            new Box(1150, 180, 200, 10);
            new Box(1380, 320, 200, 200); //1580
            new Box(1650, 320, 20, 100); //1670
            new Box(1740, 320, 200, 200); //1940
            new movBox(1980, 280, 80, 20, 3);
            new Box(2060, 100, 300, 20);
            new movBox(2360, 100, 300, 20, 3, 0, 3);
            new Box(2660, 180, 30, 120, true)
            new Box(2760, 180, 30, 120, true)
            new Box(2860, 190, 30, 120, true)
            new Box(2960, 210, 30, 200, true)
            new Box(2990, 190, 370, 10)
            new Box(2990, 390, 320, 10)
            new Box(3390, 0, 10, 200)
            new Box(3520, 390, 300, 10)

            new movBox(3840, 340, 30, 10, -4)
            new Box(3880, 330, 40, 10, true)
            new movBox(3940, 200, 30, 10, -4)
            new Box(3990, 280, 40, 10)
            new movBox(4080, 140, 30, 10, -4)
            new Box(4160, 250, 40, 10, true)
            new Box(4200, 250, 40, 40)
            new Box(4200, 370, 40, 200)
            new Box(4200, 370, 200, 40)
            new Box(4200, 250, 200, 40)
            new Box(4400, 0, 200, 290)
            new Box(4400, 370, 200, 250)
            new movBox(4620, 370, 20, 60, 3)
            new movBox(4620, 370, 20, 60, 5)
            new movBox(4620, 370, 20, 60, 4)
            new Box(4660, 0, 200, 290)
            new Box(4660, 370, 200, 320)

            coinsEarned = 0;
            coinspan.innerHTML = "x" + coinsEarned;
            coins = []; //-40
            new Coin(20, 260)
            new Coin(20, 320)
            new Coin(20, 380)
            new Coin(20, 440)
            new Coin(420, 220)
            new Coin(560, 280)
            new Coin(600, 280)
            new Coin(640, 280)
            new Coin(680, 280)
            new Coin(720, 280)
            new Coin(840, 140)
            new Coin(880, 140)
            new Coin(920, 140)
            new Coin(960, 140)
            new Coin(1000, 140)
            new Coin(1040, 140)
            new Coin(1080, 140)
            new Coin(1120, 140)
            new Coin(1650, 280)
            new Coin(1760, 280)
            new Coin(1800, 280)
            new Coin(1840, 280)
            new Coin(1880, 280)
            new Coin(2080, 60)
            new Coin(2120, 60)
            new Coin(2160, 60)
            new Coin(2200, 60)
            new Coin(2240, 60)
            new Coin(2280, 60)
            new Coin(2500, 150)
            new Coin(3300, 330)
            new Coin(3340, 290)
            new Coin(3380, 250)
            new Coin(3420, 250)
            new Coin(3460, 290)
            new Coin(3500, 330)

            new Coin(3890, 290)
            new Coin(4000, 240)
            new Coin(4170, 240)
            new Coin(4210, 330)
            new Coin(4250, 330)
            new Coin(4290, 330)
            new Coin(4330, 330)
            new Coin(4370, 330)
            new Coin(4670, 330)
            new Coin(4710, 330)
            new Coin(4750, 330)
            new Coin(4790, 330)
            monsters = []
            new Monster(400);
            new Monster(Math.random() * 5000);
            new Monster(Math.random() * 5000);
            new Monster(Math.random() * 5000);
            new Monster(Math.random() * 5000);
            new Monster(Math.random() * 5000);
            new Monster(Math.random() * 5000);
            new Monster(Math.random() * 5000);
            new Monster(Math.random() * 5000);
            new Monster(Math.random() * 5000);
            new Monster(Math.random() * 5000);
            new Monster(Math.random() * 5000);
            new Monster(Math.random() * 5000);
        }

        function jump() {
            if (!player.jumping && player.grounded) {
                fuu.play();
                player.jumping = true;
                player.grounded = false;
                player.yVel = -player.jumpForce;
                jumpCounter++;
            }
        }

        function trackPos(e) {
            mouseX = e.clientX;
            mouseY = e.clientY;
        }

        function setMonstersInterval(howMany) {
            for (i = 0; i < howMany; i++) {
                setTimeout(switchMovement(monsters[i]), Math.random() * 3000 + 300)
            }
        }

        function switchMovement(monst) {
            distance = player.x - monst.x;
            if (distance > 100 || distance < -100) {
                monst.movement = Math.floor(Math.random() * 4)
            } else {
                monst.movement = 0
            }
            setTimeout(function () {
                switchMovement(monst)
            }, Math.random() * 3000 + 300)
        }

        function reset() {
            if (!alive) {
                deaths++
            };
            morti.innerHTML = deaths;
            spawnPlayer();
            initializeMap();
            setMonstersInterval(monsters.length);
            alive = true;
            clearInterval(spawning);
            spawning = setInterval(spawnObstacle, difficultyArr[difficulty])
            requestAnimationFrame(loop);
        }

        function callReset() {
            reset()
        }
        spawnPlayer();
        initializeMap();
        setMonstersInterval(monsters.length);
        requestAnimationFrame(loop);
        // MAIN LOOP
        function loop() {
            distance.innerHTML = "distance: " + parseInt(-Boxes[0].x + 10000 + canvas.width / 5 * 2);
            c.clearRect(0, 0, canvas.width, canvas.height);
            c.fillStyle = "#02111D";
            c.fillRect(0, 0, canvas.width, canvas.height);

            player.grounded = false;
            blockL = false;
            blockR = false;

            if (player.y > window.innerHeight || player.y < -player.height) {
                alive = false;
            }

            function collisions(terrain) {
                var dir = colCheck(player, terrain);
                if (dir === "l") {
                    player.jumping = false;
                    blockL = true;
                    increment += -1;
                }
                if (dir === "r") {
                    player.jumping = false;
                    blockR = true;
                } else if (dir === "b") {
                    player.grounded = true;
                    player.jumping = false;
                    player.y = terrain.y - player.height + 1;
                } else if (dir === "t") {
                    player.yVel *= -1;
                }
            }
            for (i = 0; i < bgBoxes.length; i++) {
                c.fill();
                c.fillStyle = '#fff';
                c.fillRect(bgBoxes[i].x, bgBoxes[i].y, bgBoxes[i].width, bgBoxes[i].height);
                c.stroke();
                if (bgBoxes[i].x > canvas.width) {
                    bgBoxes[i].x = 0;
                }
                if (bgBoxes[i].y > canvas.height) {
                    bgBoxes[i].y = 0;
                }
                bgBoxes[i].x += Math.random() / 10;
                bgBoxes[i].y += Math.random() / 10;
            }
            for (i = 0; i < Boxes.length; i++) {
                // render Boxes
                collisions(Boxes[i]);
                Boxes[i].x += increment;
                c.fill();
                c.fillStyle = '#000';
                c.fillRect(Boxes[i].x, Boxes[i].y - 4, Boxes[i].width, Boxes[i].height);
                c.fillStyle = gradient;
                if (Boxes[i].dynamicBox) {
                    c.fillStyle = gradient2
                }
                c.fillRect(Boxes[i].x, Boxes[i].y + Boxes[i].y / 50 - 4, Boxes[i].width, Boxes[i].height);
                c.stroke();
                // checks collisions
            }
            // COINS
            iterCoin++;
            if (iterCoin % 4 === 0) {
                iterCoin2++;
            }
            if (iterCoin2 >= coinX.length) {
                iterCoin2 = 0;
            }
            for (i = 0; i < coins.length; i++) {
                coins[i].x += increment;
                c.drawImage(sprite3, coinX[iterCoin2], 0, 100, 100, coins[i].x, coins[i].y, 20, 20);
                if (player.x + player.width / 1.5 > coins[i].x && player.x + player.width / 3 < coins[i].x + 20 &&
                    player.y + player.height > coins[i].y && player.y < coins[i].y + 20) {
                    delete coins[i].x;
                    coinsEarned++;
                    if (coinSound.paused)
                        coinSound.play();
                    else if (coinSound2.paused)
                        coinSound2.play();
                    else if (coinSound3.paused)
                        coinSound3.play();
                    coinspan.innerHTML = "x" + coinsEarned;
                }
            }
            // MOVBOXES
            if (Boxes[Boxes.length - 1].x + 180 <= player.x && !ONCE) {
                sillymusic.play();
                divofdivs.style.display = "none";
                results.innerHTML = "CONGRATULATIONS!!! <br/>You won :)<br/><br/>COINS: " + coinsEarned + "/46 <br/>DEATHS: " + deaths + "<br/>JUMPS: " + jumpCounter + "<br/><br/>thanks for playing, and for your support!<br/>enjoy my silly xilophone :D";
                timeRes = 0;
                setInterval(function () {
                    results.style.marginTop = timeRes + "px";
                    timeRes += 0.1;
                }, 1000 / 30)
                ONCE = true;
            }
            for (i = 0; i < monsters.length; i++) {
                //monsters death
                if (monsters[i].y > window.innerHeight || monsters[i].y < -monsters[i].height) {
                    delete monsters[i].y
                }
                //adjusting position to the increment value
                monsters[i].x += increment;
                //if its close to the player it moves towards him
                distance = player.x - monsters[i].x;
                if (distance < 0) {
                    distance = -distance
                }
                if (monsters[i].x > player.x + player.width && distance < 100) {
                    monsters[i].x--;
                    monsters[i].sprite += 0.2;
                    if (monsters[i].sprite >= 9) {
                        monsters[i].sprite = 0;
                    }
                } else if (monsters[i].x + monsters[i].width < player.x && distance < 100) {
                    monsters[i].x++;
                    monsters[i].sprite += 0.2;
                    if (monsters[i].sprite >= 9) {
                        monsters[i].sprite = 0;
                    }
                } else {
                    switch (monsters[i].movement) {
                        case 0:
                            monsters[i].sprite = 0;
                            break;
                        case 1:
                            monsters[i].x++;
                            monsters[i].sprite += 0.2;
                            if (monsters[i].sprite >= 9) {
                                monsters[i].sprite = 0;
                            }
                            break;
                        case 2:
                            monsters[i].x--;
                            monsters[i].sprite += 0.2;
                            if (monsters[i].sprite >= 9) {
                                monsters[i].sprite = 0;
                            }
                            break;
                    }
                }

                for (j = 0; j < Boxes.length; j++) {
                    //drawImage(sprite,spriteCutX,spriteCutY,spriteCutWidth,spriteCutHeight,x,y,width,height)
                    //monsters collision
                    colCheck2(monsters[i], Boxes[j])
                }
                for (j = 0; j < movBoxes.length; j++) {
                    //drawImage(sprite,spriteCutX,spriteCutY,spriteCutWidth,spriteCutHeight,x,y,width,height)
                    //monsters collision
                    colCheck2(monsters[i], movBoxes[j])
                }
                c.drawImage(monsterSprite, monsterSpriteX[parseInt(monsters[i].sprite)], 0, 100, 160, monsters[i].x, monsters[i].y, 30, 60);

                monsters[i].y += monsters[i].yVel;
                monsters[i].yVel += gravity;
            }




            for (i = 0; i < movBoxes.length; i++) {
                // render movBoxes
                movBoxes[i].y -= movBoxes[i].ySpeed;
                movBoxes[i].x += (movBoxes[i].xSpeed !== undefined) ? movBoxes[i].xSpeed : 0;
                movBoxes[i].x += increment;
                if (movBoxes[i].y < -movBoxes[i].height) {
                    movBoxes[i].y = 500;
                }
                if (movBoxes[i].y > Math.max(500, canvas.height)) {
                    movBoxes[i].y = -movBoxes[i].height;
                }
                collisions(movBoxes[i]);
                c.fillStyle = '#000';
                c.fillRect(movBoxes[i].x, movBoxes[i].y - 3, movBoxes[i].width, movBoxes[i].height);
                if (difficulty === 3) {
                    c.fillStyle = '#eaf911';
                } else {
                    c.fillStyle = gradient;
                }
                c.fillRect(movBoxes[i].x, movBoxes[i].y, movBoxes[i].width, movBoxes[i].height);
                c.stroke();
                // checks collisions
            }



            player.yVel += gravity;


            if (player.grounded && player.yVel > 0) {
                player.yVel = 0;
            }
            player.y += player.yVel;
            player.xVel *= player.friction;

            for (i = 0; i < coins.length; i++) {
                coins[i].x += player.xVel;
            }
            for (i = 0; i < Boxes.length; i++) {
                Boxes[i].x += player.xVel;
            }
            for (i = 0; i < movBoxes.length; i++) {
                movBoxes[i].x += player.xVel;
            }
            for (i = 0; i < monsters.length; i++) {
                monsters[i].x += player.xVel;
            }

            if (leftKey || rightKey) {
                if (leftKey && blockL === false && player.xVel < player.speed) {
                    player.run = true;
                    player.idle = false;
                    player.xVel++;
                }
                if (rightKey && blockR === false && player.xVel > -player.speed) {
                    player.run = true;
                    player.idle = false;
                    player.xVel--;
                }
            } else {
                player.run = false;
                player.idle = true;
            }
            //  SPRITE RENDERING

            spriteP = sprite;
            if (player.run) {
                if (rightKey) {
                    spriteX = pxRun[ii]
                } else {
                    spriteP = sprite2;
                    spriteX = pxRun2[ii]
                }
                spriteY = pyRun[ii];
                jj++;
                if (jj % 4 === 0) {
                    ii++;
                    if (ii > pxRun.length - 1)
                        ii = 0;
                }
            } else {
                walkingsound.pause();
                spriteX = px;
                spriteY = py;
            }
            if (player.grounded === false) {
                spriteY = jumpY;
                if (leftKey) {
                    spriteP = sprite2;
                    if (player.yVel < 0) {
                        spriteX = jump2[0];
                    } else {
                        spriteX = jump2[1];
                    }
                } else {
                    spriteP = sprite;
                    if (player.yVel < 0) {
                        spriteX = jump1[0];
                    } else {
                        spriteX = jump1[1];
                    }
                }
            }
            if (player.run && player.grounded) {
                if (walkingsound.paused)
                    walkingsound.play();
            } else {
                if (!walkingsound.paused) {
                    walkingsound.pause();
                }
            }
            //  END SPRITE RENDERING
            player.draw();
            if (alive && diff === difficulty)
                requestAnimationFrame(loop);
            else {
                reset()
            }
            if (increment < 0)
                increment += .5;
            diff = difficulty;
        }

        // THE COLLISION DETECTOR
        function colCheck(PLAYER, Box) {
            // get the vectors to check against
            // colDir = collision direction
            //player width and x pos are modified to match its actual size(x+5,width-50)
            var vectorX = (PLAYER.x + 5 + (PLAYER.width - 50 / 2)) - (Box.x + (Box.width / 2)),
                vectorY = (PLAYER.y + (PLAYER.height / 2)) - (Box.y + (Box.height / 2)),
                hWidths = (PLAYER.width - 50 / 2) + (Box.width / 2),
                hHeights = (PLAYER.height / 2) + (Box.height / 2),
                colDir = null;
            if (Math.abs(vectorX) < hWidths && Math.abs(vectorY) < hHeights) {
                var oX = hWidths - Math.abs(vectorX),
                    oY = hHeights - Math.abs(vectorY);
                if (oX >= oY) {

                    if (vectorY > 0) {
                        colDir = "t";
                        if (Box.dynamicBox)
                            Box.y -= oY;
                        else
                            PLAYER.y += oY;
                    } else {
                        colDir = "b";
                        if (Box.dynamicBox)
                            Box.y += oY * 0.5;
                        else
                        if (Box.xSpeed !== undefined) {
                            Box.y += oY * 0.3;
                        }
                    }
                } else {
                    if (vectorX > 0) {
                        colDir = "l";
                        if (Box.dynamicBox) {
                            Box.x -= oX + 2;
                        } else
                            Box.x -= oX - 1;
                    } else {
                        colDir = "r";
                        if (Box.dynamicBox)
                            Box.x += oX + 2;
                        else
                            Box.x += oX - 1;
                    }
                }
            }
            return colDir;
        }

        function colCheck2(MONSTER, Box) {
            // get the vectors to check against
            // colDir = collision direction
            //MONSTER width and x pos are modified to match its actual size(x+5,width-50)
            var vectorX = (MONSTER.x + (MONSTER.width / 2)) - (Box.x + (Box.width / 2)),
                vectorY = (MONSTER.y + (MONSTER.height / 2)) - (Box.y + (Box.height / 2)),
                hWidths = (MONSTER.width / 2) + (Box.width / 2),
                hHeights = (MONSTER.height / 2) + (Box.height / 2),
                colDir = null;
            if (Math.abs(vectorX) < hWidths && Math.abs(vectorY) < hHeights) {
                var oX = hWidths - Math.abs(vectorX),
                    oY = hHeights - Math.abs(vectorY);
                if (oX >= oY) {

                    if (vectorY > 0) {
                        colDir = "t";
                        MONSTER.y += oY;
                    } else {
                        colDir = "b";
                        MONSTER.yVel = 0;
                        MONSTER.y -= oY;
                    }
                } else {
                    if (vectorX > 0) {
                        colDir = "l";
                        MONSTER.x += oX + 2;
                    } else {
                        colDir = "r";
                        MONSTER.x -= oX + 2;
                    }
                }
            }
            return colDir;
        }
    }
};
