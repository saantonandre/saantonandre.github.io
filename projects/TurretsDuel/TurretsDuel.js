/*HELLO!!! 
Thanks for actually looking at my code, 
I hope someone could learn something out of this 
or teach me about better practices!

I will now proceed to explain my code, mostly because I will probably 
forget how it works in about 2 weeks after not looking at it 
I'll try to be as brief and explanatory as possible
*/


var clickedOnce = 0;
var chosenClass = 1;
var noteText;

/*silence errors (sounds may randomly cause some, since its sort of hacky to get them playing)*/
function silentErrorHandler() {
    return true;
}
window.onerror = silentErrorHandler;

/*silence console logs (part of the exploit to get the audio playing at program's will)*/
console.log = function () {};

/*thanks to this, indexing to dom elements can be done with just 'id("element")' */
function id(arg) {
    return document.getElementById(arg);
}

/*all this onload function will give interactivity the class menu*/
window.onload = function () {
    id("confirm").addEventListener("click", playGame);
    var one = id("class-1");
    var two = id("class-2");
    var three = id("class-3");
    one.onclick = function () {
        classChoice(one);
    }
    two.onclick = function () {
        classChoice(two);
    }
    three.onclick = function () {
        classChoice(three);
    }
    /*changes the class description*/
    function classChoice(arg) {
        switch (arg) {
            case one:
                chosenClass = 1;
                noteText = "Speciality 1: MINIGUN<br/>Speciality 2: BERSERK<br/><br/>+ no cooldowns on bullets<br/>+ abilities becomes stronger every level";
                id("scout").style.display = "block";
                id("sniper").style.display = "none";
                id("artillery").style.display = "none";
                id("aud3").play();
                break;
            case two:
                chosenClass = 2;
                noteText = "Speciality 1: SUPERSHOT<br/>Speciality 2: TIME STOP<br/><br/>+ the strongest shots <br/>+ cool abilities";
                id("scout").style.display = "none";
                id("sniper").style.display = "block";
                id("artillery").style.display = "none";
                id("aud3").play();
                break;
            case three:
                chosenClass = 3;
                noteText = "Speciality 1: UNDESTRUCTIBLES<br/>Speciality 2: MEGABUFF<br/><br/>+ multiple automatic shots <br/>+ overall weird";
                id("scout").style.display = "none";
                id("sniper").style.display = "none";
                id("artillery").style.display = "block";
                id("aud3").play()
                break;
        }

        one.style.backgroundColor = "";
        one.style.border = "3px solid black";
        two.style.backgroundColor = "";
        two.style.border = "3px solid black";
        three.style.backgroundColor = "";
        three.style.border = "3px solid black";

        arg.style.backgroundColor = "#c94a51";
        arg.style.border = "6px solid white";
        id("note").innerHTML = noteText;
    }
}

/* the actual game program runs after confirming a class*/
function playGame() {
    /*
    now, things will start to get confusing since functions 
    will get called back and forth in no particular order 
    across the whole code so you'll need to be patient...
    */
    
    /*gets called whenever you choose the "change class" option*/
    function backToMenu() {
        pause = true;
        song.pause();
        id("confirm").removeEventListener("click", playGame);
        id("game-ui").style.display = "none";
        id("stats-info").style.display = "none";
        id("start-menu").style.display = "block";
        id("confirm").addEventListener("click", function () {
            switchClass();
            reset();
            whichPlayer();
            id("start-menu").style.display = "none";
            id("game-ui").style.display = "block";
            pause = false;
        });
        song.play();
    }
    /*
    being a single web page, this code switches between 3 main screens
    
    -PAUSE/DEATH SCREEN (only the text changes, but the div is the same)
    -MENU SCREEN
    -GAME SCREEN
    
    they all cover the whole screen, switching will set a display:none to the others
    
    */
    document.ontouch = loadMusic;
    document.onclick = loadMusic;
    id("start-menu").style.display = "none";
    id("game-ui").style.display = "block";
    
    /*loot of variable.. lets skip this pls*/
    var undest = false;
    var song = new Audio("anotherSong.wav");
    song.loop = true;
    song.volume = 0.3;
    var pause = 0;
    var enemy_shoot1 = new Audio("sfx/enemy_shoot1.wav");
    var enemy_shoot2 = new Audio("sfx/enemy_shoot2.wav");
    var enemy_shoot3 = new Audio("sfx/enemy_shoot3.wav");
    var player_shoot = new Audio("sfx/player_shoot.wav");
    var player_buffed_shoot = new Audio("sfx/player_buffed_shoot.wav");
    var player_damaged = new Audio("sfx/player_damaged.wav");

    var enemy_shoot1a = new Audio("sfx/enemy_shoot1.wav");
    var enemy_shoot2a = new Audio("sfx/enemy_shoot2.wav");
    var enemy_shoot3a = new Audio("sfx/enemy_shoot3.wav");
    var player_shoota = new Audio("sfx/player_shoot.wav");
    var player_buffed_shoota = new Audio("sfx/player_buffed_shoot.wav");
    var player_damageda = new Audio("sfx/player_damaged.wav");

    var sp1 = id("sp1");
    var sp2 = id("sp2");
    var canvas = id("canvas");
    var playerHP = id("playerBar");
    var enemyHP = id("enemyBar");
    var enemy2HP = id("enemyBar2");
    var c = canvas.getContext("2d");
    var player, enemy, enemy2;
    c.imageSmoothingEnabled = false;
    var levelSpan = id("level");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight / 100 * 68;
    var levelCounter = 1;
    var playerPNG, playerDMG;
    var enemyPNG = id("enemyTurret");
    var enemyPNG2 = id("enemyTurretP");
    var enemyCannon = id("enemyGun");
    var pointSpan = id("pointSpan");
    var points = 0;
    pointSpan.innerHTML = "SCORE: " + points;
    var score = 0;
    var trailing = 1;
    var leftArrow = id("left")
    var upArrow = id("up")
    var rightArrow = id("right")
    var ammo = 60;
    var rage = true;

    /*stats*/
    var bulletsShot = 0;
    var bulletsShot2 = 0;
    var bulletsHit = 0;
    var bulletsHit2 = 0;
    var bulletsDodge = 0;

    /*changes player's sprite accordingly to the class chosen*/
    function switchClass() {
        switch (chosenClass) {
            case 1:
                playerPNG = id("turret");
                playerDMG = id("turretDamaged");
                break;
            case 2:
                playerPNG = id("turret2");
                playerDMG = id("turret2Damaged");
                break;
            case 3:
                playerPNG = id("turret3");
                playerDMG = id("turret3Damaged");
                break;
        }
    }
    switchClass();
    /* the 'enemy dummy' is the first enemy, the one which will remain always the same
    -PLOT TWIST- other enemies, are just random modifications of this one dummy  */
    function enemyDummy(en) {
        return {
            alive: true,
            x: canvas.width / 5 * 4 - 32,
            y: 0,
            size: 32,
            xVel: 0,
            speed: 3,
            accel: 0,
            left: false,
            right: false,
            bulletSize: 8,
            bulletSpeed: 4,
            color: "#8c6a6c",
            normalColor: "#8c6a6c",
            damagedColor: "#c94a51",
            recharge: false,
            bulletCD: 300,
            HP: 100,
            frame: 3,
            frameCD: 0,
            frenzy: 25,
            shootFx: enemy_shoot2,
            shootFx2: enemy_shoot2a,
            /* spawns projectiles, which with speed and size relative to the previous properties */
            shoot: function () {
                bulletsShot2++;
                this.frame = 0;
                this.frameCD = 0;
                projectiles.push({
                    x: this.x + this.size / 2 - this.bulletSize / 2,
                    y: this.y + this.size - this.bulletSpeed + 3,
                    size: this.bulletSize,
                    speed: this.bulletSpeed,
                    color: this.normalColor
                });
                if (clickedOnce) {
                    if (this.shootFx.paused) {
                        this.shootFx.play().catch(function (e) {
                            console.log("shootfx thisem - " + e)
                        });
                    } else if (this.shootFx2.paused) {
                        this.shootFx2.play().catch(function (e) {
                            console.log("thisem shoot 2 - " + e)
                        });
                    }
                }

            }
        };
    }
    /*gets called every new game, and on death, basically resets all the changed variables*/
    function reset() {
        particles = [];
        if (levelCounter > 1) {
            /*the death screen gets displayed*/
            pause = true;
            id("game-ui").style.display = "none";
            id("stats-info").innerHTML = "<div id='pause' style='color:#c94a51'>U DED :(</div>STATS<br/><br/>LEVEL REACHED: " + levelCounter + "<br/>SCORE: " + score + "<br/><br/>BULLETS HIT: " + bulletsHit + " / " + bulletsShot + "<br/>ACCURACY: " + (100 - ((bulletsShot - bulletsHit) / bulletsShot * 100)).toFixed(1) + "%" + "<br/><br/>BULLETS DODGED: "+(bulletsShot2-bulletsHit2) + " / " + (bulletsShot2) + "<br/>ELUSION: " + (100 - ((bulletsShot2 - (bulletsShot2-bulletsHit2)) / bulletsShot2 * 100)).toFixed(1) + "%" + "<br/><br/><div style='text-align:center;'><div id='OK'>RESTART</div><br/><br/><div id='change'>CHANGE CLASS</div></div>";
            id("stats-info").style.display = "block";
            id("OK").addEventListener("click", function () {
                id("stats-info").style.display = "none";
                pause = false;
                id("game-ui").style.display = "block";
            })
            id("change").addEventListener("click", backToMenu);
        }
        bulletsShot = 0;
        bulletsShot2 = 0;
        bulletsHit = 0;
        bulletsHit2 = 0;
        bulletsDodge = 0;
        enemy2 = enemyDummy(enemy2);
        enemy2.HP = 0;
        enemy2HP.style.display = "none";
        enemyHP.style.height = "100%";
        score = 0;
        points = 0;
        pointSpan.innerHTML = "SCORE: " + points;
        trailing = 1;
        rage = true;
        if (ammo === 0) {
            ammo = 60;
            sp1.style.opacity = "1";
        }
        sp2.style.opacity = "1";
        player = {
            x: canvas.width / 5,
            y: canvas.height - 32,
            size: 32,
            xVel: 0,
            speed: 5,
            accel: 0,
            left: false,
            right: false,
            bulletSize: 8,
            bulletSpeed: -16,
            PNG: playerPNG,
            color: "#4b4b5b",
            normalPNG: playerPNG,
            damagedPNG: playerDMG,
            HP: 100,
            frame: 3,
            frameCD: 0,
            shootFx: player_shoot,
            damageFx: player_damaged,
            shootFx2: player_shoota,
            damageFx2: player_damageda,
            bulletCD: 0,
            recharge: false,
            token: 1,
            token2: 1,
            shots: 1,

            shoot: function (argg) {
                if (chosenClass === 3 && argg === false) {
                    player.recharge = true;
                    for (i = 1; i <= player.shots; i++) {
                        setTimeout(function () {
                            player.shoot(true);
                            setTimeout(function () {
                                player.recharge = false;
                            }, player.bulletCD);
                        }, 50 * i);

                    }
                }
                bulletsShot++;
                player.frame = 0;
                player.frameCD = 0;
                projectiles.push({
                    x: player.x + player.size / 2 - player.bulletSize / 2,
                    y: player.y - player.bulletSpeed - player.bulletSize,
                    size: player.bulletSize,
                    speed: player.bulletSpeed,
                    color: player.color,
                    damage: player.bulletDamage,
                    und: undest
                });
                if (clickedOnce) {
                    if (player.shootFx.paused) {
                        player.shootFx.play().catch(function (e) {
                            console.log("player shoot - " + e)
                        });
                    } else if (player.shootFx2.paused) {
                        player.shootFx2.play().catch(function (e) {
                            console.log("player shoot a - " + e)
                        });
                    }
                }
                if (chosenClass === 2) {
                    player.recharge = true;
                    setTimeout(function () {
                        player.recharge = false;
                    }, player.bulletCD)
                }
            }


        };
        whichPlayer();
        enemy = enemyDummy(enemy);
        projectiles = [];
        levelCounter = 1;
        levelSpan.innerHTML = "LEVEL " + levelCounter + "<br/><span>tap here for pause/info</span>";
        enemyHP.style.backgroundColor = enemy.normalColor;
    }
    reset();
    
    /*changes player properties accordingly to the chosen class*/
    function whichPlayer() {
        player.bulletDamage = player.bulletSize
        switch (chosenClass) {
            case 1:
                break;
            case 2:
                player.bulletDamage = 30;
                player.bulletCD = 500;
                player.bulletSize = 6;
                player.speed = 4;
                break;
            case 3:
                player.bulletDamage = 12;
                player.bulletCD = 700;
                player.bulletSize = 12;
                player.bulletSpeed = -8;
                player.speed = 6;
                break;
        }
    }
    /*tricky solution to get the audio playing on mobile, for further informations just 
    look at the reply I gave to </JoakimNyland> down in the comments*/
    function loadMusic() {
        if (!clickedOnce) {
            song.play().catch(function (e) {
                console.log("song - " + e)
            });
            enemy_shoot1.play().then(function () {
                enemy_shoot1.pause()
            }).catch(function (e) {
                console.log("enemy_shoot1 - " + e)
            });
            enemy_shoot2.play().then(function () {
                enemy_shoot2.pause()
            }).catch(function (e) {
                console.log("enemy_shoot2 - " + e)
            });
            enemy_shoot3.play().then(function () {
                enemy_shoot3.pause()
            }).catch(function (e) {
                console.log("enemy_shoot3 - " + e)
            });
            player_shoot.play().then(function () {
                player_shoot.pause()
            }).catch(function (e) {
                console.log("player_shoot - " + e)
            });
            player_buffed_shoot.play().then(function () {
                player_buffed_shoot.pause()
            }).catch(function (e) {
                console.log("player_buffed_shoot - " + e)
            });
            player_damaged.play().then(function () {
                player_damaged.pause()
            }).catch(function (e) {
                console.log("player_damaged - " + e)
            });


            enemy_shoot1a.play().then(function () {
                enemy_shoot1a.pause()
            }).catch(function (e) {
                console.log("enemy_shoot1a - " + e)
            });
            enemy_shoot2a.play().then(function () {
                enemy_shoot2a.pause()
            }).catch(function (e) {
                console.log("enemy_shoot2a - " + e)
            });
            enemy_shoot3a.play().then(function () {
                enemy_shoot3a.pause()
            }).catch(function (e) {
                console.log("enemy_shoot3a - " + e)
            });
            player_shoota.play().then(function () {
                player_shoota.pause()
            }).catch(function (e) {
                console.log("player_shoota - " + e)
            });
            player_buffed_shoota.play().then(function () {
                player_buffed_shoota.pause()
            }).catch(function (e) {
                console.log("player_buffed_shoota - " + e)
            });
            player_damageda.play().then(function () {
                player_damageda.pause()
            }).catch(function (e) {
                console.log("player_damageda - " + e)
            });

            clickedOnce = 1;
        }
    }
    /*when the game is paused, these description will appear accordingly to the class you chose*/
    var abilities = ["<br/>SP1= <font color='#c94a51'>MINIGUN</font>: you become an automatic minigun but your speed gets significantly reduced (120 shots)<br/>SP2= <font color='#c94a51'>BERSERK</font>: halves your current HPs to gain bullet size, damage and speed (4 seconds)", "<br/>SP1= <font color='#c94a51'>SUPERSHOT</font>: you shoot a big bullet... yeah i did ran out of ideas<br/>SP2= <font color='#c94a51'>TIME STOP</font>: this one is my favourite, you stop bullets and enemies, while you can still move and shoot (3.5 seconds)", "<br/>SP1= <font color='#c94a51'>MEGABUFF</font>: halves your current HPs to gain 2 more bullets per shot, more damage and move a little slower (4 seconds)<br/>SP2= <font color='#c94a51'>UNDESTRUCTIBLES</font>: your projectile will destroy everything in their way, no matter the size (3 seconds)"];
    levelSpan.onclick = function () {
        pause = true;
        id("game-ui").style.display = "none";
        id("stats-info").innerHTML = "<div id='pause'>GAME PAUSED</div>ABILITIES:" + abilities[chosenClass - 1] + "<br/><br/>HINTS:<br/>-Tap on the up arrow to shoot<br/>-Enemies are randomly generated (except for the first one)<br/>-Bigger bullets deals more damage and destroy smaller ones<br/>-Game over makes you restart from level 1<br/>Every win will restore 20% of your total health <br/><br/><div style='text-align:center;'><div id='OK'>CONTINUE PLAYING</div><br/><br/><div id='change'>CHANGE CLASS</div></div>";
        id("stats-info").style.display = "block";
        id("OK").addEventListener("click", function () {
            id("stats-info").style.display = "none";
            pause = false;
            id("game-ui").style.display = "block";
        })
        id("change").addEventListener("click", backToMenu);

    }
    /*calculations for the amount of points you deserve after a kill*/
    function scoreGain(en) {
        var sum = (en.size / 32 * 10) + (en.speed * 3.3) + (1000 / en.bulletCD) + (en.bulletSize * 2.5) + (en.bulletSpeed * 1.25);
        return Math.floor(sum);
    }
    /*as you may already know the enemies are randomly generated -to some extent-
    minimum and maximum ranges will change relatively to the level you reached
    this function is the one wich will chose the next enemy you'll have to duel with
    */
    function newEnemy(en) {
        en.HP = 100;
        en.x = canvas.width / 5 * 4 - 32 - levelCounter;
        en.size = Math.random() * 60 + 15 + (levelCounter * 2);
        en.speed = Math.random() * 5 + (levelCounter / 15);
        en.bulletSize = Math.random() * (en.size - 9) + 3;
        en.bulletSpeed = Math.random() * 10 + (levelCounter / 4);
        en.bulletCD = (Math.random() * (en.bulletSize * 8) * (en.speed * 6) * en.bulletSpeed * 8) / (100 + levelCounter * 2) + en.bulletSize * 10;
        projectiles = [];
        en.frenzy = Math.random() * 100 + 10;
        en.normalColor = randomColor();
        en.color = en.normalColor;
        en.recharge = false;
        en.shootFx = whichShootFx(en.size);
        en.shootFx2 = whichShootFx2(en.size);
        enemyHP.style.backgroundColor = en.normalColor;
        en.shoot = function () {
            bulletsShot2++;
            en.frame = 0;
            en.frameCD = 0;
            projectiles.push({
                x: en.x + en.size / 2 - en.bulletSize / 2,
                y: en.y + en.size - en.bulletSpeed + 3,
                size: en.bulletSize,
                speed: en.bulletSpeed,
                color: en.normalColor,
                damage: en.bulletSize
            });
            if (clickedOnce) {
                if (en.shootFx.paused) {
                    en.shootFx.play().catch(function (e) {
                        console.log("shootfx enem - " + e)
                    });
                } else if (en.shootFx2.paused) {
                    en.shootFx2.play().catch(function (e) {
                        console.log("enem shoot 2 - " + e)
                    });
                }
            }
        };

    }
    /*does many stuff to clean up the battle scene, HP's and stuffs*/
    function nextLevel() {
        score += scoreGain(enemy);
        if (levelCounter % 5 === 0) {
            score += scoreGain(enemy2);
        }
        levelCounter++;
        rage = true;
        player.token = 1;
        player.token2 = 1;
        if (ammo === 0) {
            ammo = 60 + (levelCounter * 2);
            sp1.style.opacity = "1";
        }
        if (chosenClass !== 1) {
            sp1.style.opacity = "1";
        }
        sp2.style.opacity = "1";
        player.HP += 20;
        if (player.HP > 100) {
            player.HP = 100;
        }
        levelSpan.innerHTML = "LEVEL " + levelCounter + "<br/><span>tap here for pause/info</span>";
        player.x = canvas.width / 5;
        newEnemy(enemy);
        if (levelCounter % 5 === 0) {
            newEnemy(enemy2);
            enemyHP.style.height = "50%";
            enemy2HP.style.display = "block";
            enemy2HP.style.backgroundColor = enemy2.normalColor;
        } else {
            enemyHP.style.height = "100%";
            enemy2.HP = 0
            enemy2HP.style.display = "none";
        }
        enemyHP.style.backgroundColor = enemy.normalColor;

    }
    /* mhmhmh...*/
    function mhmh() {
        if (levelCounter > 300) levelSpan.innerHTML = "ok, ok, you won";
        if (levelCounter > 400) levelSpan.innerHTML = "flashing colors may cause<br/>epileptic attacks-->";
        if (levelCounter > 500) levelSpan.innerHTML = "what are you trying to achieve exactly?!!";
        if (levelCounter > 600) {
            levelSpan.innerHTML = "WHEN YOU STOPPED HAVE FUN";
            pointSpan.innerHTML = "ABOUT 5 MINUTES AGO (btw level " + levelCounter + ")"
        }
    }
    /*barely noticeable, but enemy audios differs relatively to their size*/
    function whichShootFx(sz) {
        if (sz < 30) {
            return enemy_shoot1
        } else if (sz < 50) {
            return enemy_shoot2
        } else {
            return enemy_shoot3
        }
    }
    /*duplicate of the above, since many enemies shoots really fast
    and if audio can't be played because already playing, here's the solution*/
    function whichShootFx2(sz) {
        if (sz < 30) {
            return enemy_shoot1a
        } else if (sz < 60) {
            return enemy_shoot2a
        } else {
            return enemy_shoot3a
        }
    }
    
    /*one of the core functions, calculates what every projectile should do for every frame*/
    function drawProjectiles() {
        var removeList = [];
        for (i = 0; i < projectiles.length; i++) {
            if (!timeStop)
                projectiles[i].y += projectiles[i].speed;
            if (projectiles[i].y > canvas.height - projectiles[i].size || projectiles[i].y < -projectiles[i].size) {
                if (projectiles[i].y > canvas.height - projectiles[i].size) {
                    bulletsDodge++;
                }
                explosion(projectiles[i]);

                removeList.push(i);
            } else {
                c.fillStyle = projectiles[i].color;
                c.fillRect(projectiles[i].x, projectiles[i].y, projectiles[i].size, projectiles[i].size);
            }
            for (j = 0; j < projectiles.length; j++) {
                if (j == i) {
                    continue
                }
                if (projectiles[i].color != projectiles[j].color) {
                    if (collided(projectiles[i], projectiles[j])) {
                        if (projectiles[i].und) {
                            explosion(projectiles[j]);
                            removeList.push(j);
                        } else if (projectiles[j].und) {

                            explosion(projectiles[i]);
                            removeList.push(i);
                        } else if (projectiles[i].size < projectiles[j].size) {

                            explosion(projectiles[i]);
                            removeList.push(i);
                        } else if (projectiles[j].size < projectiles[i].size) {

                            explosion(projectiles[j]);
                            removeList.push(j);
                        }
                    }

                }
            }
            /* checking collisions with enemy */
            if (enemy.HP > 0) {
                if (collided(projectiles[i], enemy)) {

                    enemy.color = enemy.damagedColor;
                    setTimeout(function () {
                        enemy.color = enemy.normalColor;
                    }, 100);
                    if (projectiles[i].color == "#4b4b5b" || projectiles[i].color == "#c94a51") {
                        bulletsHit++;
                    }

                    explosion(projectiles[i]);
                    removeList.push(i);
                    enemy.HP -= projectiles[i].damage / (levelCounter / 20 + 1);
                    if (enemy.HP < 0) {
                        enemy.HP = 0;
                    }
                }
            }
            if (enemy2.HP > 0) {
                if (collided(projectiles[i], enemy2)) {

                    enemy2.color = enemy2.damagedColor;
                    setTimeout(function () {
                        enemy2.color = enemy2.normalColor;
                    }, 100);
                    if (projectiles[i].color == "#4b4b5b" || projectiles[i].color == "#c94a51") {
                        bulletsHit++;
                    }

                    explosion(projectiles[i]);
                    removeList.push(i);
                    enemy2.HP -= projectiles[i].damage / (levelCounter / 10 + 1);
                    if (enemy2.HP < 0) {
                        enemy2.HP = 0;
                    }
                }
            }
            /* checking collisions with player */
            if (!(projectiles[i].color == "#4b4b5b") && !(projectiles[i].color == "#c94a51")) {
                if (collided(projectiles[i], player)) {
                    player.PNG = player.damagedPNG;
                    setTimeout(function () {
                        player.PNG = player.normalPNG;
                    }, 100);
                    bulletsHit2++;
                    explosion(projectiles[i]);
                    removeList.push(i);
                    player.HP -= projectiles[i].size;
                    if (clickedOnce) {
                        if (player.damageFx.paused) {
                            player.damageFx.play().catch(function (e) {
                                console.log("enemy_shoot1 - " + e)
                            });
                        } else if (player.damageFx2.paused) {
                            player.damageFx2.play().catch(function (e) {
                                console.log("enemy_shoot1 - " + e)
                            });
                        }
                    }
                    if (player.HP < 0) {
                        player.HP = 0;
                        reset();
                    }
                }
            }
        }

        for (i = 0; i < removeList.length; i++) {
            projectiles.splice(removeList[i], 1);
        }
    }

    /*the particles rendering, the code could work without this, 
    but there are very few "eye candies" so I can afford this one */
    var particles = [];

    function explosion(bullet) {
        var color = bullet.color;
        var x = bullet.x;
        var y = bullet.y;
        var speed = -bullet.speed;
        var randNum = Math.floor(Math.random() * 10) + 1;
        for (iter = 0; iter < randNum; iter++) {
            particles.push({
                xVel: Math.random() * (speed) - speed / 2,
                yVel: Math.random() * speed / 2,
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
            c.fillRect(particles[i].x, particles[i].y, particles[i].size, particles[i].size);
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
    
    /*renders the player sprite and calculates its movements*/
    function drawPlayer() {
        /* player's x velocity calculations */
        if (player.left) {
            player.accel = -0.5
        } else if (player.right) {
            player.accel = 0.5
        } else {
            player.accel = 0;
            if (player.xVel !== 0) {
                (player.xVel > 0) ? player.accel = -0.125: player.accel = +0.125;
            }
        }

        /* speed check */
        if (player.xVel > player.speed) {
            player.xVel = player.speed
        }
        if (player.xVel < -player.speed) {
            player.xVel = -player.speed
        }

        /* keys up check */


        player.xVel += player.accel;
        player.x += player.xVel;

        /* setting bounds */
        if (player.x <= 0) {
            player.x = 0
        }
        if (player.x + player.size > canvas.width) {
            player.x = canvas.width - player.size
        }

        /* player's rendering*/
        if (player.frame < 3) {
            player.frameCD++;
            player.frame = Math.floor(player.frameCD / 4)
        } else {
            player.frameCD = 0
        }
        c.drawImage(player.PNG, 0, 32 * player.frame, 32, 32, player.x, player.y, player.size, player.size);
        //c.fillRect(player.x, player.y, player.size, player.size);
    }
    /*same as the above but different, since its the computer which gives it control inputs*/
    function drawEnemy(en) {
        if (en.HP > 0) {
            if (!timeStop) {
                if (player.x + (player.size / 2 - player.size / 3) > en.x + (en.size / 2 + en.bulletSize / 2)) {
                    en.right = true;
                    en.left = false;
                } else if (player.x + (player.size / 2 + player.size / 3) < en.x + (en.size / 2 - en.bulletSize / 2)) {
                    en.left = true;
                    en.right = false;
                } else {
                    en.left = false;
                    en.right = false;
                }
                if (player.x + player.size > en.x + (en.size / 2 - en.bulletSize / 2) && player.x < en.x + (en.size / 2 + en.bulletSize / 2)) {
                    if (!en.recharge) {
                        en.shoot();
                        en.recharge = true;
                        setTimeout(function () {
                            en.recharge = false
                        }, en.bulletCD);
                    }

                }
                /* en's x velocity calculations */
                if (en.left) {
                    en.accel = -en.speed / en.frenzy;
                } else if (en.right) {
                    en.accel = en.speed / en.frenzy;
                } else {
                    en.accel = 0;
                    if (en.xVel !== 0) {
                        (en.xVel > 0) ? en.accel = -0.125: en.accel = +0.125;
                    }
                }
                /* speed check */
                if (en.xVel > en.speed) {
                    en.xVel = en.speed
                }
                if (en.xVel < -en.speed) {
                    en.xVel = -en.speed
                }




                en.xVel += en.accel;
                en.x += en.xVel;

                /* setting bounds */
                if (en.x <= 0) {
                    en.x = 0
                }
                if (en.x + en.size > canvas.width) {
                    en.x = canvas.width - en.size
                }
            }




            c.fillStyle = en.color;
            c.fillRect(en.x, en.y, en.size, en.size / 4 * 3);
            c.globalAlpha = 0.4;
            c.drawImage(enemyPNG, en.x - 1, en.y - 1, en.size + 1, en.size / 4 * 3 + 1);
            c.globalAlpha = 1;
            c.drawImage(enemyPNG2, en.x - 1, en.y - 1, en.size + 1, en.size / 4 * 3 + 1);
            if (en.frame < 3) {
                en.frameCD++;
                en.frame = Math.floor(en.frameCD / 4)
            } else {
                en.frameCD = 0
            }
            c.drawImage(enemyCannon, 0, 32 * en.frame, 32, 16, en.x + en.size / 2 - en.bulletSize / 2, en.size / 4 * 3, en.bulletSize, en.size / 2);
        } else {
            if (enemy.HP === 0 && enemy2.HP === 0)
                nextLevel()
        }

    }

    var timeStop = 0;
    
    /*the actual game loop! this is what glues all the functions togethe
    and will call them all every frame */
    requestAnimationFrame(loop);
    function loop() {
        if (!pause) {
            c.fillStyle = "rgba(27, 27, 28," + trailing + ")";
            c.fillRect(0, 0, canvas.width, canvas.height);
            drawPlayer();
            drawProjectiles();
            renderParticles();
            drawEnemy(enemy);
            if (levelCounter % 5 === 0) {
                drawEnemy(enemy2);
            }

            refreshHP();
            if (points < score) {
                points++;
                pointSpan.innerHTML = "SCORE: " + points;
            }
            mhmh();
        }
        requestAnimationFrame(loop)

    }
    /* changes HP bars' length accordingly to... yeah the hp*/
    function refreshHP() {
        playerHP.style.width = player.HP + "%";
        enemyHP.style.width = enemy.HP + "%";
        if (levelCounter % 5 === 0)
            enemy2HP.style.width = enemy2.HP + "%";
    }
    
    /* The following are the classes abilities */
    function minigun() {
        if (ammo > 0) {
            player.speed = 2;
            player.bulletSpeed = -20;
            player.bulletSize = 3;
            player.bulletDamage = 4;
            player.shoot(false);
            ammo -= 0.5;
            setTimeout(minigun, 10)
        } else {
            player.speed = 5;
            player.bulletSpeed = -16;
            player.bulletSize = 8;
            player.bulletDamage = 8;
        }
    }

    function berserk() {
        if (rage) {
            player.speed = 10 + levelCounter / 2;
            player.bulletSize = 25 + levelCounter / 2;
            player.bulletDamage = player.bulletSize;
            player.color = "#c94a51";
            player.HP /= 2;
            player.normalPNG = playerDMG;
            player.PNG = playerDMG;
            player.shootFx = player_buffed_shoot;
            player.shootFx2 = player_buffed_shoota;
            rage = false;
            trailing = 0.3;
            setTimeout(function () {
                rage = false;
                sp2.style.opacity = 0.5;
                berserk()
            }, 4000 + levelCounter * 50);
        } else {
            trailing = 1;
            player.speed = 5;
            player.bulletSize = 8;
            player.bulletDamage = player.bulletSize;
            player.color = "#4b4b5b";
            player.normalPNG = playerPNG;
            player.PNG = playerPNG;
            player.shootFx = player_shoot;
            player.shootFx2 = player_shoota;
        }
    }



    function stopTime() {
        if (player.token) {
            timeStop = 1;
            player.speed = 2;
            setTimeout(function () {
                timeStop = 0;
                player.speed = 4;
            }, 3500)
            player.token = 0;
        }
    }

    function superShot() {
        if (player.token2) {
            var r1 = player.bulletSize;
            var r2 = player.bulletDamage;
            var r3 = player.bulletSpeed;
            player.bulletSize = 50;
            player.bulletDamage = 40;
            player.bulletSpeed = -5;
            player.recharge = false;
            player.shoot(false);

            player.bulletSize = r1;
            player.bulletDamage = r2;
            player.bulletSpeed = r3;
            player.token2 = 0;
        }
    }

    function buff() {
        if (player.token) {
            var r1 = player.bulletSize;

            player.color = "#c94a51";
            player.HP /= 2;
            player.normalPNG = playerDMG;
            player.PNG = playerDMG;
            player.shootFx = player_buffed_shoot;
            player.shootFx2 = player_buffed_shoota;
            player.speed = 3;
            player.shots = 3;
            player.bulletSize = 20;
            player.bulletCD = 500;

            setTimeout(function () {
                player.speed = 6;
                player.shots = 1;
                player.bulletSize = r1;
                player.bulletCD = 700;
                player.color = "#4b4b5b";
                player.normalPNG = playerPNG;
                player.PNG = playerPNG;
                player.shootFx = player_shoot;
                player.shootFx2 = player_shoota;

            }, 4000);

            player.token = 0;
        }
    }

    function undestructibles() {
        if (player.token2) {
            undest = true;
            player.color = "black";
            setTimeout(function () {
                undest = false;
                player.color = "#4b4b5b";
            }, 3000);
            player.token2 = 0;
        }
    }

    /* PC controls */
    window.addEventListener("keydown", function (event) {
        var key = event.keyCode;
        switch (key) {
            case 39: //right key down
                //rightButtonDown();
                player.right = true;
                break;
            case 37: //left key down
                //leftButtonDown();
                player.left = true;
                break;
            case 67: //c key down
                //leftButtonDown();
                switch (chosenClass) {
                    case 1:
                        berserk();
                        break;
                    case 2:
                        stopTime();
                        break;
                    case 3:
                        undestructibles();
                        break;
                }
                break;
            case 88: //x key down
                //leftButtonDown();
                switch (chosenClass) {
                    case 1:
                        minigun();
                        break;
                    case 2:
                        superShot();
                        break;
                    case 3:
                        buff();
                        break;
                }
                break;
            case 90: //left key down
                //leftButtonDown();
                if (!player.recharge)
                    player.shoot(false);
                break;
        }
    });
    window.addEventListener("keyup", function (event) {
        var key = event.keyCode;
        switch (key) {
            case 39: //right key up
                //rightButtonUp();
                player.right = false;
                break;
            case 37: //left key up
                //leftButtonUp();
                player.left = false;
                break;
        }
    });





    /* MOBILE controls */

    leftArrow.addEventListener("touchstart", function () {
        player.left = true
        leftArrow.style.transform = "scale(1.5)";
        leftArrow.style.opacity = "1";
    });
    rightArrow.addEventListener("touchstart", function () {
        player.right = true
        rightArrow.style.transform = "scale(1.5)";
        rightArrow.style.opacity = "1";
    });
    upArrow.addEventListener("touchstart", function () {

        if (!player.recharge) {
            player.shoot(false);
        }
        upArrow.style.transform = "scale(1.5)";
        upArrow.style.opacity = "1";
    });
    upArrow.addEventListener("touchend", function () {
        upArrow.style.transform = "";
        upArrow.style.opacity = "0.5";
    });

    leftArrow.addEventListener("touchend", function () {
        player.left = false
        leftArrow.style.transform = "";
        leftArrow.style.opacity = "0.5";
    });
    rightArrow.addEventListener("touchend", function () {
        player.right = false
        rightArrow.style.transform = "";
        rightArrow.style.opacity = "0.5";
    });

    sp1.addEventListener("touchstart", function () {

        switch (chosenClass) {
            case 1:
                minigun();
                break;
            case 2:
                superShot();
                break;
            case 3:
                buff();
                break;
        }

        sp1.style.opacity = "0.5";
    });
    sp2.addEventListener("touchstart", function () {

        switch (chosenClass) {
            case 1:
                berserk();
                break;
            case 2:
                stopTime();
                break;
            case 3:
                undestructibles();
                break;
        }
        sp2.style.opacity = "0.5";
    });
    
    /*the collision detector*/
    function collided(square1, square2) {
        if (square1.x < square2.x + square2.size) {
            if (square1.x + square1.size > square2.x) {
                if (square1.y < square2.y + square2.size) {
                    if (square1.y + square1.size > square2.y) {
                        return true;
                    }
                }
            }
        }
        return false;
    }
    /*gives random colors to enemies (and so their projectiles)*/
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
}; // END (special thanks to you, if you managed to get here) -saantonandre
