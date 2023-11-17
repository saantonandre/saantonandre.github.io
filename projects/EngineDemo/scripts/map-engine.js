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
var cellSize = 32;
var visibility = 20;
var player = {
    x: canvas.width / cellSize / 2 - 0.5, //centering
    y: canvas.height / cellSize / 2 - 1,
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
            [CHARA_IDLE, 8],
            /* L: */
            [CHARA_WALK_L, 8],
            /* R: */
            [CHARA_WALK_R, 8],
            /* T: */
            [CHARA_WALK_T, 8],
            /* B: */
            [CHARA_WALK_B, 8]
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

var hotMode = 0;
var dialogueMode = 0;
var night = 0;
requestAnimationFrame(loop);

function loop() {
    c.clearRect(0, 0, canvas.width, canvas.height);
    drawGround();
    drawPlayer();
    drawMap();
    calculatePlayer();
    // TEST
    if (hotMode) {
        hotStuff()
    }
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




function drawGround() {
    for (i = 0; i < map.length; i++) {
        if (typeof map[i].ground === "undefined") {
            continue;
        }
        drawCycle(i);
    }
}
// Tile Gif Speed
var TGS = 8;





function drawMap() {
    var ok1 = false;
    var ok2 = false;
    for (i = 0; i < map.length; i++) {
        if (typeof map[i].ground !== "undefined") {
            continue;
        }
        drawCycle(i);

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

function drawCycle(i) {

    // fragmenting the map into tiles
    if (map[i].tile) {
        for (var j = 0; j < map[i].h; j++) {
            for (var k = 0; k < map[i].w; k++) {
                if (((k + map[i].x) * cellSize + mapX > (player.x + visibility) * cellSize || (k + map[i].x) * cellSize + mapX < (player.x - visibility) * cellSize) ||
                    ((j + map[i].y) * cellSize + mapY > (player.y + visibility) * cellSize || (j + map[i].y) * cellSize + mapY < (player.y - visibility) * cellSize)) {
                    continue;
                }
                if (typeof map[i].gif !== "undefined") {
                    map[i].gif++;
                    if (map[i].gif / TGS >= id(map[i].tile).height / 32) {
                        map[i].gif = 0;
                    }
                    c.drawImage(
                        id(map[i].tile),
                        0,
                        32 * Math.floor(map[i].gif / TGS),
                        32,
                        32,
                        (k + map[i].x) * cellSize + mapX,
                        (j + map[i].y) * cellSize + mapY,
                        cellSize,
                        cellSize
                    );
                } else {
                    c.drawImage(
                        id(map[i].tile), /*image*/
                        (k + map[i].x) * cellSize + mapX, /*x*/
                        (j + map[i].y) * cellSize + mapY, /*x*/
                        cellSize,
                        cellSize
                    );
                }

            }
        }

    } else if (map[i].png) {
        c.drawImage(
            id(map[i].png), /*image*/
            (map[i].x) * cellSize + mapX, /*x*/
            (map[i].y) * cellSize + mapY, /*x*/
            map[i].w * cellSize,
            map[i].h * cellSize
        );
    } else if (typeof map[i].pnGif !== "undefined") {
        // pnGif is a special map tile(mainly for characters)
        /*
        {
            x: 24,
            y: 3,
            w: 7,
            h: 1,
            pnGif : {
                img : "elder",
                currentFrame : 0,
                frameSpeed : 5,
                w : 32,
                h : 64
            }
        }
        */
        map[i].pnGif.currentFrame++;
        if (map[i].pnGif.currentFrame / map[i].pnGif.frameSpeed >= id(map[i].pnGif.img).height / map[i].pnGif.h) {
            map[i].pnGif.currentFrame = 0;
        }
        c.drawImage(
            id(map[i].pnGif.img),
            0,
            map[i].pnGif.h * Math.floor(map[i].pnGif.currentFrame / map[i].pnGif.frameSpeed),
            map[i].pnGif.w,
            map[i].pnGif.h,
            (map[i].x) * cellSize + mapX,
            (map[i].y) * cellSize + mapY,
            map[i].w * cellSize,
            map[i].h * cellSize
        );

    } else {
        c.fillStyle = "#0000ff";
        c.beginPath()
        c.fillRect(map[i].x * cellSize + mapX, map[i].y * cellSize + mapY, map[i].w * cellSize, map[i].h * cellSize);
        c.closePath();
        c.stroke();
    }
}



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


// MODS
function hotStuff() {
    var fireIt = false;
    var x = Math.floor(player.x + 0.5 - mapX / cellSize);
    var y = Math.floor(player.y + 1.5 - mapY / cellSize);
    for (var i = 0; i < map.length; i++) {
        if (map[i].x == x && map[i].y == y) {
            if (map[i].tile == "fire") {
                break;
            }
        }
        if (i == map.length - 1) {
            fireIt = true;
        }
    }
    if (fireIt) {
        map.push({
            x: x,
            y: y,
            w: 1,
            h: 1,
            tile: "fire",
            gif: 0,
            ground: 1
        })
    }
}




function tremble() {
    var tiles = ["low-wall", "red", "purple", "pink", "dry-grass", "walk-grass"];
    var mapl = map.length;
    for (var i = 0; i < mapl; i++) {
        /*
        map[i].tile = tiles[Math.floor(Math.random() * tiles.length)];
        map.push({
            x: Math.floor(Math.random() * 50 + 1),
            y: Math.floor(Math.random() * 50 + 1),
            w: Math.floor(Math.random() * 8 + 1),
            h: Math.floor(Math.random() * 8 + 1),
            tile: tiles[Math.floor(Math.random() * tiles.length)],
            ground: Math.floor(Math.random() * 2)
        })
        */
        if (typeof map[i].tile !== "undefined") {
            map[i].tile = tiles[Math.floor(Math.random() * tiles.length)]
        }
    }
}

function nightMode() {
    if (!night) {
        id("canvas-overlay").style.visibility = "visible";
        id("elder").src = "resources/sprites/elder2.png";
        night = true;
    } else {
        id("canvas-overlay").style.visibility = "hidden";
        id("elder").src = "resources/sprites/elder1.png";
        night = false;
    }
}



// MODS END


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
                mapX += player.xVel - 1;
            colSide.l = 1;
            player.L = false;
        }
        if (col.r) {
            if (player.xVel > 0)
                mapX += player.xVel + 1;
            colSide.r = 1;
            player.R = false;

        }
        if (col.t) {
            if (player.yVel < 0)
                mapY += player.yVel - 1;
            colSide.t = 1;
            player.T = false;
        }
        if (col.b) {
            if (player.yVel > 0)
                mapY += player.yVel + 1;
            colSide.b = 1;
            player.B = false;
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
                    id("options").style.display = "inline-block";
                }
            }
        }
    }

}


var lastPressed;
var keydowns = {
    l: 0,
    r: 0,
    t: 0,
    b: 0,
    int: 0
}
window.addEventListener("keydown", function (event) {
    var key = event.keyCode;
    switch (key) {
        case 65: //left key down
            if (!keydowns.l) {
                player.L = true;
                player.R = false;
                player.T = false;
                player.B = false;
                player.currentSprite = 1;
                lastPressed = "l";
                keydowns.l = 1;
            }
            break;
        case 68: //right key down
            if (!keydowns.r) {
                player.R = true;
                player.L = false;
                player.T = false;
                player.B = false;
                player.currentSprite = 2;
                lastPressed = "r";
                keydowns.r = 1;
            }
            break;
        case 87: //top key down
            if (!keydowns.t) {
                player.T = true;
                player.R = false;
                player.L = false;
                player.B = false;
                player.currentSprite = 3;
                lastPressed = "t";
                keydowns.t = 1;
            }
            break;
        case 83: //bot key down
            if (!keydowns.b) {
                player.B = true;
                player.R = false;
                player.T = false;
                player.L = false;
                player.currentSprite = 4;
                lastPressed = "b";
                keydowns.b = 1;
            }
            break;
        case 32: // E
            if (!keydowns.int) {
                interact();
                keydowns.int = 1;
            }
            break;
        case 80: // P
            hotMode = true;
            player.speed = 14;
            for (var i = 0; i < player.sprites.length; i++) {
                player.sprites[i][1] = 3;
            }
            break;
        case 79: // O
            tremble();
            break;
        case 76: // L
            nightMode();
            break;
        case 73: // I
            switch (cellSize) {
                case 16:
                    cellSize = 32;
                    break;
                case 32:
                    cellSize = 64;
                    break;
                case 64:
                    cellSize = 128;
                    break;
                case 128:
                    cellSize = 16;
                    break;
            }
            break;
    }
});
window.addEventListener("keyup", function (event) {
    var key = event.keyCode;
    switch (key) {
        case 65: //left key up
            player.L = false;
            keydowns.l = 0;
            break;
        case 68: //right key up
            player.R = false;
            keydowns.r = 0;
            break;
        case 87: //top key up
            player.T = false;
            keydowns.t = 0;
            break;
        case 83: //bot key up
            player.B = false;
            keydowns.b = 0;
            break;
        case 32: // E
            keydowns.int = 0;
            break;
    }
});
