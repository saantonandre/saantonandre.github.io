//remove logs when not testing
console.log = function () {};
window.onload = function () {
    //guy.js
    var guy = {
        musica: 0,
        progresso: 0,
        demo: 0,
        q: [false, false, false],
        dialogue: [{
            condition: "guy.progresso==0",
            option: "Dimostrazione",
            text: "Benvenuto alla demo del tester, prova a farmi qualche domanda",
            trigger: "guy.progresso=1;"
        }, {
            condition: "guy.progresso==1",
            option: "(scazzato) Cosa puoi fare? ",
            text: "Praticamente.. tutto! Il limite è la tua fantasia e la tua logica.",
            trigger: "guy.progresso=3;"
        }, {
            condition: "guy.progresso==1",
            option: "(gentile) Cosa puoi fare?",
            text: "Il trigger, come puoi notare, può anche lanciare eventi di qualsiasi tipo, come ad esempio riprodurre una canzone",
            trigger: "dropit= new Audio('https://saantonandre.github.io/dropit.mp3'); dropit.play(); guy.musica=1; guy.progresso=3;"
        }, {
            condition: "guy.progresso==3&&!guy.q[0]",
            option: "Ho trovato un bug, lo togli?",
            text: "è una feature non ti preoccupare",
            trigger: "guy.q[0]=1;"
        }, {
            condition: "guy.progresso==3&&!guy.q[1]",
            option: "quando provo a importare non succede nulla",
            text: "Vuol dire che c'è stato un errore di lettura, o di impostazione delle condizioni/trigger, premi ctrl-maiusc-i e vai sulla console per rendermi conto dei dettagli degli errori",
            trigger: "guy.q[1]=1;"
        }, {
            condition: "guy.progresso==3&&!guy.q[2]",
            option: "Come hai fatto a fare sta roba?",
            text: "Come ho detto prima, ho istanziato le variabili da una condizione, le operazioni dentro gli 'if' vengono eseguite a priori, se ti capita qualche cosa che non capisci sentimi su <a href='https://web.whatsapp.com/'>whatsapp</a>",
            trigger: "guy.q[2]=1;"
        }, {
            condition: "guy.musica==1",
            option: "TOGLI STA MERDA DI MUSICA",
            text: "Va bene calmati cristoooo",
            trigger: "guy.musica=0;dropit.pause();"
}, {
            condition: "guy.q[0]&&guy.q[1]&&guy.q[2]",
            option: "E mo?",
            text: "Hai fatto abbastanza domande, alla prossima!",
            trigger: "if(typeof dropit !=='undefined'){if(!dropit.paused){dropit.pause()}};new Audio('https://saantonandre.github.io/tbc.mp3').play();"
}]

    };
    //elder.js
    var elder = {
        prog: -1,
        q: [false, false, false],
        dialogue: [{
            condition: "elder.prog == -1;",
            option: "Dialogue start",
            text: "Oh, you've woken up! Goodmorning, how're you feeling today?",
            trigger: "elder.prog = 0;"
    }, {
            condition: "elder.prog == 0;",
            option: "I'm good, but... where am I?",
            text: "You're in my house, kiddo. I've found you last night outside the village, during the storm... Oh, I forgot to introduce myself. I'm the Elder of this village. And you are...?",
            trigger: "elder.prog = 1;"
    }, {
            condition: "elder.prog == 1;",
            option: "I'm just a traveller.",
            text: "I see... and what's your name?",
            trigger: "elder.prog = 2;"
    }, {
            condition: "elder.prog == 2;",
            option: "It's -pgname-.",
            text: "Nice to meet you, -pgname-. I have an important matter to discuss with you... Have you seen someone coming here? A young man more or less of your age.",
            trigger: "elder.prog = 3;"
    }, {
            condition: "elder.prog == 2;",
            option: "It's not important.",
            text: "Whatever, -pgname-. I have an important matter to discuss with you... Have you seen someone coming here? A young man more or less of your age.",
            trigger: "elder.prog = 3;"
    }, {
            condition: "elder.prog == 3;",
            option: "Sorry, I haven't.",
            text: "Very bad! He's my son, I'm very worried about him... Where could he be? (...) YOU! YOU MUST KNOW SOMETHING FOR SURE!",
            trigger: "elder.prog = 4;"
    }, {
            condition: "elder.prog == 3;",
            option: "I don't remember...",
            text: "Very bad! He's my son, I'm very worried about him... Where could he be? (...) YOU! YOU MUST KNOW SOMETHING FOR SURE!",
            trigger: "elder.prog = 4;"
    }, {
            condition: "elder.prog == 4;",
            option: "I swear I don't.",
            text: "Okay, okay. You're a detective, right? You know I'm OBLIGATED to suspect of you. If you're not the culprit of my son's disappearing you must find out who is! You won't leave this place until you bring me that BASTARD!!! Understood?",
            trigger: "elder.prog = 5;"
    }, {
            condition: "elder.prog == 5;",
            option: "Yes.",
            text: "Ha ha ha... Perfect. Now it's time for the Mass. I'll meet you there.",
            trigger: ""
    }, {
            condition: "elder.prog == 5;",
            option: "Calm down, grandpa.",
            text: "Show some RESPECT you bastard! Ha ha ha... See you at the Mass.",
            trigger: ""
    }, {
            condition: "elder.prog == 0;",
            option: "Who are you?",
            text: "I'm the Elder of the village, I'm the one who saved you last night. And who might you be, kiddo?",
            trigger: "elder.prog = 1;"
    }, {
            condition: "elder.prog == 1;",
            option: "I'm detective -pgname-.",
            text: "Nice to meet you, -pgname-. I have an important matter to discuss with you... Have you seen someone coming here? A young man more or less of your age.",
            trigger: "elder.prog = 3;"
    }]

    };

    // map.js
    map = [{
        x: 11,
        y: 7,
        w: 11,
        h: 3
}, {
        x: 16,
        y: 10,
        w: 2,
        h: 8
}, {
        x: 21,
        y: 11,
        w: 1,
        h: 7
}, {
        x: 22,
        y: 13,
        w: 3,
        h: 3
}, {
        x: 25,
        y: 11,
        w: 1,
        h: 7
}, {
        x: 28,
        y: 11,
        w: 1,
        h: 7
}, {
        x: 31,
        y: 11,
        w: 4,
        h: 2
}, {
        x: 31,
        y: 13,
        w: 1,
        h: 3
}, {
        x: 32,
        y: 14,
        w: 3,
        h: 2
}, {
        x: 31,
        y: 16,
        w: 4,
        h: 2
}, {
        x: 41,
        y: 11,
        w: 1,
        h: 2
}, {
        x: 41,
        y: 13,
        w: 1,
        h: 5
}, {
        x: 44,
        y: 11,
        w: 4,
        h: 2
}, {
        x: 44,
        y: 13,
        w: 1,
        h: 3
}, {
        x: 45,
        y: 15,
        w: 3,
        h: 1
}, {
        x: 45,
        y: 14,
        w: 3,
        h: 1
}, {
        x: 44,
        y: 16,
        w: 4,
        h: 2
}, {
        x: 15,
        y: 23,
        w: 4,
        h: 2
}, {
        x: 15,
        y: 25,
        w: 4,
        h: 2
}, {
        x: 15,
        y: 27,
        w: 1,
        h: 2
}, {
        x: 18,
        y: 27,
        w: 1,
        h: 2
}, {
        x: 20,
        y: 20,
        w: 9,
        h: 2
}, {
        x: 24,
        y: 22,
        w: 2,
        h: 7
}, {
        x: 29,
        y: 22,
        w: 5,
        h: 2
}, {
        x: 29,
        y: 24,
        w: 1,
        h: 5
}, {
        x: 30,
        y: 25,
        w: 2,
        h: 2
}, {
        x: 30,
        y: 27,
        w: 4,
        h: 2
}, {
        x: 36,
        y: 22,
        w: 4,
        h: 2
}, {
        x: 36,
        y: 24,
        w: 1,
        h: 3
}, {
        x: 37,
        y: 25,
        w: 3,
        h: 2
}, {
        x: 36,
        y: 27,
        w: 4,
        h: 2
}, {
        x: 41,
        y: 20,
        w: 9,
        h: 2
}, {
        x: 15,
        y: 22,
        w: 2,
        h: 7
}, {
        x: 8,
        y: 18,
        w: 1,
        h: 2,
        text: 'guy'
}, {
        x: 12,
        y: 18,
        w: 1,
        h: 2,
        text: 'elder'
}, ];
    hitBoxes = [{
        x: 31,
        y: 17,
        w: 4,
        h: 1
}, {
        x: 34,
        y: 15,
        w: 1,
        h: 2
}, {
        x: 31,
        y: 15,
        w: 3,
        h: 1
}, {
        x: 31,
        y: 13,
        w: 1,
        h: 2
}, {
        x: 31,
        y: 12,
        w: 4,
        h: 1
}, {
        x: 41,
        y: 14,
        w: 1,
        h: 4
}, {
        x: 41,
        y: 12,
        w: 1,
        h: 1
}, {
        x: 44,
        y: 17,
        w: 4,
        h: 1
}, {
        x: 47,
        y: 15,
        w: 1,
        h: 2
}, {
        x: 44,
        y: 15,
        w: 3,
        h: 1
}, {
        x: 44,
        y: 12,
        w: 1,
        h: 3
}, {
        x: 45,
        y: 12,
        w: 3,
        h: 1
}, {
        x: 15,
        y: 24,
        w: 1,
        h: 5
}, {
        x: 16,
        y: 24,
        w: 3,
        h: 1
}, {
        x: 18,
        y: 25,
        w: 1,
        h: 4
}, {
        x: 16,
        y: 26,
        w: 2,
        h: 1
}, {
        x: 20,
        y: 21,
        w: 8,
        h: 1
}, {
        x: 24,
        y: 22,
        w: 2,
        h: 7
}, {
        x: 28,
        y: 21,
        w: 1,
        h: 1
}, {
        x: 29,
        y: 23,
        w: 1,
        h: 6
}, {
        x: 30,
        y: 23,
        w: 4,
        h: 1
}, {
        x: 30,
        y: 26,
        w: 2,
        h: 1
}, {
        x: 30,
        y: 28,
        w: 4,
        h: 1
}, {
        x: 36,
        y: 28,
        w: 4,
        h: 1
}, {
        x: 39,
        y: 26,
        w: 1,
        h: 2
}, {
        x: 36,
        y: 26,
        w: 3,
        h: 1
}, {
        x: 36,
        y: 23,
        w: 1,
        h: 3
}, {
        x: 37,
        y: 23,
        w: 3,
        h: 1
}, {
        x: 41,
        y: 21,
        w: 9,
        h: 1
}, {
        x: 45,
        y: 22,
        w: 2,
        h: 7
}, {
        x: 16,
        y: 10,
        w: 2,
        h: 8
}, {
        x: 11,
        y: 8,
        w: 11,
        h: 2
}, {
        x: 21,
        y: 12,
        w: 1,
        h: 6
}, {
        x: 22,
        y: 14,
        w: 3,
        h: 2
}, {
        x: 25,
        y: 12,
        w: 1,
        h: 6
}, {
        x: 28,
        y: 12,
        w: 1,
        h: 6
}, ];
    spawnPoint = {
        x: 16,
        y: 20
    };
    //map-engine.js
    function id(arg) {
        return document.getElementById(arg);
    }
    var canvas = id("canvas");
    canvas.imageSmoothingEnabled = false;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    var CHARA_IDLE = id("CHARA_IDLE");
    var CHARA_WALK_L = id("CHARA_WALK_L");
    var CHARA_WALK_R = id("CHARA_WALK_R");
    var CHARA_WALK_T = id("CHARA_WALK_T");
    var CHARA_WALK_B = id("CHARA_WALK_B");
    var c = canvas.getContext("2d");
    var cellSize = 30;
    var player = {
        x: canvas.width / cellSize / 2,
        y: canvas.height / cellSize / 2,
        h: 2,
        w: 1,
        //movement
        L: 0,
        R: 0,
        T: 0,
        B: 0,
        xVel: 0,
        yVel: 0,
        speed: 3,
        accel: 0.5,
        /* sprites have an address and a delay */
        sprites: [
            /* IDLE: */
            [CHARA_IDLE, 10],
            /* L: */
            [CHARA_WALK_L, 4],
            /* R: */
            [CHARA_WALK_R, 4],
            /* T: */
            [CHARA_WALK_T, 7],
            /* B: */
            [CHARA_WALK_B, 7]
        ],
        currentSprite: 0,
        currentFrame: 0
    };

    var mapX = (player.x - spawnPoint.x) * cellSize;
    /*    +1 for hitbox    */
    var mapY = (player.y - spawnPoint.y + 1) * cellSize;

    var playerHitbox = {
        x: player.x,
        y: player.y + 1,
        w: player.w,
        h: player.h - 1
    }

    var dialogueMode = 0;
    requestAnimationFrame(loop);

    function loop() {
        c.clearRect(0, 0, canvas.width, canvas.height);

        drawPlayer();
        drawMap();
        calculatePlayer();
        if (!dialogueMode) {
            requestAnimationFrame(loop);
        }
    }

    //if collide solo verde con i blu disegna sopra
    //if collide rosso disegna sotto

    function drawPlayer() {

        /* if the player is not moving he is idling */

        if (!player.L &&
            !player.R &&
            !player.T &&
            !player.B && player.currentSprite !== 0) {
            player.currentSprite = 0;
        } /* going down through the sprite frame */

        // frame counter counts how many frames are passing, each sprite has its speed based on this
        player.centerX = player.x + (player.w / 2) - mapX / cellSize;
        player.centerY = player.y + 1 + ((player.h - 1) / 2) - mapY / cellSize;

        /* if the next frame does not exist return to 0 */
        if (player.currentFrame + 2 > player.sprites[player.currentSprite][0].height / player.sprites[player.currentSprite][0].width / 2) {
            frameCounter = 0;
        }
        /* currentFrame è l'indice dell'altezza della sprite */
        player.currentFrame = Math.floor(frameCounter / player.sprites[player.currentSprite][1]);


        //console.log(frameCounter)
        printPlayer();

        frameCounter++;
    }
    // Only draws the player without calculations
    function printPlayer() {

        c.fillStyle = "#00ff00";
        c.drawImage(
            player.sprites[player.currentSprite][0],
            0,
            64 * player.currentFrame,
            32,
            64,
            player.x * cellSize,
            player.y * cellSize,
            player.w * cellSize,
            player.h * cellSize
        );


        c.stroke();
        c.beginPath();

        c.strokeStyle = "#ff0000";
        c.rect(
            player.x * cellSize,
            player.y * cellSize + cellSize,
            player.w * cellSize,
            player.h * cellSize - cellSize
        );
        c.closePath();
        c.stroke();
    }

    function drawMap() {
        var ok1 = false;
        var ok2 = false;
        for (i = 0; i < map.length; i++) {
            c.fillStyle = "#0000ff";
            c.beginPath()
            c.fillRect(map[i].x * cellSize + mapX, map[i].y * cellSize + mapY, map[i].w * cellSize, map[i].h * cellSize);
            c.closePath();
            c.stroke();
            if (col2(player, map[i])) {
                ok1 = true;
            }
            if (col2(playerHitbox, map[i])) {
                ok2 = true;
            }

        }
        for (i = 0; i < hitBoxes.length; i++) {
            c.strokeStyle = "#ff0000";
            c.beginPath()
            c.rect(hitBoxes[i].x * cellSize + mapX, hitBoxes[i].y * cellSize + mapY, hitBoxes[i].w * cellSize, hitBoxes[i].h * cellSize);
            c.closePath();
            c.stroke();
        }
        if (!(ok1 && ok2)) {
            printPlayer();
        }
    }
    /* SPRITE RENDERING */

    function calculatePlayer() {
        playerHitbox = {
            x: player.x,
            y: player.y + 1,
            w: player.w,
            h: player.h - 1
        }

        isGrounded(playerHitbox);
        directionCheck();


    }

    var colSide;

    function isGrounded(entity) {
        //id("stat").innerHTML = "";
        colSide = {
            t: 0,
            b: 0,
            l: 0,
            r: 0
        };
        for (i = 0; i < hitBoxes.length; i++) {

            var col = collision(entity, hitBoxes[i]);

            if (col.l) {
                if (player.xVel < 0)
                    mapX += player.xVel;
                colSide.l = 1;
            }
            if (col.r) {
                if (player.xVel > 0)
                    mapX += player.xVel;
                colSide.r = 1;

            }
            if (col.t) {
                if (player.yVel < 0)
                    mapY += player.yVel;
                colSide.t = 1;
            }
            if (col.b) {
                if (player.yVel > 0)
                    mapY += player.yVel;
                colSide.b = 1;
            }


        }
        //id("stat").innerHTML += "L: " + colSide.l + " R: " + colSide.r + " T: " + colSide.t + " B: " + colSide.b;

    }

    function directionCheck() {

        if (player.L || player.R) {
            if (player.R && player.xVel < player.speed && !(colSide.r)) {
                player.xVel += player.accel;
            }
            if (player.L && player.xVel > -player.speed && !(colSide.l)) {
                player.xVel -= player.accel;
            }
        } else {
            if (player.xVel !== 0) {
                if (colSide.r || colSide.l) {
                    player.xVel = 0;
                } else {
                    player.xVel = 0;
                }
                /*
                (player.xVel > 0) ? player.xVel -= player.accel / 4 : player.xVel += player.accel / 4;
                */
            }
        }
        if (player.B || player.T) {
            if (player.B && player.yVel < player.speed && !(colSide.b)) {
                player.yVel += player.accel;
            }
            if (player.T && player.yVel > -player.speed && !(colSide.t)) {
                player.yVel -= player.accel;
            }
        } else {
            if (player.yVel !== 0) {
                if (colSide.t || colSide.b) {
                    player.yVel = 0;
                } else {
                    player.yVel = 0;
                }
                /*
                    (player.yVel > 0) ? player.yVel -= player.accel / 4 : player.yVel += player.accel / 4;
                    */
            }
        }
        mapX -= player.xVel;
        mapY -= player.yVel;
    }

    function col2(player, box) {
        if (player.x + player.w > box.x + mapX / cellSize) {
            if (player.x < box.x + mapX / cellSize + box.w) {
                if (player.y + player.h > box.y + mapY / cellSize) {
                    if (player.y < box.y + mapY / cellSize + box.h) {
                        return true;
                    }
                }
            }
        }
        return false;
    }
    var frameCounter = 0;









    //COLLISION DETECTOR
    function collision(Box1, Box2) {
        var vectorX = (Box1.x + (Box1.w / 2)) - (Box2.x + mapX / cellSize + (Box2.w / 2)),
            vectorY = (Box1.y + (Box1.h / 2)) - (Box2.y + mapY / cellSize + (Box2.h / 2)),
            hWidths = (Box1.w / 2) + (Box2.w / 2),
            hHeights = (Box1.h / 2) + (Box2.h / 2),
            colDir = {
                t: 0,
                b: 0,
                l: 0,
                r: 0
            };
        if (Math.abs(vectorX) < hWidths && Math.abs(vectorY) < hHeights) {
            var oX = hWidths - Math.abs(vectorX),
                oY = hHeights - Math.abs(vectorY);
            if (oX >= oY) {

                if (vectorY >= 0) {
                    colDir.t = 1;
                } else {
                    colDir.b = 1;
                }
            } else {
                if (vectorX >= 0) {
                    colDir.l = 1;
                } else {
                    colDir.r = 1;
                }
            }
        }
        return colDir;
    }

    //the interaction point relative to player
    var inter = {
        //left respective to the player
        l: 0,
        //top respective to the player
        t: 0
    }

    function interact() {
        switch (lastPressed) {
            case "l":
                inter.l = -1;
                inter.t = 0;
                break;
            case "r":
                inter.l = 1;
                inter.t = 0;
                break;
            case "t":
                inter.l = 0;
                inter.t = -1;
                break;
            case "b":
                inter.l = 0;
                inter.t = 1;
                break;
        }
        for (i = 0; i < hitBoxes.length; i++) {
            if (hitBoxes[i].text !== undefined) {
                console.log(player.centerX + " " + player.centerY + "\n" + hitBoxes[i].x + " " + hitBoxes[i].y)
                if (player.centerX + inter.l > hitBoxes[i].x && player.centerX + inter.l < hitBoxes[i].x + hitBoxes[i].w) {
                    if (player.centerY + inter.t > hitBoxes[i].y && player.centerY + inter.t < hitBoxes[i].y + hitBoxes[i].h) {
                        alert(hitBoxes[i].text);
                    }
                }
            }
        }
        for (i = 0; i < map.length; i++) {
            if (map[i].text !== undefined) {
                console.log(player.centerX + " " + player.centerY + "\n" + map[i].x + " " + map[i].y)
                if (player.centerX + inter.l > map[i].x && player.centerX + inter.l < map[i].x + map[i].w) {
                    if (player.centerY + inter.t > map[i].y && player.centerY + inter.t < map[i].y + map[i].h) {
                        validateOptions(eval(map[i].text).dialogue)
                    }
                }
            }
        }

    }


    var lastPressed;

    window.addEventListener("keydown", function (event) {
        var key = event.keyCode;
        switch (key) {
            case 65: //left key down
                player.R = false;
                player.L = true;
                player.currentSprite = 1;
                lastPressed = "l";
                break;
            case 68: //right key down
                player.R = true;
                player.L = false;
                player.currentSprite = 2;
                lastPressed = "r";
                break;
            case 87: //top key down
                player.B = false;
                player.T = true;
                player.currentSprite = 3;
                lastPressed = "t";
                break;
            case 83: //bot key down
                player.T = false;
                player.B = true;
                player.currentSprite = 4;
                lastPressed = "b";
                break;
            case 32: // E
                interact();
                break;
        }
    });
    window.addEventListener("keyup", function (event) {
        var key = event.keyCode;
        switch (key) {
            case 65: //left key up
                player.L = false;
                break;
            case 68: //right key up
                player.R = false;
                break;
            case 87: //top key up
                player.T = false;
                break;
            case 83: //bot key up
                player.B = false;
                break;
        }
    });
    //Mobile controls

    id("left").addEventListener("touchstart", function () {
        player.L = true;
        player.currentSprite = 1;
        lastPressed = "l";
    });

    id("right").addEventListener("touchstart", function () {
        player.R = true;
        player.currentSprite = 2;
        lastPressed = "r";
    });

    id("up").addEventListener("touchstart", function () {
        player.T = true;
        player.currentSprite = 3;
        lastPressed = "t";
    });
    id("down").addEventListener("touchstart", function () {
        player.B = true;
        player.currentSprite = 4;
        lastPressed = "b";
    });
    id("left").addEventListener("touchend", function () {
        player.L = false;
    });
    id("right").addEventListener("touchend", function () {
        player.R = false;
    });
    id("up").addEventListener("touchend", function () {
        player.T = false;
    });
    id("down").addEventListener("touchend", function () {
        player.B = false;
    });
    canvas.addEventListener("touchstart", function () {
        interact();
        id("arrowCont").style.display = "none";
    });
    //actions.js
    var characters = ["guy", "elder"];
    var dialogues = [
    function () {
            letters("Obsessed with your sins, you travel looking for a distant friend, Sophie, who promised to save you.", id("storytext"), false)
            }
            ]
    //mobile
    id("arrowCont").style.display = "none";
    id("start").onclick = function () {
        id("main-menu").style.display = "none";
        id("game-screen").style.display = "block";
        id("arrowCont").style.display = "block";
    }
    id("closeDialogue").onclick = function () {
        id("arrowCont").style.display = "block";
        id("dialogue-ui").style.display = "none";
        id("output").innerHTML = "";
        dialogueMode = false;
        requestAnimationFrame(loop);
    }
    //text-engine.js
    var oneSentence = false;
    var specials = "?!.,;-";
    var sentence = 0;

    var sentence = 0;

    var t1 = new Audio("https://saantonandre.github.io/EngineDemo/resources/sfx/talk1.wav"),
        t2 = new Audio("https://saantonandre.github.io/EngineDemo/resources/sfx/talk2.wav"),
        t3 = new Audio("https://saantonandre.github.io/EngineDemo/resources/sfx/talk3.wav");
    var talk = [t3, t2, t3];

    function letters(string, div, audio) {
        div.innerHTML = "";
        id("options").innerHTML = "";
        id("options").style.display = "none";
        var length = 0;
        endTrigger = false;
        var i = 0,
            j = 0,
            pause = 60;
        next();


        function next() {

            length++;
            if (length == string.length) {
                id("options").style.display = "block";
            }
            if (pause >= 60) {
                if (audio) {
                    var rand = Math.floor(Math.random() * 3);
                    talk[rand].play();
                }
            }

            div.innerHTML += string[i];
            i++;
            if (i < string.length) {
                pause = 60;
                //checks for longer pauses
                for (j = 0; j < specials.length; j++) {
                    if (string[i - 1] === specials[j]) {
                        pause = 200;
                        break;
                    }
                }
                if (string[i - 1] === " ") {
                    pause = 30;
                }
                if (dialogueMode)
                    oneSentence = setTimeout(next, pause);
                else
                    clearTimeout(next, pause);
            }

        }
    }
    // dialogue-testing.js
    var optionList = [];

    function validateOptions(charDialogue) {
        dialogueMode = 1;

        id("options").innerHTML = "";
        id("dialogue-ui").style.display = "block";
        optionList = [];
        //guarda tra i dialoghi quale soddisfa le condizioni
        //gli indici li pusha nell'option list

        for (var i = 0; i < charDialogue.length; i++) {
            if (eval(charDialogue[i].condition) || charDialogue[i].condition.length == 0) {
                optionList.push(i);
            }
        }
        //chiama la funzione che si occuperà di mostrare le opzioni disponibili
        generateOptions(charDialogue);
    }

    function generateOptions(charDialogue) {
        for (var i = 0; i < optionList.length; i++) {
            var newNode = document.createElement("BUTTON");
            newNode.number = optionList[i];
            var textNode = document.createTextNode(charDialogue[newNode.number].option);

            newNode.appendChild(textNode);
            newNode.className = "option";
            newNode.id = "option-" + i;
            id("options").appendChild(newNode);
            newNode.onclick = function () {
                console.log("fuck");
                letters(charDialogue[this.number].text, id("output"), true)
                id("output")
                eval(charDialogue[this.number].trigger);
                validateOptions(charDialogue);
            };
        }

    }

};
