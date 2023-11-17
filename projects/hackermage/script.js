function id(arg) {
    return document.getElementById(arg);
}

window.onload = function () {
    var span = id("span");
    var range = id("range");
    var span2 = id("span2");
    var canvas = id("canvas");
    var c = canvas.getContext("2d");
    canvas.width = 600;
    canvas.height = 300;
    requestAnimationFrame(loop);
    //PLAYER
    var player = {
        x: canvas.width / 2,
        y: canvas.height / 4,
        height: 40,
        width: 20,
        L: 0,
        R: 0,
        B: 0,
        T: 0,
        grounded: 0,
        xVel: 0,
        yVel: 0,
        SPEED: 2,
        FRICTION: 0.9,
        color: "black",
        facingLeft: false
    };
    //PLATFORMS
    var bulletSize = 15;
    var platforms = [];
    class Box {
        constructor(xx, yy, ww, hh, dynamic) {
            platforms.push({
                x: xx,
                y: yy,
                width: ww,
                height: hh
            });
        }
    }
    new Box(player.x - 20, canvas.height / 5 * 3, player.width + 40, 20);
    new Box(0, canvas.height / 5 * 2, 80, 100);
    new Box(player.x + 100, canvas.height / 8 * 6, player.width + 40, 10);
    new Box(0, canvas.height - 10, canvas.width * 4, 10);
    new Box(20, canvas.height - 100, 30, 100);
    new Box(canvas.width - 30, 150, 30, 100);
    new Box(30, 10, 4000, 20);




    //MAIN LOOP
    function loop() {
        c.clearRect(0, 0, canvas.width, canvas.height);
        renderPlatforms();
        renderProjectiles(); //TEST
        renderParticles(); //TEST
        renderPlayer();

        centerX = player.x + player.width / 2; //TEST
        centerY = player.y + player.height / 4; //TEST

        requestAnimationFrame(loop);
    }
    var increment = 0;

    function renderPlatforms() {
        c.fillStyle = "black";
        for (i = 0; i < platforms.length; i++) {
            c.fillRect(platforms[i].x - increment, platforms[i].y, platforms[i].width, platforms[i].height);
            platforms[i].x -= increment;
        }
    }
    var GRAVITY = 0.3;

    function renderPlayer() {
        increment = 0;
        if (player.crouch) {
            player.height = 20;
            player.SPEED = 1;
        } else {
            player.height = 40;
            player.SPEED = 2;
        }
        if (player.T && player.grounded) {
            player.yVel = -8;
            player.grounded = false;
            player.T = false;
        } else if (player.R && player.xVel < player.SPEED) {
            player.xVel += 0.3;
        } else if (player.L && player.xVel > -player.SPEED) {
            player.xVel -= 0.3;
        }
        isGrounded(player);
        //applies physics
        if (player.grounded) {
            player.xVel *= player.FRICTION;
            player.yVel = 0;

        } else {
            player.yVel += GRAVITY;
        }
        if (player.xVel > -0.2 && player.xVel < 0.2) {
            player.xVel = 0;
        }
        if (player.yVel > -0.2 && player.yVel < 0.2) {
            player.yVel = 0;
        }
        //player.x += player.xVel;
        increment += player.xVel;
        player.y += player.yVel;
        c.fillStyle = player.color;
        c.fillRect(player.x, player.y, player.width, player.height);

    }

    function isGrounded(entity) {
        var onTerrain = 0;
        for (i = 0; i < platforms.length; i++) {
            var col = collision(entity, platforms[i]);
            if (col.b) {
                entity.grounded = true;
                entity.y = platforms[i].y - entity.height;
                onTerrain = 1;
            }
            if (col.r) {
                entity.xVel = 0;
                if (entity == player) {
                    increment += -1;
                    player.R = false;
                } else {
                    entity.x = platforms[i].x - entity.width;
                }
            }
            if (col.l) {
                entity.xVel = 0;
                if (entity == player) {
                    increment += 1;
                    player.L = false;
                } else {
                    entity.x = platforms[i].x + platforms[i].width;
                }
            }
            if (col.t) {
                entity.yVel = -entity.yVel;
            }
        }
        entity.grounded = onTerrain;

    }









    /* TEST START*/
    var centerX = player.x + player.width / 2;
    var centerY = player.y + player.height / 2;
    var projectiles = [];


    function shoot(fleft) {
        if (fleft) {
            var x = 0;
            var y = player.y;
        } else {
            var x = canvas.width;
            var y = player.y;
        }
        deltaX = x - centerX;
        deltaY = y - centerY;
        rotation = Math.atan2(deltaY, deltaX);
        xtarget = Math.cos(rotation);
        ytarget = Math.sin(rotation);

        projectiles.push({
            x: centerX,
            y: centerY,
            speed: 6,
            xVel: xtarget,
            yVel: ytarget,
            size: bulletSize,
            width: bulletSize * 0.705,
            height: bulletSize * 0.705,
            color: randomColor()
        });
    }
    var removeList = [];
    var particles = [];

    function renderProjectiles() {
        for (i = 0; i < projectiles.length; i++) {
            c.fillStyle = projectiles[i].color;
            //c.fillRect(projectiles[i].x, projectiles[i].y,projectiles[i].width, projectiles[i].height);
            c.beginPath();
            c.arc(projectiles[i].x, projectiles[i].y, projectiles[i].size / 2, 0, Math.PI * 2);
            c.fill();
            projectiles[i].x += projectiles[i].xVel * projectiles[i].speed;
            projectiles[i].y += projectiles[i].yVel * projectiles[i].speed;
            for (j = 0; j < platforms.length; j++) {
                var col = collision(projectiles[i], platforms[j]);
                if (col.b || col.t || col.l || col.r) {

                    if (col.l || col.r)
                        projectiles[i].xVel *= -1;

                    if (col.t || col.b)
                        projectiles[i].yVel *= -1;

                    explosion(projectiles[i]);
                    removeList.push(i);
                }
            }
        }
        for (i = 0; i < removeList.length; i++) {
            projectiles.splice(removeList[i], 1);
        }
        removeList = [];
    }

    function explosion(bullet) {
        var color = bullet.color;
        var x = bullet.x;
        var y = bullet.y;
        var speedX = bullet.xVel * bullet.speed;
        var speedY = bullet.yVel * bullet.speed;
        var randNum = Math.floor(Math.random() * 15) + 1;
        for (iter = 0; iter < randNum; iter++) {
            particles.push({
                xVel: Math.random() * speedX * 0.8,
                yVel: Math.random() * speedY * 0.8,
                x: x,
                y: y,
                size: Math.random() * bullet.size,
                color: color
            });
        }
    }

    function renderParticles() {
        for (i = 0; i < particles.length; i++) {
            c.fillStyle = particles[i].color;
            //c.fillRect(particles[i].x, particles[i].y, particles[i].size, particles[i].size);

            c.beginPath();
            c.arc(particles[i].x, particles[i].y, particles[i].size / 2, 0, Math.PI * 2);
            c.fill();
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

    function randomColor() {
        var color = "#";
        var one;
        for (col = 0; col < 6; col++) {
            one = Math.floor(Math.random() * 16);
            if (one > 9) {
                switch (one) {
                    case 10:
                        one = "a"
                        break;
                    case 11:
                        one = "b"
                        break;
                    case 12:
                        one = "c"
                        break;
                    case 13:
                        one = "d"
                        break;
                    case 14:
                        one = "e"
                        break;
                    case 15:
                        one = "f"
                        break;
                }
            }
            color += one;
        }
        return color;
    }
    /* TEST END */







    /* CONSOLE */

    var input = id("input");
    var console = id("console");
    var text = id("text");
    window.addEventListener("keydown", function (e) {
        var key = e.keyCode;
        if (key == 13) {
            text.innerHTML += '>' + input.value + '<br/>';
            check(input.value);
            input.value = '';
        };
        input.focus();
    });
    var commands = {
        hello: function () {
            text.innerHTML += "console: hi! type help for commands :)<br/>";
        },
        help: function () {
            text.innerHTML += "commands:<br/>left / right / jump / crouch / stop / shoot<br/>";
        },
        left: function () {
            player.L = true;
            player.R = false;
            player.facingLeft = true;
        },
        right: function () {
            player.R = true;
            player.L = false;
            player.facingLeft = false;
        },
        jump: function () {
            player.T = true;
        },
        crouch: function () {
            if (!player.crouch)
                player.crouch = true;
            else
                player.crouch = false;
        },
        stop: function () {
            player.L = false;
            player.R = false;
            player.T = false;
            player.B = false;
            player.crouch = false;
        },
        shoot: function () {
            shoot(player.facingLeft)
        }

    }

    function check(inp) {
        if (commands[inp] !== undefined) {
            commands[inp]();
        } else {
            text.innerHTML += "<font color=\"red\">ERROR</font>: command unknown :c<br/>type \'help\' for the command list < br / > ";
        }
    }


    //COLLISION DETECTOR
    function collision(Box1, Box2) {
        var vectorX = (Box1.x + (Box1.width / 2)) - (Box2.x + (Box2.width / 2)),
            vectorY = (Box1.y + (Box1.height / 2)) - (Box2.y + (Box2.height / 2)),
            hWidths = (Box1.width / 2) + (Box2.width / 2),
            hHeights = (Box1.height / 2) + (Box2.height / 2),
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
};
