// Whole-script strict mode syntax
'use strict';
/*jshint esversion: 6 */
/*jslint bitwise: true */
var ratio;
var tilesWidth;
var tilesHeight;
var ratio = 1;
var gameStarted = false;
var canStorage = supports_html5_storage();

var loopMode = 1;
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

function supports_html5_storage() {
    try {
        return 'localStorage' in window && window['localStorage'] !== null;
    } catch (e) {
        return false;
    }
}
window.onload = loadGame;

function loadGame() {
    var goldenUnlocked = false,
        goldenNotice = false;
    var windowFocused = true;
    window.onblur = function () {
        windowFocused = false;
        console.log("not playing");
    };
    window.onfocus = function () {
        windowFocused = true;
        console.log("playing");
    };
    document.onblur = window.onblur;
    document.focus = window.focus;

    /*KONGREGATE
    if (typeof kongregate !== "undefined") {
        kongregate.stats.submit('goodEnding', 0);
        kongregate.stats.submit('badEnding', 0);
        kongregate.stats.submit('goldenEnding', 0);
    } else {
        console.log("failed to load the kongregate API");
    }
    /*kg*/
    var spriteSheet = id("sheet");
    var sheets = ["resources/sheet11.png", "resources/sheetWarmPalette.png"];
    var sheetsColors = [["#2299dd", "#222034", "#000000", "#cbdbfc"], ["#e5b083", "#e5b083", "#e5b083", "#20283d"]];
    var selectedSheet = 0;
    if (!canStorage) {
        id("disclaimer").innerHTML = "note: your browser is unable to preserve your progress";
        id("disclaimer").style.color = "#ac3232";
    } else {
        if (localStorage["golden"]) {
            goldenUnlocked = true;
        }
    }
    var menuUI = {
        visible: true,
        selected: 0,
        buttons: [id("newGame"), id("continue"), id("dialogueBtn"), id("music2"), id("audio2")]
    };
    var pauseUI = {
        visible: false,
        selected: 0,
        buttons: [id("music"), id("audio"), id("dialogues"), id("ctrlButton"), id("menuButton")]
    };

    class Session {
        constructor() {
            this.device = "pc";
            this.level = 0;
            this.deathsN = 0;
            this.deaths = [];
            this.retention = 0;
            this.dialogues = "ON";
            this.gamepad = false;
            this.endTime = 0;
        }
    }
    var session = new Session();
    var pizzaGuy = {
        hitbox: {
            x: 0,
            y: 0,
            w: 0,
            h: 0
        }
    };
    var gamepadOn = false;

    id("loading").style.display = "none";
    var canvas = id("canvas");
    var c = canvas.getContext("2d");

    var biome = 1;
    var map = [{
        x: 2,
        y: 7,
        w: 12,
        h: 2,
        type: 4
}, {
        x: 11,
        y: 6,
        w: 3,
        h: 1,
        type: 1
}];
    var spawnPoint = {
        x: 3,
        y: 5
    };

    var mapTester = true;
    if (window.opener) {
        if (window.opener.mapObject) {
            console.log(window.opener.mapObject);
            safeEval(window.opener.mapObject);
        } else {
            safeEval(window.opener.map);
        }
    } else {
        mapTester = false;
    }
    var dialogueOn = true;
    var currentLevel = 0;
    var displaySpacebar = false; // [spacebar] to read
    var stats = {
        blocks: 0,
        col1: 0,
        col2: 0,
        col3: 0,
        colPoints: 0
    };
    var tileSize = 16;
    var ratioWidth, ratioHeight, biggestPossible;

    var rWidth = Math.floor(window.innerWidth / (tileSize * 20));
    var rHeight = Math.floor(window.innerHeight / (tileSize * 15));
    if (rWidth !== rHeight) {
        biggestPossible = rWidth < rHeight ? rWidth : rHeight;
    } else {
        biggestPossible = rHeight;
    }
    id("container").style.width = (tileSize * 20 * biggestPossible) + "px";
    id("container").style.height = (tileSize * 15 * biggestPossible) + "px";

    function adjustScreen(device) {
        switch (device) {
            case "mobile":
                tilesWidth = window.innerWidth / 32 | 0;
                tilesHeight = window.innerHeight / 32 | 0;
                break;
            case "pc":
                tilesWidth = 20;
                tilesHeight = 15;
                break;
        }
        biggestPossible = 1;
        ratioWidth = Math.floor(window.innerWidth / (tileSize * tilesWidth));
        ratioHeight = Math.floor(window.innerHeight / (tileSize * tilesHeight));
        if (ratioWidth !== ratioHeight) {
            biggestPossible = ratioWidth < ratioHeight ? ratioWidth : ratioHeight;
        } else {
            biggestPossible = ratioHeight;
        }
        if (biggestPossible < 1) {
            biggestPossible = 1;
        }
        canvas.width = tileSize * tilesWidth * biggestPossible | 0;
        canvas.height = tileSize * tilesHeight * biggestPossible | 0;
        canvas.width -= canvas.width % 16;
        canvas.heigth -= canvas.heigth % 16;
        ratio = canvas.width / (tilesWidth) | 0;
        //UI
        id("container").style.width = canvas.width + "px";
        id("container").style.height = canvas.height + "px";

        c.imageSmoothingEnabled = false;
    }
    // Pixel perfection

    //CAMERA
    var watchDown = false;
    var cameraType = 0;
    var shake = 0;
    var shakeArr = [-2, +5, -5, +2];


    var visualFxs = [];

    var bgTiles = [];

    //MONSTERS
    var monsters = [];
    var series = 0; //a unique identificative number for each monster

    //TEXTS
    var textsRemoveList = [];
    var texts = [];

    //UI
    var gamePaused = mapTester ? false : true;
    //biomes/background
    var bgColor = sheetsColors[selectedSheet][1];
    var mapHeight = 0;
    var mapWidth = 0;
    //Canvas-related variables
    var paused = 1;
    var fps = false;
    var gForce = 0.016;
    var mapX = 0;
    var mapY = 0;
    var tiles = [
        [4, 4], [5, 4], [6, 4], //grass top
        [4, 5], [5, 5], [6, 5], //grass middle
        [4, 6], [5, 6], [6, 6], //grass bottom
        [7, 4], [8, 4], [9, 4], //rock top
        [7, 5], [8, 5], //rock to grass
        [7, 6], [8, 6], [9, 6], //grass short
        [11, 4], //bouncy ball
        [10, 4], //animated grass
        [12, 5], //speeder
        [5, 7], [6, 7], [7, 7], //stone top
        [5, 8], [6, 8], [7, 8], //stone middle
        [5, 9], [6, 9], [7, 9], //stone bottom
        [5, 10], [6, 10], [7, 10], //stone 2 top
        [5, 11], [6, 11], [7, 11], //stone 2 middle
        [5, 12], [6, 12], [7, 12], //stone 2 bottom
        [8, 12], [9, 12], [10, 12], //stone 3
        [9, 8], //stone single
        [13, 5], [13, 6], [13, 7], [13, 8], //traps rock
        [14, 5], [14, 6], [14, 7], [14, 8], //traps stone
        [12, 0], //slime spawn
        [12, 8], //speeder 2
        [10, 8], [10, 9], [10, 10], [10, 11], // banner
        [8, 10], [9, 10], [8, 11], [9, 11], // chandelier
        [8, 9], // skeleton
        [9, 7], // background rock
        [8, 7], [8, 8], // throne
        [13, 12], // crystal
        [16, 6], // door
        [7, 14], // book
        [15, 5], [15, 9], // trap on/off
        [8, 13], // stone pile
        [5, 17], // dialogue
        [1, 18], // falling stone
        [0, 20], // breakable stone
        [8, 0], // clock
        [5, 17], // dialogue
        [5, 17], // dialogue
        [19, 17], // 0.01
        [20, 17], // 0.05
        [21, 17], // 0.10
        [16, 21], // pizza guy
        [5, 17], // dialogue
    ];

    var audio = {
        jump: new Audio("resources/soundFxs/jump.mp3"),
        bounce1: new Audio("resources/soundFxs/bounce1.mp3"),
        bounce2: new Audio("resources/soundFxs/bounce2.mp3"),
        bounce3: new Audio("resources/soundFxs/bounce3.mp3"),
        bounce4: new Audio("resources/soundFxs/bounce4.mp3"),
        speed1: new Audio("resources/soundFxs/speed1.mp3"),
        speed2: new Audio("resources/soundFxs/speed2.mp3"),
        dash: new Audio("resources/soundFxs/dash.mp3"),
        death: new Audio("resources/soundFxs/death.mp3"),
        crystal: new Audio("resources/soundFxs/crystal.mp3"),
        walking: new Audio("resources/soundFxs/walking.mp3"),
        attack: new Audio("resources/soundFxs/sword-attack.mp3"),
        hit: new Audio("resources/soundFxs/sword-hit.mp3"),
        ambient_1: new Audio("resources/soundFxs/ambient/outside.mp3"),
        ambient_2: new Audio("resources/soundFxs/ambient/castle.mp3"),
        spikes1: new Audio("resources/soundFxs/spikes1.mp3"),
        spikes2: new Audio("resources/soundFxs/spikes2.mp3"),
        tremble: new Audio("resources/soundFxs/tremble.mp3"),
        fall: new Audio("resources/soundFxs/fall.mp3"),
        portal: new Audio("resources/soundFxs/portal.mp3"),
        money_1: new Audio("resources/soundFxs/money-1.mp3"),
        money_2: new Audio("resources/soundFxs/money-2.mp3"),
        money_3: new Audio("resources/soundFxs/money-3.mp3"),
        haydn_1: new Audio("resources/soundFxs/music/Haydn-1.mp3"),
        haydn_2: new Audio("resources/soundFxs/music/Haydn-2.mp3"),
        bach_3: new Audio("resources/soundFxs/music/Bach-1.mp3"),
        bach_2: new Audio("resources/soundFxs/music/Bach-2.mp3"),
        bach_1: new Audio("resources/soundFxs/music/Bach-3.mp3"),
        bach_4: new Audio("resources/soundFxs/music/Bach-4.mp3"),
        bach_5: new Audio("resources/soundFxs/music/Bach-5.mp3"),
        bach_6: new Audio("resources/soundFxs/music/Bach-6.mp3"),
        bach_7: new Audio("resources/soundFxs/music/Bach-7.mp3"),
    };
    var slowFlags = 0;
    setInterval(function () {
        id("FPS").innerHTML = fps + " FPS";
        if (gameStarted && !gamePaused) {
            if (loopMode !== 2 && fps > 65) {
                loopMode = 2;
            }

            if (loopMode !== 3 && windowFocused) {
                if (fps < 57) {
                    if (fps < 3) {
                        slowFlags = 0;
                    } else {
                        slowFlags++;
                    }
                } else {
                    slowFlags = 0;
                }
                if (slowFlags > 2) {
                    console.log("slow mode ON");
                    id("disclaimer2").classList.add("downUp");
                    loopMode = 3;
                    gamePaused = true;
                    startLoop();
                }
            }
        }

        fps = 0;
    }, 1000);

    audio.walking.playbackRate = 1.3;
    audio.speed1.playbackRate = 0.7;

    audio.bounce1.volume = 0.4;
    audio.bounce2.volume = 0.4;
    audio.bounce3.volume = 0.4;
    audio.bounce4.volume = 0.4;
    audio.speed1.volume = 0.8;
    audio.speed2.volume = 0.5;
    audio.jump.volume = 0.45;
    audio.dash.volume = 0.3;
    audio.attack.volume = 0.5;
    audio.hit.volume = 0.5;
    audio.death.volume = 0.5;
    audio.crystal.volume = 1;
    audio.walking.volume = 1;
    audio.tremble.volume = 0.1;
    audio.fall.volume = 0.1;
    audio.money_1.volume = 0.3;
    audio.money_2.volume = 0.3;
    audio.money_3.volume = 0.3;
    audio.ambient_1.volume = 0.1;
    audio.ambient_2.volume = 0;

    audio.spikes2.playbackRate = 1.8;
    audio.portal.volume = 0.5;
    audio.ambient_1.loop = true;
    audio.ambient_2.loop = true;

    audio.haydn_1.volume = 0.2;
    audio.haydn_2.volume = 0.2;
    audio.bach_1.volume = 0.3;
    audio.bach_2.volume = 0.3;
    audio.bach_3.volume = 0.3;
    audio.bach_4.volume = 0.3;
    audio.bach_5.volume = 0.3;
    audio.bach_6.volume = 0.3;
    audio.bach_7.volume = 0.3;
    var biomes = [{
        background: true,
        ambient: audio.ambient_1,
        music: [audio.haydn_1, audio.haydn_2],
        //bgColor: "#0099dd",
        bgColor: sheetsColors[selectedSheet][0],
        other: function () {
            for (let j = 0; j < 30; j++) {
                let ww = (mapWidth < 100) ? 100 : mapWidth;
                let hh = (mapHeight < 50) ? 50 : mapHeight;
                let ran1 = parseInt(Math.random() * ww + (player.x));
                let ran2 = Math.random() * hh / 4 - hh / 8;
                let ran3 = parseInt(Math.random() * 20 + 1);
                visualFxs.push(new Cloud(ran1, ran2, ran3));
            }
        }
}, {
        background: false,
        ambient: audio.ambient_2,
        music: [audio.bach_1, audio.bach_2, audio.bach_3, audio.bach_4, audio.bach_5, audio.bach_6, audio.bach_7],
        bgColor: sheetsColors[selectedSheet][1],
        other: function () {}
}];

    var voices = {
        ghost: [
        new Audio("resources/soundFxs/voices/ghost/1.mp3"),
        new Audio("resources/soundFxs/voices/ghost/2.mp3"),
        new Audio("resources/soundFxs/voices/ghost/3.mp3"),
        new Audio("resources/soundFxs/voices/ghost/4.mp3"),
           ],
        player: [
        new Audio("resources/soundFxs/voices/player/1.mp3"),
        new Audio("resources/soundFxs/voices/player/2.mp3"),
        new Audio("resources/soundFxs/voices/player/3.mp3"),
        new Audio("resources/soundFxs/voices/player/4.mp3"),
        new Audio("resources/soundFxs/voices/player/5.mp3"),
        new Audio("resources/soundFxs/voices/player/6.mp3"),
           ],
        pizza: [
        new Audio("resources/soundFxs/voices/pizza/1.mp3"),
        new Audio("resources/soundFxs/voices/pizza/2.mp3"),
        new Audio("resources/soundFxs/voices/pizza/3.mp3"),
        new Audio("resources/soundFxs/voices/pizza/4.mp3"),
        new Audio("resources/soundFxs/voices/pizza/5.mp3"),
        new Audio("resources/soundFxs/voices/pizza/6.mp3"),
        new Audio("resources/soundFxs/voices/pizza/7.mp3"),
        new Audio("resources/soundFxs/voices/pizza/8.mp3"),
           ]
    };
    for (let i = 0; i < voices.ghost.length; i++) {
        voices.ghost[i].volume = 0.4;
    }
    for (let i = 0; i < voices.player.length; i++) {
        voices.player[i].volume = 0.75;
    }
    for (let i = 0; i < voices.pizza.length; i++) {
        voices.pizza[i].volume = 0.75;
    }
    class Player {
        constructor(x, y) {
            this.x = x;
            this.y = y;
            this.w = 1;
            this.h = 1;
            this.reading = false;
            this.uncontrollable = false;
            this.currentBook = "";
            this.atk = 1;
            this.xVel = 0;
            this.yVel = 0;
            this.xVelExt = 0; // external velocity
            this.yVelExt = 0; // external velocity
            this.maxVelocity = 0.27;
            this.sheet = spriteSheet;
            this.L = 0;
            this.R = 0;
            this.hp = 100;
            this.golden = false;
            this.grounded = false;
            this.stun = false;
            this.speed = 0.12;
            this.precision = 100;
            this.frameCounter = 0;
            this.jumpTransition = true;
            this.jumpForce = 0.075;
            this.goingDown = false;
            this.frame = 0;
            this.money = 0;
            this.levelMoney = 0;
            this.yVelDirChange = 0;
            this.prevPos = [];
            this.respawning = 0;
            this.lastCollided = "";
            this.deaths = 0;
            this.nextHitbox = {
                x: 0,
                y: 0,
                w: 0,
                h: 0
            };
            this.hitbox = {
                x: 0,
                y: 0,
                w: 0,
                h: 0
            };
            this.atkHitbox = {
                x: 0,
                y: 0,
                w: 0,
                h: 0
            };
            this.dmgHitbox = {
                x: 0,
                y: 0,
                w: 0,
                h: 0
            };
            this.col = {
                L: 0,
                R: 0,
                T: 0,
                B: 0
            };
            this.colPoint = {
                L: 0,
                R: 0,
                B: 0
            };
            this.events = [];
            this.left = false;
            this.sprite = {
                x: 0,
                y: 0,
                w: 1,
                h: 1,
            };
            // 19/20 = dash right-left
            this.actionX = [[15], [16], [15, 15, 15, 15, 15, 15, 15, 15], [16, 16, 16, 16, 16, 16, 16, 16], [6], [6], [2, 2, 2, 2], [5, 5, 5, 5], [11, 11, 11, 12, 12, 12],
               [9], [12], [9, 10], [11, 12], [9], [12], [9, 10], [11, 12], [10], [10], [6], [6], [17, 17, 17, 17, 17, 17]]; //9-jump
            this.actionY = [[13], [13], [13, 14, 15, 16, 17, 18, 19, 20], [13, 14, 15, 16, 17, 18, 19, 20], [1], [3], [0, 1, 2, 3], [0, 1, 2, 3], [12, 13, 14, 12, 13, 14],
              [15, 15, 15], [15], [16, 16], [16, 16], [17, 17, 17], [17], [18, 18], [18, 18], [15], [17], [0], [2], [15, 16, 17, 18, 19, 20]];
            this.action = 0;
            this.attack = 0;
            this.dash = false;
            this.dashIn = 0;
            this.dashCd = 0;
            this.attackDMG = 7;
            this.dance = false;
            this.jumping = false;
            this.jumpCounter = 10;
            this.slowness = 6;
            this.windup = false;
            this.type = "player";
        }
        jump() {
            if (this.grounded && !this.dead) {
                this.attack = false;
                audio.jump.playy();
                this.frame = 0;
                this.jumping = true;
                this.grounded = false;
                this.dashCd = false;
                this.yVel = -0.02;
                if (this.lastCollided !== "speeder") {
                    this.yVelExt /= 2;
                    this.xVelExt /= 2;
                }
                var dir = 0;
                if (this.xVel !== 0) {
                    dir = this.left ? 2 : 1;
                }
                visualFxs.push(new JumpFx(this.x, this.y, dir));

            }
        }
        attacking(hitbox) {
            let hitSomething = 0;
            for (let i = 0; i < monsters.length; i++) {
                if (collided(hitbox, monsters[i]) && monsters[i].hp > 0) {
                    let DMG = Math.round(Math.random() * (this.attackDMG / 2) + this.attackDMG / 2);
                    hitSomething = 1;
                    shake = 4;
                    if (!parseInt(Math.random() * 3)) {
                        visualFxs.push(new DmgFx(monsters[i], 0));
                    }
                    let randomFx = parseInt(Math.random() * 2 + 1);
                    visualFxs.push(new DmgFx(monsters[i], randomFx));
                    monsters[i].action = 4;
                    monsters[i].hit = true;
                    monsters[i].hp -= DMG;
                    if (monsters[i].hp <= 0) {
                        monsters[i].frameCounter = 0;
                        monsters[i].frame = 0;
                    }
                    texts.push(new DmgText(monsters[i], DMG));
                }
            }
            if (hitSomething) {
                audio.hit.playy();
            }
        }
        attackEvent() {
            if (this.grounded && !this.attack && !this.dead) {
                audio.attack.playy();
                this.attack = true;
                this.frame = 0;
            } else if (!this.attack && !this.windup && !this.dashCd && !this.dead) {
                this.windup = true;
                this.frameCounter = 0;
                this.frame = 0;
            }

        }
        respawnEvent() {
            this.levelMoney = 0;
            session.deaths.push({
                lvl: currentLevel,
                x: this.x,
                y: this.y
            });
            if (session.deaths.length == 50) {
                player.events.push({
                    x: player.x,
                    y: player.y,
                    w: 1,
                    h: 1,
                    type: 74,
                    text: '#1pshh, you died 50 times./n#0I ve been counting. . ./n#2just because',
                    speaker: "ghostgirl"
                });
            }
            if (session.deaths.length == 150) {
                player.events.push({
                    x: player.x,
                    y: player.y,
                    w: 1,
                    h: 1,
                    type: 74,
                    text: '#1STOP./n#2counting.',
                    speaker: "player"
                });
                player.events.push({
                    x: player.x,
                    y: player.y,
                    w: 1,
                    h: 1,
                    type: 74,
                    text: '#0aaaaand 150 deaths./n#2you want to paint/nthis castle red?',
                    speaker: "ghostgirl"
                });
            }
            if (session.deaths.length == 300) {
                player.events.push({
                    x: player.x,
                    y: player.y,
                    w: 1,
                    h: 1,
                    type: 74,
                    text: 'THREE HUNDREDS./nDo. Not. Count.',
                    speaker: "player"
                });
                player.events.push({
                    x: player.x,
                    y: player.y,
                    w: 1,
                    h: 1,
                    type: 74,
                    text: '#0...I-',
                    speaker: "ghostgirl"
                });
            }
            if (session.deaths.length == 1000) {
                player.events.push({
                    x: player.x,
                    y: player.y,
                    w: 1,
                    h: 1,
                    type: 74,
                    text: '#2. . .',
                    speaker: "ghostgirl"
                });
                player.events.push({
                    x: player.x,
                    y: player.y,
                    w: 1,
                    h: 1,
                    type: 74,
                    text: '#1YOU WERE STILL COUNTING?!',
                    speaker: "player"
                });
                player.events.push({
                    x: player.x,
                    y: player.y,
                    w: 1,
                    h: 1,
                    type: 74,
                    text: '#1Wow. Im not sure if you/nare trying to impress me./n#0You died a THOUSAND times.',
                    speaker: "ghostgirl"
                });
            }
            this.deaths++;
            this.respawning = true;
            this.dead = false;
            this.y = 1;
            this.yVel = 0;
            this.xVel = 0;
            this.yVelExt = 0;
            this.xVelExt = 0;
            this.left = false;
            this.dash = false;
            this.dashCd = false;
            this.windup = false;
            if (typeof spawnPoint !== "undefined") {
                this.x = spawnPoint.x;
                this.y = spawnPoint.y;
                mapX = -player.x + (tilesWidth / 6) - 2;
                mapY = -player.y + (tilesHeight / 2);
            } else {
                mapX = 0;
                mapY = 0;
                this.x = 3;
                this.y = 3;
            }
            camera.focus = 0;
        }
        talk(dialogue, speaker) {
            dialogueEngine.newText(dialogue, speaker);
        }
        compute() {
            if (dialogueOn) {
                for (let i = this.events.length - 1; i >= 0; i--) {
                    if (collided(this.events[i], player.hitbox)) {
                        this.talk(this.events[i].text, this.events[i].speaker);
                        this.events.splice(i, 1);
                    }
                }
            }
            this.frameCounter++;
            if (this.jumpCounter >= 10) {
                this.jumpMaxReached = true;
            }
            if (this.grounded) {
                this.jumpTransition = true;
                this.jumping = false;
                this.jumpMaxReached = false;
                this.jumpCounter = 0;
            }
            if (!this.jumpMaxReached && this.jumping && this.yVel < 0) {
                this.yVel -= (this.jumpForce / (this.jumpCounter / 2 + 1));
                this.jumpCounter++;
            }
            if ((this.xVelExt + this.xVel > this.maxVelocity || this.xVelExt + this.xVel < -this.maxVelocity ||
                    this.yVelExt + this.yVel > this.maxVelocity || this.yVelExt + this.yVel < -this.maxVelocity * 2) && fps % 2) {
                this.prevPos.push({
                    x: this.x,
                    y: this.y,
                    action: this.action,
                    frame: this.frame,
                    opacity: 0.4
                });
            }
            if (!this.dash) {
                if (this.L && !(this.colPoint.L && this.col.L) && !this.R) {
                    if (this.xVel > 0) {
                        this.xVel = 0;
                    }
                    if (this.xVelExt > 0 && !this.grounded) {
                        this.xVelExt -= this.speed / 10;
                    } else if (this.xVel > -this.speed) {
                        this.xVel -= this.speed / 10;
                    } else {
                        this.xVel = -this.speed;
                    }
                    this.left = true;
                } else if (this.R && !(this.colPoint.R && this.col.R) && !this.L) {
                    if (this.xVel < 0) {
                        this.xVel = 0;
                    }
                    if (this.xVelExt < 0 && !this.grounded) {
                        this.xVelExt += this.speed / 10;
                    } else if (this.xVel < this.speed) {
                        this.xVel += this.speed / 10;
                    } else {
                        this.xVel = this.speed;
                    }
                    this.left = false;
                } else if ((!this.L && !this.R || this.L && this.R)) {
                    this.xVel = 0;
                }
                if (!this.grounded) {
                    this.yVel += gForce;
                    if (this.yVel > this.maxVelocity) {
                        this.yVel = this.maxVelocity;
                    }
                } else if (this.yVel > 0) {
                    this.yVel = 0;
                    this.yVelExt = 0;
                }
            }
            if (this.attack) {
                this.xVel = 0;
            }
            if (this.dash) {
                if (fps % 2)
                    this.prevPos.push({
                        x: this.x,
                        y: this.y,
                        action: this.action,
                        frame: this.frame,
                        opacity: 0.4
                    });
                this.jumping = false;
                this.xVel = this.left ? -this.speed * 5 : this.speed * 5;
                this.yVel = 0;
                this.yVelExt = 0;
                this.xVelExt = 0;


                this.attacking(this.hitbox);
                this.nextHitbox.x = this.hitbox.x + this.xVel + this.xVelExt;
                this.nextHitbox.y = this.hitbox.y + this.yVel + this.yVelExt;
                this.nextHitbox.w = this.hitbox.w;
                this.nextHitbox.h = this.hitbox.h;
                for (let i = 0; i < map.length; i++) {
                    if (collided(this.nextHitbox, map[i])) {
                        this.dash = false;
                        this.xVel = 0;
                    }
                }
                if (Math.abs((this.dashIn - this.x + this.xVel)) > 3) {
                    this.dash = false;
                    this.xVel = 0;
                }

            }
            this.x += this.xVel;
            this.y += this.yVel;

            // external velocity calculations
            this.x += this.xVelExt;
            this.y += this.yVelExt;
            if (this.xVelExt !== 0 && this.grounded) {
                this.xVelExt *= 0.75;
            } else if (this.xVelExt !== 0) {
                if (this.xVelExt > 0.0001) {
                    this.xVelExt -= 0.0001;
                } else if (this.xVelExt < -0.0001) {
                    this.xVelExt += 0.0001;
                }
            }
            if (this.xVelExt < 0.0001 && this.xVelExt > -0.0001) {
                this.xVelExt = 0;
            }
            this.yVelExt *= 0.9;
            if (this.yVelExt < 0.0001 && this.yVelExt > -0.0001) {
                this.yVelExt = 0;
            }

            if (this.y > (mapHeight + 2)) {
                this.respawnEvent();
            }
            //physics calculations
            this.hitbox.x = (this.x + this.w / 3.5);
            this.hitbox.y = this.y + 0.1;
            this.hitbox.w = (this.w - this.w / 1.75);
            this.hitbox.h = this.h - 0.1;
            if (this.dash || this.windup) {
                this.hitbox.y = this.y + 0.15;
                this.hitbox.h = this.h - 0.3;
            }

            this.dmgHitbox.x = this.hitbox.x + 0.1;
            this.dmgHitbox.y = this.hitbox.y + 0.2;
            this.dmgHitbox.w = this.hitbox.w - 0.1;
            this.dmgHitbox.h = this.hitbox.h - 0.6;
            let dir = (this.left) ? -1 : 1;
            this.atkHitbox.x = this.dmgHitbox.x + dir;
            this.atkHitbox.y = this.dmgHitbox.y;
            this.atkHitbox.w = this.dmgHitbox.w;
            this.atkHitbox.h = this.dmgHitbox.h;


        }
        adjustCollided() {
            //COLLISION POINTS
            this.colPoint.L = false;
            this.colPoint.R = false;
            this.colPoint.B = false;


            testbox.x = this.x - 1.5;
            testbox.y = this.y - 1.5;
            testbox.w = this.w + 3;
            testbox.h = this.h + 3;
            for (let j = 0; j < map.length; j++) {
                if (isOutOfScreen(map[j])) {
                    continue;
                }
                if (!collided(testbox, map[j])) {
                    continue;
                }
                //checks for blocks to the right
                if (pointSquareCol({
                        x: this.x + this.w / 2 + 0.7,
                        y: this.y + this.h / 2
                    }, map[j])) {
                    this.colPoint.R = true;
                }
                //checks for blocks to the left
                if (pointSquareCol({
                        x: this.x + this.w / 2 - 0.7,
                        y: this.y + this.h / 2
                    }, map[j])) {
                    this.colPoint.L = true;
                }
                //checks for blocks to the bottom
                if (pointSquareCol({
                        x: this.x + this.w / 2,
                        y: this.y + this.h / 2 + 0.7
                    }, map[j])) {
                    this.colPoint.B = true;
                }

            }
            for (let j = 0; j < specialTiles.length; j++) {
                if (isOutOfScreen(specialTiles[j])) {
                    continue;
                }
                if (!collided(testbox, specialTiles[j])) {
                    continue;
                }
                //checks for blocks to the right
                if (pointSquareCol({
                        x: this.x + this.w / 2 + 0.7,
                        y: this.y + this.h / 2
                    }, specialTiles[j])) {
                    this.colPoint.R = true;
                }
                //checks for blocks to the left
                if (pointSquareCol({
                        x: this.x + this.w / 2 - 0.7,
                        y: this.y + this.h / 2
                    }, specialTiles[j])) {
                    this.colPoint.L = true;
                }
                //checks for blocks to the bottom
                if (pointSquareCol({
                        x: this.x + this.w / 2,
                        y: this.y + this.h / 2 + 0.7
                    }, specialTiles[j])) {
                    this.colPoint.B = true;
                }

            }
            if (stats.colPoints) {
                this.colPoint.R ? c.fillStyle = "red" : c.fillStyle = "white";
                c.fillRect(
                    (this.x + this.w / 2 + 0.7 + mapX) * ratio | 0,
                    (this.y + this.h / 2 + mapY) * ratio | 0,
                    (0.1) * ratio | 0,
                    (0.1) * ratio | 0
                );
                this.colPoint.L ? c.fillStyle = "red" : c.fillStyle = "white";
                c.fillRect(
                    (this.x + this.w / 2 - 0.7 + mapX) * ratio | 0,
                    (this.y + this.h / 2 + mapY) * ratio | 0,
                    (0.1) * ratio | 0,
                    (0.1) * ratio | 0
                );
                this.colPoint.B ? c.fillStyle = "red" : c.fillStyle = "white";
                c.fillRect(
                    (this.x + this.w / 2 + mapX) * ratio | 0,
                    (this.y + this.h / 2 + 0.7 + mapY) * ratio | 0,
                    (0.1) * ratio | 0,
                    (0.1) * ratio | 0
                );
            }


            if (this.col.R > this.hitbox.w / 2 + Math.abs(this.xVel + this.xVelExt)) {
                if (this.col.T > this.col.B) {
                    this.col.T += this.col.R;
                    this.col.R = 0;
                } else {
                    this.col.B += this.col.R;
                    this.col.R = 0;
                }
            }
            if (this.col.L > this.hitbox.w / 2 + Math.abs(this.xVel + this.xVelExt)) {
                if (this.col.T > this.col.B) {
                    this.col.T += this.col.L;
                    this.col.L = 0;
                } else {
                    this.col.B += this.col.L;
                    this.col.L = 0;
                }
            }
            if (this.col.B > this.hitbox.w / 2 + Math.abs(this.yVel + this.yVelExt)) {
                this.col.T = 0;
            }
            if (this.col.T > this.hitbox.w / 2 + Math.abs(this.yVel + this.yVelExt)) {
                this.col.B = 0;
            }

            if (this.col.L && this.colPoint.L) {
                if (this.col.R) {
                    this.grounded = true;
                }
                this.x += this.col.L;
                if (this.dash) {
                    this.dash = false;
                    this.dashCd = true;
                }
                if (this.xVelExt < 0 && this.colPoint.L) {
                    this.xVelExt = 0;
                }
                if (this.xVel < 0 && this.colPoint.L) {
                    this.xVel = 0;
                }

            }
            if (this.col.R && this.colPoint.R) {
                if (this.col.L) {
                    this.grounded = true;
                }
                this.x -= this.col.R;
                if (this.dash) {
                    this.dash = false;
                    this.dashCd = true;
                }
                if (this.xVelExt > 0 && this.colPoint.R) {
                    this.xVelExt = 0;
                }
                if (this.xVel > 0 && this.colPoint.R) {
                    this.xVel = 0;
                }

            }
            if (this.col.T) {
                this.y += this.col.T;
                if (this.yVel < 0) {
                    this.yVel = 0;
                }
                if (this.yVelExt < 0) {
                    this.yVelExt = 0;
                }
                if (this.dash) {
                    this.dash = false;
                    this.xVel = 0;
                }

            }
            if (this.col.B) {
                this.y -= (this.col.B - 0.03);
                if (this.jumpCounter < 9 && this.yVel < 0) {
                    this.grounded = false;
                } else {
                    if (this.lastCollided !== "bouncy") {
                        this.grounded = true;
                    }
                    if (this.yVel > 0) {
                        this.yVel = 0;
                    }
                    if (this.dashCd || this.dash) {
                        this.dashCd = false;
                        this.dash = false;
                    }
                }
            }

        }
        draw() {
            if (this.yVel > 0 && this.yVelDirChange < 0) {
                this.jumpTransition = true;
                if (!this.attack) {
                    this.frame = 0;
                }
            }
            this.yVelDirChange = this.yVel;
            if (this.attack || this.dash) {
                this.dance = false;
                this.slowness = 4;
                if (this.dash) {
                    this.frameCounter = 0;
                    this.frame = 0;
                    if (!this.left) {
                        this.action = 19; //atk right
                    } else {
                        this.action = 20; //atk left
                    }
                } else {
                    if (!this.left) {
                        this.action = 6; //atk right
                    } else {
                        this.action = 7; //atk left
                    }
                }
            } else {


                this.slowness = 3;
                if (!this.grounded) {
                    this.dance = false;
                    this.slowness = 4;
                    if (!this.left) {
                        if (this.yVel > 0) { //falling
                            if (this.jumpTransition) {
                                this.action = 11;
                            } else {
                                this.action = 12;
                            }
                            if (this.yVel == this.maxVelocity) {
                                this.action = 12;
                            }
                        } else {
                            if (this.jumpTransition) { //going up
                                this.action = 9;
                            } else {
                                this.action = 10;
                            }
                        }
                        if (this.xVelExt >= 0.1 || this.xVelExt <= -0.1) {
                            this.action = 17;
                        }
                    } else {
                        if (this.yVel > 0) { //falling
                            if (this.jumpTransition) {
                                this.action = 15;
                            } else {
                                this.action = 16;
                            }
                            if (this.yVel == this.maxVelocity) {
                                this.action = 16;
                            }
                        } else {
                            if (this.jumpTransition) { //going up
                                this.action = 13;
                            } else {
                                this.action = 14;
                            }
                        }
                        if (this.xVelExt >= 0.1 || this.xVelExt <= -0.1) {
                            this.action = 18;
                        }
                    }
                } else if (this.xVel === 0) {
                    if (!this.left) {
                        this.action = 0; //idle right
                    } else {
                        this.action = 1; //idle left
                    }
                    if (this.dance) {
                        this.action = 8; //dance
                        this.slowness = 6;
                    }

                } else if (this.xVel !== 0) {
                    this.dance = false;
                    if (!this.left) {
                        this.action = 2; //walk right
                    } else {
                        this.action = 3; //walk left
                    }
                }
            }
            if (this.windup) {
                this.slowness = 1;
            }
            if (this.frameCounter > this.slowness) {
                this.frame++;
                this.frameCounter = 0;
            }
            //
            if (this.attack && this.frame == 3 && this.frameCounter === 0) {
                this.attacking(this.atkHitbox);
            }
            if (this.windup) {
                this.slowness = 3;
                if (this.frame >= 6) {
                    this.windup = false;
                    audio.dash.playy();
                    this.dashCd = true;
                    this.dash = true;
                    shake = 3;
                    this.dashIn = this.x;

                    this.frameCounter = 0;
                    this.frame = 0;
                    if (!this.left) {
                        this.action = 19; //atk right
                    } else {
                        this.action = 20; //atk left
                    }
                } else {
                    this.action = 21;
                    this.xVel *= 0.5;
                    this.xVelExt *= 0.5;
                    this.yVel *= 0.5;
                    this.yVel -= gForce;
                    this.yVelExt *= 0.5;
                }
            }
            if (this.frame > this.actionX[this.action].length - 1) {
                this.frame = 0;
                if (this.attack) {
                    this.attack = false;
                }
                if (this.action == 9 || this.action == 11 || this.action == 13 || this.action == 15) { //jump transitions
                    this.jumpTransition = false;
                    this.frame = 0;
                }
            }
            if (this.xVel !== 0 && this.grounded && !(this.attack || this.dash)) {
                audio.walking.play();
            } else {
                audio.walking.pause();
            }

            //draw on canvas
            if (this.prevPos.length > 0) {
                for (let i = this.prevPos.length - 1; i >= 0; i--) {
                    this.prevPos[i].opacity -= 0.02;
                    if (this.prevPos[i].opacity <= 0) {
                        this.prevPos.splice(i, 1);
                        continue;
                    }
                    c.globalAlpha = this.prevPos[i].opacity;
                    c.drawImage(
                        this.sheet,
                        this.actionX[this.prevPos[i].action][this.prevPos[i].frame] * 16,
                        this.actionY[this.prevPos[i].action][this.prevPos[i].frame] * 16,
                        this.sprite.w * 16,
                        this.sprite.h * 16,
                        (this.prevPos[i].x + mapX) * ratio | 0,
                        (this.prevPos[i].y + mapY) * ratio | 0,
                        (this.w) * ratio | 0,
                        (this.h) * ratio | 0);

                }
                c.globalAlpha = 1;
            }
            c.drawImage(
                this.sheet,
                this.actionX[this.action][this.frame] * 16,
                this.actionY[this.action][this.frame] * 16,
                this.sprite.w * 16,
                this.sprite.h * 16,
                (this.x + mapX) * ratio | 0,
                (this.y + mapY) * ratio | 0,
                (this.w) * ratio | 0,
                (this.h) * ratio | 0);
            //the attack animation takes up 2 tiles in width, so I decided to print the other map separately
            if (this.attack) {
                if (this.action == 6) {
                    c.drawImage(
                        this.sheet,
                        this.actionX[this.action][this.frame] * 16 + 16,
                        this.actionY[this.action][this.frame] * 16,
                        this.sprite.w * 16,
                        this.sprite.h * 16,
                        (this.x + mapX + this.w) * ratio | 0,
                        (this.y + mapY) * ratio | 0,
                        (this.w) * ratio | 0,
                        (this.h) * ratio | 0);
                } else if (this.action == 7) {
                    c.drawImage(
                        this.sheet,
                        this.actionX[this.action][this.frame] * 16 - 16,
                        this.actionY[this.action][this.frame] * 16,
                        this.sprite.w * 16,
                        this.sprite.h * 16,
                        (this.x + mapX - this.w) * ratio | 0,
                        (this.y + mapY) * ratio | 0,
                        (this.w) * ratio | 0,
                        (this.h) * ratio | 0);
                }
            }
            //sparkly
            if (player.golden) {
                for (let i = 0; i < sparks.length; i++) {
                    drawFxs(sparks[i], i)
                }
            }

            this.respawning = false;
            /*
            c.fillStyle = "red";
            c.fillRect((this.dmgHitbox.x + mapX) * ratio | 0, (this.dmgHitbox.y + mapY) * ratio | 0, (this.dmgHitbox.w) * ratio | 0, (this.dmgHitbox.h) * ratio | 0)
            */
        }
    }
    var player = new Player(0, 0);

    function goldenMode() {
        if (player.golden) {
            player.golden = false;
            audio.death = new Audio("resources/soundFxs/death.mp3");
            if (selectedSheet == 0) {
                id("sheet").src = "resources/sheet11.png";
            } else {
                id("sheet").src = "resources/sheetWarmPalette.png";
            }
            id("player-0").src = "dialogue/player-0.png";
            id("player-1").src = "dialogue/player-1.png";
            id("player-2").src = "dialogue/player-2.png";
            id("no-pizza").src = "pizza-sprite2.png"
        } else {
            player.golden = true;
            audio.death = new Audio("resources/soundFxs/death2.mp3");
            if (selectedSheet == 0) {
                id("sheet").src = "resources/goldenSheet.png";
            } else {
                id("sheet").src = "resources/sheetWarmPalette2.png";
            }
            id("player-0").src = "dialogue/player1-0.png";
            id("player-1").src = "dialogue/player1-1.png";
            id("player-2").src = "dialogue/player1-2.png";
            id("no-pizza").src = "pizza-sprite2-2.png";
        }
    }
    class sparkFx {
        constructor() {
            this.dx = Math.random() * player.w - player.w / 2;
            this.dy = Math.random() * player.h - player.h / 2;
            this.x = player.x + this.dx;
            this.y = player.y + this.dy;
            // dir 0 = jump straight, dir 1 = jump right, dir 2 = jump left
            this.sprite = 0;
            this.rotation = 0;
            this.sheet = spriteSheet;
            this.repeat = true;
            this.frameCounter = 0;
            this.slowness = 5;
            this.frame = Math.random() * 4 | 0;
            this.type = "spark";
            this.spritePos = {
                x: [[13, 13, 13, 13]],
                y: [[21, 22, 23, 24]],
                w: [1, 1, 1, 1, 1],
                h: [1, 1, 1, 1, 1],
            };
        }
        action() {
            if (this.frame == this.spritePos.x[0].length - 1) {
                if (this.frameCounter == this.slowness) {
                    this.dx = Math.random() * player.w - player.w / 2;
                    this.dy = Math.random() * player.h - player.h / 2;
                    this.x = player.x + this.dx;
                    this.y = player.y + this.dy;
                }
            }
        }
    }
    //sparkly
    var sparks = [];
    for (let i = 0; i < 4; i++) {
        sparks.push(new sparkFx())
    }

    var testbox = {
        x: 0,
        y: 0,
        w: 0,
        h: 0
    };
    class Monster {
        constructor(x, y) {
            this.x = x;
            this.y = y;
            this.w = 1;
            this.h = 1;
            this.sheet = spriteSheet;
            this.jumpForce = 0.22;
            this.maxVelocity = 0.3;
            this.xVel = 0;
            this.yVel = 0;
            this.speed = 0;
            this.grounded = false;
            this.frameCounter = 0;
            this.frame = 0;
            this.hit = false;
            this.hp = 3;
            this.maxHp = this.hp;
            this.type = null;
            this.attack = false;
            this.dead = false;
            this.serial = series++;
            this.hitbox = {
                x: 0,
                y: 0,
                w: 0,
                h: 0
            };
            this.atkHitbox = {
                x: 0,
                y: 0,
                w: 0,
                h: 0
            };
            this.col = {
                L: 0,
                R: 0,
                T: 0,
                B: 0
            };
            this.left = false;
            this.sprite = {
                x: 0,
                y: 0,
                w: 1,
                h: 1,
            };
            this.actionX = [];
            this.actionY = [];
            this.action = 0;
            //setTimeout(randomMovement, 1000, this.serial);

        }
        move() {
            let points = {
                upLeft: {
                    x: this.x - 0.5,
                    y: this.y + this.h - 1 - 0.5
                },
                upRight: {
                    x: this.x + this.w + 0.5,
                    y: this.y + this.h - 1 - 0.5
                },
                btLeft: {
                    x: this.x + 0.2,
                    y: this.y + this.h + 1.5
                },
                btLeft2: {
                    x: this.x + 0.2,
                    y: this.y + 1 + this.h / 2
                },
                btRight: {
                    x: this.x + this.w - 0.2,
                    y: this.y + this.h + 1.5
                },
                btRight2: {
                    x: this.x + this.w - 0.2,
                    y: this.y + 1 + this.h / 2
                },
                left: {
                    x: this.x - 0.2,
                    y: this.y + this.h / 1.1
                }, // provisional
                right: {
                    x: this.x + this.w + 0.5,
                    y: this.y + this.h / 1.1
                } // provisional
            };
            let cols = {
                upLeft: false,
                upRight: false,
                btLeft: false,
                btRight: false,
                btLeft2: false,
                btRight2: false,
                left: false,
                right: false
            };
            testbox.x = this.x - 1.5;
            testbox.y = this.y - 1.5;
            testbox.w = this.w + 3;
            testbox.h = this.h + 3;
            for (let j = 0; j < map.length; j++) {
                if (!collided(testbox, map[j])) {
                    continue;
                }
                if (this.left) {
                    if (pointSquareCol(points.upLeft, map[j])) {
                        cols.upLeft = true;
                    }
                    if (pointSquareCol(points.left, map[j])) {
                        cols.left = true;
                    }
                    if (pointSquareCol(points.btLeft, map[j])) {
                        cols.btLeft = true;
                    }
                    if (pointSquareCol(points.btLeft2, map[j])) {
                        cols.btLeft2 = true;
                    }
                } else {
                    if (pointSquareCol(points.btRight, map[j])) {
                        cols.btRight = true;
                    }
                    if (pointSquareCol(points.right, map[j])) {
                        cols.right = true;
                    }
                    if (pointSquareCol(points.upRight, map[j])) {
                        cols.upRight = true;
                    }
                    if (pointSquareCol(points.btRight2, map[j])) {
                        cols.btRight2 = true;
                    }

                }
            }
            for (let j = 0; j < specialTiles.length; j++) {
                if (!collided(testbox, specialTiles[j])) {
                    continue;
                }
                if (this.left) {
                    if (pointSquareCol(points.upLeft, specialTiles[j])) {
                        cols.upLeft = true;
                    }
                    if (pointSquareCol(points.left, specialTiles[j])) {
                        cols.left = true;
                    }
                    if (pointSquareCol(points.btLeft, specialTiles[j])) {
                        cols.btLeft = true;
                    }
                    if (pointSquareCol(points.btLeft2, specialTiles[j])) {
                        cols.btLeft2 = true;
                    }
                } else {
                    if (pointSquareCol(points.btRight, specialTiles[j])) {
                        cols.btRight = true;
                    }
                    if (pointSquareCol(points.right, specialTiles[j])) {
                        cols.right = true;
                    }
                    if (pointSquareCol(points.upRight, specialTiles[j])) {
                        cols.upRight = true;
                    }
                    if (pointSquareCol(points.btRight2, specialTiles[j])) {
                        cols.btRight2 = true;
                    }

                }
            }
            if (stats.colPoints) {
                cols.upLeft ? c.fillStyle = "red" : c.fillStyle = "white";
                c.fillRect(
                    (points.upLeft.x + mapX) * ratio | 0,
                    (points.upLeft.y + mapY) * ratio | 0,
                    (0.1) * ratio | 0,
                    (0.1) * ratio | 0
                );
                cols.upRight ? c.fillStyle = "red" : c.fillStyle = "white";
                c.fillRect(
                    (points.upRight.x + mapX) * ratio | 0,
                    (points.upRight.y + mapY) * ratio | 0,
                    (0.1) * ratio | 0,
                    (0.1) * ratio | 0
                );
                cols.btLeft ? c.fillStyle = "red" : c.fillStyle = "white";
                c.fillRect(
                    (points.btLeft.x + mapX) * ratio | 0,
                    (points.btLeft.y + mapY) * ratio | 0,
                    (0.1) * ratio | 0,
                    (0.1) * ratio | 0
                );
                cols.btRight ? c.fillStyle = "red" : c.fillStyle = "white";
                c.fillRect(
                    (points.btRight.x + mapX) * ratio | 0,
                    (points.btRight.y + mapY) * ratio | 0,
                    (0.1) * ratio | 0,
                    (0.1) * ratio | 0
                );
                cols.btLeft2 ? c.fillStyle = "red" : c.fillStyle = "white";
                c.fillRect(
                    (points.btLeft2.x + mapX) * ratio | 0,
                    (points.btLeft2.y + mapY) * ratio | 0,
                    (0.1) * ratio | 0,
                    (0.1) * ratio | 0
                );
                cols.btRight2 ? c.fillStyle = "red" : c.fillStyle = "white";
                c.fillRect(
                    (points.btRight2.x + mapX) * ratio | 0,
                    (points.btRight2.y + mapY) * ratio | 0,
                    (0.1) * ratio | 0,
                    (0.1) * ratio | 0
                );
                cols.left ? c.fillStyle = "red" : c.fillStyle = "white";
                c.fillRect(
                    (points.left.x + mapX) * ratio | 0,
                    (points.left.y + mapY) * ratio | 0,
                    (0.1) * ratio | 0,
                    (0.1) * ratio | 0
                );
                cols.right ? c.fillStyle = "red" : c.fillStyle = "white";
                c.fillRect(
                    (points.right.x + mapX) * ratio | 0,
                    (points.right.y + mapY) * ratio | 0,
                    (0.1) * ratio | 0,
                    (0.1) * ratio | 0
                );
            }
            let dir = this.left ? 0 : 1;
            if (this.left) {
                if (cols.left && !cols.upLeft) {
                    this.jump();
                } else if ((cols.left && cols.upLeft) || (!cols.btLeft && !cols.btLeft2)) {
                    if (this.grounded) {
                        dir = 1;
                    }

                }

            } else {
                if (cols.right && !cols.upRight) {
                    this.jump();
                } else if ((cols.right && cols.upRight) || (!cols.btRight && !cols.btRight2)) {
                    if (this.grounded) {
                        dir = 0;
                    }
                }
            }
            switch (dir) {
                case 0:
                    this.left = true;
                    this.L = true;
                    this.R = false;
                    break;
                case 1:
                    this.left = false;
                    this.L = false;
                    this.R = true;
                    break;
                case 2:
                    this.L = false;
                    this.R = false;
                    break;
            }
        }
        jump() {
            if (this.grounded) {
                this.grounded = false;
                this.yVel = -this.jumpForce;
                let dir = 0;
                if (this.xVel !== 0) {
                    dir = this.left ? 2 : 1;
                }
                visualFxs.push(new JumpFx(this.x, this.y, dir));

            }
        }
        compute() {
            if (this.attack) {
                this.L = false;
                this.R = false;
            }
            if (this.col.L) {
                this.x += this.col.L;

            }
            if (this.col.R) {
                this.x -= this.col.R;
            }
            if (this.col.T) {
                this.y += this.col.T;
                this.yVel = 0;
            }
            if (this.col.B) {
                this.y -= this.col.B - 0.01;
                this.grounded = true;

            }
            if (!(fps % 15) && this.grounded && !this.hit) {
                //^AI is refreshed every 1/4 seconds
                this.move();
            }
            //controls calculation
            if (this.L && !this.col.L && !this.R && !this.hit) {
                this.xVel = -this.speed;
                this.left = true;
            } else if (this.R && !this.col.R && !this.L && !this.hit) {
                this.xVel = this.speed;
                this.left = false;
            } else if ((!this.L && !this.R) || (this.L && this.R) || this.hit) {
                this.xVel = 0;
            }
            if (!this.grounded) {
                this.yVel += gForce;
                if (this.yVel > this.maxVelocity) {
                    this.yVel = this.maxVelocity;
                }
            } else if (this.yVel > 0) {
                this.yVel = 0;
            }
            this.y += this.yVel;
            this.x += this.xVel;
            this.hitbox.x = (this.x + this.w / 10);
            this.hitbox.y = this.y + 0.2;
            this.hitbox.w = (this.w - this.w / 5);
            this.hitbox.h = this.h - 0.2;
            if (this.canAttack) {
                let dir = (this.left) ? -1 : 1;
                this.atkHitbox.x = this.hitbox.x + dir;
                this.atkHitbox.y = this.hitbox.y;
                this.atkHitbox.w = this.hitbox.w;
                this.atkHitbox.h = this.hitbox.h;
                this.searchPlayer(this);
            }
        }
        draw(i) {
            this.frameCounter++;
            if (!this.hit) {
                if (!this.grounded) {
                    if (!this.left) {
                        this.action = 4; //idle right
                    } else {
                        this.action = 4; //idle left
                    }
                } else if (this.xVel === 0) {
                    if (!this.left) {
                        this.action = 0; //idle right
                    } else {
                        this.action = 1; //idle left
                    }
                } else if (this.xVel !== 0) {
                    if (!this.left) {
                        this.action = 2; //walk right
                    } else {
                        this.action = 3; //walk left
                    }
                }
            } else {
                this.action = 4;
                if (this.hp <= 0) {
                    this.action = 5;
                }
            }
            if (this.attack && this.hp > 0) {
                !this.left ? this.action = 6 : this.action = 7;
            }
            if (this.frameCounter > 10) {
                this.frame++;
                this.frameCounter = 0;
            }
            if (this.frame > this.actionX[this.action].length - 1) {
                this.frame = 0;
                if (this.attack && this.hp > 0) {
                    this.attackEvent(this);
                    this.attack = false;
                }
                if (this.action == 4) {
                    this.hit = false;
                }
                if (this.action == 5) {
                    monsters.splice(i, 1);
                    return 0;
                }
            }
            //draw on canvas
            c.drawImage(
                this.sheet,
                this.actionX[this.action][this.frame] * 16,
                this.actionY[this.action][this.frame] * 16,
                this.sprite.w * 16,
                this.sprite.h * 16,
                (this.x + mapX) * ratio | 0,
                (this.y + mapY) * ratio | 0,
                (this.w) * ratio | 0,
                (this.h) * ratio | 0);
            if (this.attack) {
                this.attackSprite(this);
            }
        }
    }

    //CHANGE
    class Slime extends Monster {
        constructor(x, y) {
            super(x, y);
            this.speed = 0.03;
            this.hp = 16;
            this.maxHp = this.hp;
            this.type = "Slime";
            this.actionX = [[12], [13], [12, 12, 12], [13, 13, 13], [14, 14, 14], [14, 14, 14, 14, 14]];
            this.actionY = [[0], [0], [0, 1, 2], [0, 1, 2], [0, 0, 0], [0, 1, 2, 3, 4]];
        }
    }
    class Lizard extends Monster {
        constructor(x, y) {
            super(x, y);
            this.speed = 0.04;
            this.hp = 12;
            this.maxHp = this.hp;
            this.type = "Lizard";
            this.actionX = [[15], [16], [15, 15, 15], [16, 16, 16], [17, 17, 17], [17, 17, 17, 17, 17]];
            this.actionY = [[0], [0], [0, 1, 2, 3], [0, 1, 2, 3], [0, 0, 0], [0, 1, 2, 3, 4]];
        }
    }
    class Bear extends Monster {
        constructor(x, y) {
            super(x, y);
            this.speed = 0.04;
            this.hp = 60;
            this.maxHp = this.hp;
            this.type = "Bear";
            this.actionX = [[0], [2], [0, 0, 0], [2, 2, 2], [2, 2, 2], [2, 2, 2, 2, 2, 2], [4, 4, 4, 4, 4, 4], [8, 8, 8, 8, 8, 8]];
            this.actionY = [[0], [0], [0, 2, 4], [0, 2, 4], [0, 2, 4], [0, 2, 4, 6, 8, 10], [0, 2, 4, 6, 8, 10], [0, 2, 4, 6, 8, 10]];
            this.sprite.w = 2;
            this.sprite.h = 2;
            this.sheet = id("bearsheet");
            this.w = 2;
            this.h = 2;
            this.canAttack = true;
        }
        attackEvent(bear) {
            if (collided(player, bear.atkHitbox)) {
                player.yVelExt += -0.3;
                player.xVelExt += bear.left ? -0.3 : 0.3;
                player.left = bear.left;
                player.dashCd = true;
                if (!parseInt(Math.random() * 3)) {
                    visualFxs.push(new DmgFx(player, 0));
                }
                let randomFx = parseInt(Math.random() * 2 + 1);
                visualFxs.push(new DmgFx(player, randomFx));
            }
        }
        searchPlayer(bear) {
            if (collided(player, bear.atkHitbox)) {
                bear.attack = true;
            }
        }
        attackSprite(m) {
            if (m.action == 6) {
                c.drawImage(
                    m.sheet,
                    m.actionX[m.action][m.frame] * 16 + 32,
                    m.actionY[m.action][m.frame] * 16,
                    m.sprite.w / 2 * 16,
                    m.sprite.h * 16,
                    (m.x + m.w + mapX) * ratio | 0,
                    (m.y + mapY) * ratio | 0,
                    (m.w / 2) * ratio | 0,
                    (m.h) * ratio | 0);
            } else if (m.action == 7) {
                c.drawImage(
                    m.sheet,
                    m.actionX[m.action][m.frame] * 16 - 16,
                    m.actionY[m.action][m.frame] * 16,
                    m.sprite.w / 2 * 16,
                    m.sprite.h * 16,
                    (m.x - m.w / 2 + mapX) * ratio | 0,
                    (m.y + mapY) * ratio | 0,
                    (m.w / 2) * ratio | 0,
                    (m.h) * ratio | 0);
            }
        }
    }
    //CHANGE
    class Dummy extends Monster {
        constructor(x, y) {
            super(x, y);
            this.speed = 0;
            this.hp = 1200;
            this.maxHp = this.hp;
            this.type = "Dummy";
            this.actionX = [[12], [12], [12], [12], [12, 12, 12], [12]];
            this.actionY = [[3], [3], [3], [3], [4, 4, 4], [3]];
        }
        move() {}
    }
    class Zombie extends Monster {
        constructor(x, y) {
            super(x, y);
            this.speed = 0.02;
            this.hp = 20;
            this.maxHp = this.hp;
            this.type = "Zombie";
            this.actionX = [[18], [19], [18, 18, 18], [19, 19, 19], [20, 20, 20], [20, 20, 20, 20, 20]];
            this.actionY = [[0], [0], [0, 1, 2, 3], [0, 1, 2, 3], [0, 0, 0], [0, 1, 2, 3, 4]];
        }
    }
    class Superzombie extends Zombie {
        constructor(x, y) {
            super(x, y);
            this.speed = 0.04;
            this.hp = 60;
            this.maxHp = this.hp;
            this.w = 2;
            this.h = 2;
        }
    }

    // Texts & Dialogues
    class DmgText {
        constructor(m, text) {
            this.x = m.x + m.w / 2 + Math.random() * 0.5 - 0.4;
            this.y = m.y + Math.random() * 0.5 - 0.4;
            this.text = text;
            this.size = 0.4;
            this.color = "#ac3232";
            this.lifeSpan = 40; //duration (in frames) of the text appearence
            this.color2 = "black";
        }
        draw(i) {
            c.font = Math.round(this.size * ratio) + "px" + " 'Press Start 2P'";
            this.size /= 1.01;
            c.fillStyle = this.color2;
            c.fillText(this.text, (this.x + mapX) * ratio, (this.y + mapY) * ratio);
            c.fillStyle = this.color;
            c.fillText(this.text, (this.x + mapX) * ratio, (this.y + mapY) * ratio);
            this.y -= 0.015;
            this.lifeSpan--;
            if (this.lifeSpan <= 0) {
                textsRemoveList.push(i);
            }
        }
    }
    //CHANGE
    class DmgFx {
        constructor(m, s) {
            this.x = m.x;
            this.y = m.y + m.h / 2;
            if (s === undefined) {
                this.sprite = parseInt(Math.random() * 3);
            } else {
                this.sprite = s;
            }
            let randRot = parseInt(Math.random() * 4) * 90;
            this.rotation = randRot;
            this.sheet = spriteSheet;
            this.repeat = false;
            this.frameCounter = 0;
            this.slowness = 3;
            this.frame = 0;
            this.type = "dmg";
            this.spritePos = {
                x: [[0, 0, 0, 0], [1, 1, 1, 1], [2, 2, 2, 2]],
                y: [[4, 5, 6, 7], [4, 5, 6, 7], [4, 5, 6, 7]],
                w: [1, 1, 2],
                h: [1, 1, 1],
            };
        }
    }
    class JumpFx {
        constructor(x, y, dir) {
            this.x = x;
            this.y = y;
            // dir 0 = jump straight, dir 1 = jump right, dir 2 = jump left
            this.sprite = dir;
            this.rotation = 0;
            this.sheet = spriteSheet;
            this.repeat = false;
            this.frameCounter = 0;
            this.slowness = (dir > 2) ? 1 : 4;
            this.frame = 0;
            this.type = "jump";
            this.spritePos = {
                x: [[0, 0, 0, 0, 0], [1, 1, 1, 1, 1], [2, 2, 2, 2, 2], [3, 3, 3, 3, 3], [4, 4, 4, 4, 4]],
                y: [[8, 9, 10, 11, 12], [8, 9, 10, 11, 12], [8, 9, 10, 11, 12], [8, 9, 10, 11, 12], [8, 9, 10, 11, 12]],
                w: [1, 1, 1, 1, 1],
                h: [1, 1, 1, 1, 1],
            };
        }
    }
    class DeathFx {
        constructor(x, y) {
            this.x = x - 0.5;
            this.y = y - 0.5;
            this.sprite = 0;
            this.rotation = 0;
            this.sheet = spriteSheet;
            this.repeat = false;
            this.frameCounter = 0;
            this.slowness = 3;
            this.frame = 0;
            this.type = "death";
            this.spritePos = {
                x: [[19, 19, 19, 19, 19, 19]],
                y: [[5, 7, 9, 11, 13, 15]],
                w: [2],
                h: [2],
            };
        }
    }
    class RingFx {
        constructor(x, y, dir) {
            this.x = x;
            this.y = y;
            this.sprite = dir;
            this.rotation = 0;
            this.sheet = spriteSheet;
            this.repeat = false;
            this.frameCounter = 0;
            this.slowness = 5;
            this.frame = 0;
            this.type = "ring";
            this.spritePos = {
                x: [[0, 0, 0, 0, 0], [1, 1, 1, 1, 1], [2, 2, 2, 2, 2]],
                y: [[13, 14, 15, 16, 17], [13, 14, 15, 16, 17], [13, 14, 15, 16, 17]],
                w: [1, 1, 1],
                h: [1, 1, 1],
            };
        }
    }
    class Grass {
        constructor(x, y) {
            this.x = x;
            this.y = y;
            this.sprite = 0;
            this.rotation = 0;
            this.sheet = spriteSheet;
            this.repeat = true;
            this.frameCounter = 0;
            this.slowness = 10;
            this.frame = 0;
            this.type = "grass";
            this.spritePos = {
                x: [[10, 10, 10, 10]],
                y: [[4, 5, 6, 7]],
                w: [1],
                h: [1],
            };
        }
    }
    class Crystal {
        constructor(x, y) {
            this.x = x;
            this.y = y;
            this.sprite = 0;
            this.rotation = 0;
            this.sheet = spriteSheet;
            this.repeat = true;
            this.frameCounter = 0;
            this.slowness = 10;
            this.frame = 0;
            this.type = "crystal";
            this.hitbox = {
                x: x + 0.15,
                y: y + 0.15,
                w: 0.7,
                h: 0.7
            };
            this.spritePos = {
                x: [[13, 13, 13, 13], [14, 14, 14, 14, 14, 14], [15]],
                y: [[12, 13, 14, 15], [12, 13, 14, 15, 16, 17], [12]],
                w: [1, 1, 1],
                h: [1, 1, 1],
            };
        }
        action() {
            if (this.sprite == 1) {
                if (this.frame == this.spritePos.x[1].length - 1) {
                    if (this.frameCounter == this.slowness) {
                        this.sprite = 2;
                        let that = this;
                        setTimeout(function () {
                            that.sprite = 0;
                            that.slowness = 10;
                        }, 1500);
                    }
                }
            }
            if (this.sprite == 0 && (player.dash) && collided(player, this.hitbox)) {
                audio.crystal.playy();
                player.dashCd = false;
                this.sprite = 1;
                this.frameCounter = 0;
                this.frame = 0;
                this.slowness = 6;
            }

        }
    }
    class Coin {
        constructor(x, y, value) {
            this.x = x;
            this.y = y;
            this.value = value;
            this.sprite = value;
            this.rotation = 0;
            this.sheet = spriteSheet;
            this.repeat = true;
            this.frameCounter = 0;
            this.slowness = 6;
            this.frame = 0;
            this.type = "crystal";
            this.hitbox = {
                x: x + 0.3,
                y: y + 0.3,
                w: 0.4,
                h: 0.4
            };
            this.spritePos = {
                x: [[18, 18, 18, 18, 18, 18, 18, 18], [19, 19, 19, 19, 19, 19, 19, 19], [20, 20, 20, 20, 20, 20, 20, 20], [21, 21, 21, 21, 21, 21, 21, 21], [9]],
                y: [[17, 18, 19, 20, 21, 22, 23, 24], [17, 18, 19, 20, 21, 22, 23, 24], [17, 18, 19, 20, 21, 22, 23, 24], [17, 18, 19, 20, 21, 22, 23, 24], [5]],
                w: [1, 1, 1, 1, 1],
                h: [1, 1, 1, 1, 1],
            };
        }
        action() {
            if (player.respawning) {
                //audio.crystal.playy();
                this.sprite = this.value;
                this.frameCounter = 0;
                this.frame = 0;
                this.slowness = 6;
                this.hitbox.x = this.x + 0.3;
                this.hitbox.y = this.y + 0.3;
                this.hitbox.w = 0.4;
                this.hitbox.h = 0.4;
            }
            if (this.sprite === 0) {
                if (this.frame >= this.spritePos.x[0].length - 1) {
                    this.sprite = 4;
                    this.frame = 0;
                    this.frameCounter = 0;
                }
            }
            if ((this.sprite !== 0 && this.sprite !== 4) && collided(player, this.hitbox)) {
                //audio.crystal.playy();
                this.slowness = 3;
                this.sprite = 0;
                this.frameCounter = 0;
                this.frame = 0;
                this.hitbox.x = 0;
                this.hitbox.y = 0;
                this.hitbox.w = 0;
                this.hitbox.h = 0;
                switch (this.value) {
                    case 1:
                        player.levelMoney += 10;
                        audio.money_1.playy();
                        break;
                    case 2:
                        player.levelMoney += 20;
                        audio.money_2.playy();
                        break;
                    case 3:
                        player.levelMoney += 30;
                        audio.money_3.playy();
                        break;
                }
            }

        }
    }
    class Door {
        constructor(x, y, place) {
            this.x = x;
            this.y = y;
            this.sprite = 0;
            this.place = place;
            this.rotation = 0;
            this.sheet = spriteSheet;
            this.repeat = true;
            this.frameCounter = 0;
            this.slowness = 10;
            this.frame = 0;
            this.type = "door";
            this.hitbox = {
                x: x,
                y: y,
                w: 1,
                h: 1
            };
            this.spritePos = {
                x: [[16], [17, 17], [17, 17, 17, 17, 17]],
                y: [[6], [5, 7], [9, 10, 11, 12, 13]],
                w: [1, 2, 2],
                h: [1, 2, 1],
            };
        }
        action() {
            if (this.sprite == 0) {
                if (collided(pizzaGuy, this)) {
                    camera.focus = 0;
                    setTimeout(() => {
                        gameEnded = true;
                    }, 3000);
                    this.sprite = 1;
                    audio.hit.playy();
                    shake = 4;
                    visualFxs.push(new Portal(this.x, this.y, this.place));
                    this.x -= 0.5;
                    this.y -= 1;
                }
                if (player.attack) {
                    if (collided(player.atkHitbox, this) || collided(player.hitbox, this)) {
                        this.sprite = 1;
                        audio.hit.playy();
                        shake = 4;
                        visualFxs.push(new Portal(this.x, this.y, this.place));
                        this.x -= 0.5;
                        this.y -= 1;
                    }
                }
            } else if (this.sprite === 1 && this.frame == this.spritePos.x[1].length - 1) {
                if (this.frameCounter == this.slowness) {
                    this.sprite = 2;
                    this.y += 1;
                    this.frame = 0;
                    this.frameCounter = 0;
                }
            } else if (this.sprite === 2) {
                this.repeat = false;
            }
        }
    }

    function endDialogue() {
        if (session.retention < 240) {
            player.events.push({
                x: player.x,
                y: player.y,
                w: 1,
                h: 1,
                type: 70,
                text: '#1...        /n#0whatever.',
                speaker: "pizzaguy"
            });
            player.events.push({
                x: player.x,
                y: player.y,
                w: 1,
                h: 1,
                type: 70,
                text: '#1Pff./n#0It may just seem intricate to/nbumpkins like thou.',
                speaker: "player"
            });
            player.events.push({
                x: player.x,
                y: player.y,
                w: 1,
                h: 1,
                type: 74,
                text: '#0Oh hey, I ve just arrived./n#3New castle?     /n#0it looks like a total mess.',
                speaker: "pizzaguy"
            });
        } else if (session.retention < 1200) {
            player.events.push({
                x: player.x,
                y: player.y,
                w: 1,
                h: 1,
                type: 74,
                text: '#1HEY! I have been waiting here/nat least #t minutes,/n#0is anyone here??',
                speaker: "pizzaguy"
            });
        } else {
            player.events.push({
                x: player.x,
                y: player.y,
                w: 1,
                h: 1,
                type: 74,
                text: '#2Im... really sorry./nHad more than few troubles... ',
                speaker: "player"
            });
            player.events.push({
                x: player.x,
                y: player.y,
                w: 1,
                h: 1,
                type: 74,
                text: '#1FINALLY !!!/n#0Your pizza is getting moldy./n#1It was about time you got here!',
                speaker: "pizzaguy"
            });
        }
    }
    class Portal {
        constructor(x, y, place) {
            this.x = x;
            this.y = y;
            this.active = false;
            this.sprite = 0;
            this.place = place;
            this.rotation = 0;
            this.sheet = spriteSheet;
            this.repeat = true;
            this.frameCounter = 0;
            this.slowness = 5;
            this.frame = 0;
            this.type = "portal";
            this.load = 0;
            this.sfx = audio.portal;
            this.hitbox = {
                x: x + 0.3,
                y: y + 0.3,
                w: 0.4,
                h: 0.4
            };
            this.spritePos = {
                x: [[16, 16, 16, 16]],
                y: [[7, 8, 9, 10]],
                w: [1],
                h: [1],
            };
        }
        action() {
            if (collided(this, player) && this.place) {
                if (collided(this, player.dmgHitbox)) {
                    if (this.sfx.paused) {
                        this.sfx.play();
                    }
                    this.load++;
                    blackScreen = this.load * 2 + 1;
                    if (this.load > 50) {
                        player.money += player.levelMoney;
                        player.levelMoney = 0;
                        let nextLevel = parseInt(this.place);
                        if (nextLevel == 15) {
                            session.endTime = session.retention;
                            /*KONGREGATE
                            if (typeof kongregate !== "undefined") {
                                kongregate.stats.submit('Time', session.retention);
                            }
                            /*kg*/
                            if (!dialogueOn) {
                                dialoguesOnOff();
                            }
                            badEnding = 1;
                            if (financial(player.money * 5 / 1000) >= 9.5) {
                                goldenNotice = true;
                                goldenUnlocked = true;
                                badEnding = 0;
                                nextLevel = 16;
                                /*KONGREGATE
                                if (typeof kongregate !== "undefined") {
                                    kongregate.stats.submit('goodEnding', 1);
                                }
                                if (typeof kongregate !== "undefined") {
                                    kongregate.stats.submit('goldenEnding', 1);
                                }
                                /*kg*/
                                if (canStorage) {
                                    window.localStorage["golden"] = true;
                                }
                            } else if (financial(player.money * 5 / 1000) >= 8.5) {
                                badEnding = 0;
                                nextLevel = 16;
                                /*KONGREGATE
                                if (typeof kongregate !== "undefined") {
                                    kongregate.stats.submit('goodEnding', 1);
                                }
                                /*kg*/
                            } else {
                                badEnding = 1;
                                nextLevel = 15;
                                /*KONGREGATE
                                if (typeof kongregate !== "undefined") {
                                    kongregate.stats.submit('badEnding', 1);
                                }
                                /*kg*/
                            }
                        } else if (nextLevel == 1) {
                            id("disclaimer").classList.add("downUp");
                        }
                        /*KONGREGATE
                        if (typeof kongregate !== "undefined") {
                            kongregate.stats.submit('Level', nextLevel);
                        }
                        /*kg*/

                        /*indiexpo
                        if (window.IndiexpoAPI) {
                            IndiexpoAPI.sendScore(nextLevel).done(function (result) {});
                            console.log("Success");
                        } else {
                            console.log("Error");
                        }
                        /*indiexpo*/

                        safeEval(maps[nextLevel]);
                        if (canStorage) {
                            window.localStorage["LvL"] = nextLevel;
                            window.localStorage["money"] = player.money;
                            window.localStorage["time"] = session.retention;
                            window.localStorage["deaths"] = player.deaths;
                        }
                        currentLevel++;
                        adaptBiome();
                        initializeMap();
                        mapX = -player.x + (tilesWidth / 2 - 2);
                        mapY = -player.y + (tilesHeight / 2);
                        blackScreen = 100;
                        if (nextLevel == 15 || nextLevel == 16) {
                            endDialogue();
                        }

                    }
                } else {
                    if (this.load > 0) {
                        blackScreen = this.load;
                        this.load = 0;
                    }
                    if (!this.sfx.paused) {
                        this.sfx.pause();
                        this.sfx.currentTime = 0;
                    }
                }
            } else if (!this.sfx.paused) {
                this.sfx.pause();
                this.sfx.currentTime = 0;
            }
        }
    }
    class Book {
        constructor(x, y, tut) {
            this.x = x;
            this.y = y;
            this.sprite = 0;
            this.rotation = 0;
            this.sheet = spriteSheet;
            this.repeat = true;
            this.frameCounter = 0;
            this.slowness = 6;
            this.frame = 0;
            this.collided = false;
            this.type = "door";
            this.tut = tut;
            this.hitbox = {
                x: x + 0.1,
                y: y + 0.7,
                w: 0.8,
                h: 0.3
            };
            this.spritePos = {
                x: [[7], [7, 7, 7, 8], [8, 8, 8, 8], [8, 7, 7, 7]], // grounded -- transition up -- waving -- transition down
                y: [[14], [15, 16, 17, 14], [15, 16, 17, 16], [14, 17, 16, 15]],
                w: [1, 1, 1, 1],
                h: [1, 1, 1, 1],
            };
        }
        action() {
            this.collided = collided(player, this);
            switch (this.sprite) {
                case 0:
                    if (this.collided) {
                        this.frame = 0;
                        this.frameCounter = 0;
                        this.sprite = 1;
                        this.slowness = 3;
                    }
                    break;
                case 1:
                    if (this.frame == this.spritePos.x[1].length - 1) {
                        this.frame = 0;
                        this.frameCounter = 0;
                        this.sprite = 2;
                        this.slowness = 6;
                    }
                    break;
                case 2:
                    if (!this.collided) {
                        this.frame = 0;
                        this.frameCounter = 0;
                        this.sprite = 3;
                    }
                    break;
                case 3:
                    if (this.frame == this.spritePos.x[1].length - 1) {
                        this.frame = 0;
                        this.frameCounter = 0;
                        this.sprite = 0;
                    }
                    break;
            }
            if (this.collided) {
                player.reading = true;
                if (this.tut != undefined) {
                    player.currentBook = this.tut;
                }
                displaySpacebar = true;
            }
        }
    }

    class GhostGirl {
        constructor(x, y) {
            this.x = x;
            this.y = y;
            this.w = 1;
            this.h = 1;
            this.sprite = 0;
            this.rotation = 0;
            this.sheet = spriteSheet;
            this.repeat = true;
            this.frameCounter = 0;
            this.slowness = 6;
            this.frame = 0;
            this.type = "ghostgirl";
            this.spritePos = {
                x: [[3, 3, 3, 3], [4, 4, 4, 4], [5, 5, 5], [6, 6, 6]],
                y: [[14, 15, 16, 17], [14, 15, 16, 17], [14, 15, 16, 17, 16, 15, 16], [14, 15, 16, 15, 16, 15, 16]],
                w: [1, 1, 1, 1, 1, 1, 1],
                h: [1, 1, 1, 1, 1, 1, 1],
            };
            this.events = [];
        }
        action() {
            if (this.x + this.w <= player.x - 1) {
                this.left = false;
                if (!player.dead) {
                    this.sprite = 0;
                }
                if (Math.abs(this.x - player.x) / 6 > 1 / 100) {
                    this.x += Math.abs(this.x - player.x) / 50;
                }
            } else if (this.x > player.x + player.w + 1) {
                this.left = true;
                if (!player.dead) {
                    this.sprite = 1;
                }
                if (Math.abs(this.x - player.x) / 6 > 1 / 100) {
                    this.x -= Math.abs(this.x - player.x) / 100;
                }
            }
            if (this.left) {
                if ((player.respawning || player.dead) && !player.uncontrollable) {
                    if (this.srite == 0 || this.srite == 1) {
                        this.frameCounter = 0;
                        this.frame = 0;
                    }
                    this.sprite = 3;
                    if (voices.ghost[1].paused) {
                        let volume = (15 - Math.abs(player.hitbox.x + player.hitbox.w / 2 - this.x + this.w / 2)) / 30;
                        if (volume > 0) {
                            voices.ghost[1].play();
                        }
                    }
                }

            } else {
                if ((player.respawning || player.dead) && !player.uncontrollable) {
                    if (this.sprite == 0 || this.sprite == 1) {
                        this.frameCounter = 0;
                        this.frame = 0;
                    }
                    this.sprite = 2;
                    if (voices.ghost[1].paused) {
                        let volume = (15 - Math.abs(player.hitbox.x + player.hitbox.w / 2 - this.x + this.w / 2)) / 30;
                        if (volume > 0) {
                            voices.ghost[1].play();
                        }
                    }
                }

            }
            if (this.y + this.h < player.y - 2) {
                if (Math.abs(this.y - player.y) / 6 > 1 / 100) {
                    this.y += Math.abs(this.y - player.y) / 100;
                }
            } else if (this.y > player.y + player.h + 1) {
                if (Math.abs(this.y - player.y) / 6 > 1 / 100) {
                    this.y -= Math.abs(this.y - player.y) / 100;
                }
            }
        }
    }
    class Cloud {
        constructor(x, y, s) {
            this.x = x;
            this.y = y;
            this.sprite = Math.floor(Math.random() * 4);
            this.rotation = 0;
            this.sheet = spriteSheet;
            this.repeat = true;
            this.frameCounter = 0;
            this.slowness = 5;
            this.frame = 0;
            this.type = "cloud";
            this.movX = -s / 1000;
            this.movY = 0;
            this.spritePos = {
                x: [[7], [7], [7], [7]],
                y: [[0], [1], [2], [3]],
                w: [1, 1, 1, 1],
                h: [1, 1, 1, 1],
            };
        }
        action() {
            if (this.x < -20) {
                let ww = (mapWidth < 100) ? 100 : mapWidth;
                this.x = (ww + 20);
            }
        }
    }

    if (typeof imported !== "undefined") {
        imported();
    }

    function drawFxs(fx, i) {
        //animation computing
        if (fx.action != null) {
            fx.action();
        }
        let fxX = fx.x + mapX;
        let fxY = fx.y + mapY;
        let fxW = fx.spritePos.w[fx.sprite];
        let fxH = fx.spritePos.h[fx.sprite];
        if (fx.frameCounter != null) {
            fx.frameCounter++;
            if (fx.frameCounter > fx.slowness) {
                fx.frame++;
                fx.frameCounter = 0;
            }
            if (fx.frame > fx.spritePos.x[fx.sprite].length - 1) {
                if (fx.repeat) {
                    fx.frame = 0;
                } else {
                    visualFxs.splice(i, 1);
                    return;
                }
            }
        }
        if (isOutOfScreen(fx)) {
            return;
        }
        //draw on canvascontext.translate(x, y);
        if (fx.movX || fx.movY) {
            fx.x += fx.movX;
            fx.y += fx.movY;
        }

        //c.translate(fxX+fxW/2, fxY+fxH/2);
        stats.blocks++;
        if (fx.rotation > 0) {
            fxY -= fxH / 2;
            c.save();
            c.translate(fxX * ratio, fxY * ratio);
            c.rotate(fx.rotation * Math.PI / 180);
            c.drawImage(
                fx.sheet,
                fx.spritePos.x[fx.sprite][fx.frame] * 16,
                fx.spritePos.y[fx.sprite][fx.frame] * 16,
                fx.spritePos.w[fx.sprite] * 16,
                fx.spritePos.h[fx.sprite] * 16,
                (-fxW / 2) * ratio | 0,
                (-fxH / 2) * ratio | 0,
                fxW * ratio | 0,
                fxH * ratio | 0);
            c.restore();
        } else {
            c.drawImage(
                fx.sheet,
                fx.spritePos.x[fx.sprite][fx.frame] * 16,
                fx.spritePos.y[fx.sprite][fx.frame] * 16,
                fx.spritePos.w[fx.sprite] * 16,
                fx.spritePos.h[fx.sprite] * 16,
                fxX * ratio | 0,
                fxY * ratio | 0,
                fxW * ratio | 0,
                fxH * ratio | 0);
        }

        //c.translate(-(fxX+fxW/2), -(fxY+fxH/2));
    }

    var specialTiles = [];
    class SpecialTile {
        constructor(x, y) {
            this.x = x;
            this.y = y;
            this.w = 1;
            this.h = 1;
            this.sheet = spriteSheet;
            this.sprite = [];
            this.spritePos = [[]];
            this.repeat = false;
            this.running = false;
            this.frameCounter = 0;
            this.frame = 0;
            this.slowness = 3;
            this.type = "";
        }
    }
    class Bouncy extends SpecialTile {
        constructor(x, y) {
            super(x, y);
            this.sprite = biome == 1 ? 1 : 0;
            this.spritePos = {
                x: [[11, 11, 11, 11], [11, 11, 11, 11]],
                y: [[4, 5, 6, 7], [8, 9, 10, 11]],
                w: [1, 1],
                h: [1, 1],
            };
            this.repeat = false;
            this.running = false;
            this.slowness = 3;
            this.type = "bouncy";
            this.hitbox = {
                x: x + 0.1,
                y: y + 0.1,
                w: 0.8,
                h: 0.8
            };
        }
        action(collider, colDir) {
            this.running = true;
            let bouncynessY = 0.32;
            let bounceOrNot = collider.dash ? 0.35 : 0;
            collider.xVel = 0;
            collider.yVel = 0;
            collider.grounded = false;
            this.running = true;
            let dir = player.left ? 1 : -1;
            switch (colDir) {
                case "b":
                    if (bounceOrNot !== 0) {
                        if (dir > 0) {
                            collider.x = this.x + this.w;
                        } else {
                            collider.x = this.x - collider.w;
                        }
                        if (player.left) {
                            visualFxs.push(new RingFx(collider.x, collider.y, 0));
                            audio.bounce2.playy();
                        } else {
                            visualFxs.push(new RingFx(collider.x, collider.y, 1));
                            audio.bounce3.playy();
                        }
                        collider.grounded = false;
                        collider.dash = false;
                        collider.dashCd = false;
                        collider.xVelExt = bounceOrNot * dir;
                        collider.yVel = -bouncynessY;
                    } else {
                        collider.grounded = false;
                        collider.yVel = -bouncynessY;
                        collider.dash = false;
                        collider.dashCd = false;
                        visualFxs.push(new RingFx(collider.x, collider.y, 2));
                        audio.bounce1.playy();
                    }
                    break;
                case "l":
                    //ring VFX
                    if (bounceOrNot !== 0) {
                        if (dir > 0) {
                            collider.x = this.x + this.w;
                        } else {
                            collider.x = this.x - collider.w;
                        }
                        visualFxs.push(new RingFx(collider.x, collider.y, 0));
                    } else {
                        visualFxs.push(new RingFx(collider.x, collider.y, 2));
                    }
                    audio.bounce2.playy();
                    collider.grounded = false;
                    collider.dash = false;
                    collider.dashCd = false;
                    collider.xVelExt = bounceOrNot;
                    collider.yVel = -bouncynessY;
                    break;
                case "r":
                    if (bounceOrNot !== 0) {
                        if (dir > 0) {
                            collider.x = this.x + this.w;
                        } else {
                            collider.x = this.x - collider.w;
                        }
                        visualFxs.push(new RingFx(collider.x, collider.y, 1));
                    } else {
                        visualFxs.push(new RingFx(collider.x, collider.y, 2));
                    }
                    audio.bounce3.playy();
                    collider.grounded = false;
                    collider.dash = false;
                    collider.dashCd = false;
                    collider.xVelExt = -bounceOrNot;
                    collider.yVel = -bouncynessY;
                    break;
                case "t":
                    if (collider.yVel < 0) {
                        collider.yVel = 0;
                    }
                    audio.bounce1.playy();
                    break;
            }
        }
    }
    class FallingStone extends SpecialTile {
        constructor(x, y) {
            super(x, y);
            this.sprite = 0;
            this.spritePos = {
                x: [[1], [1, 1], [2, 3, 4, 5, 6, 7, 8], [9]], //0
                y: [[18], [18, 19], [18, 18, 18, 18, 18, 18, 18], [5]], //18
                w: [1, 1, 1, 1],
                h: [1, 1, 2, 1],
            };
            this.repeat = true;
            this.running = false;
            this.slowness = 3;
            this.type = "falling";
            this.touched = 0;
            this.timer = 0;
            this.w = 1;
            this.h = 1;
            this.hitbox = {
                x: x,
                y: y,
                w: 1,
                h: 0.5
            };
        }
        action(collider, colDir) {
            switch (colDir) {
                case "b":
                    collider.grounded = true;
                    if (!this.touched) {
                        this.sprite = 1;
                        this.touched = true;
                        this.running = true;
                        audio.tremble.playy();
                    }
                    break;
                case "t":
                    if (collider.yVel < 0) {
                        collider.yVel = 0;
                    }
                    break;
            }
        }
        move() {
            if (this.touched) {
                c.drawImage(
                    spriteSheet,
                    0,
                    288,
                    16,
                    16,
                    (this.x + mapX) * ratio | 0,
                    (this.y + mapY) * ratio | 0,
                    ratio,
                    ratio
                );
                if (this.sprite == 1) {
                    this.timer++;
                    if (this.timer >= 30) {
                        audio.fall.playy();
                        this.frame = 0;
                        this.frameCounter = 0;
                        this.sprite = 2;
                        this.counter = 0;
                        this.slowness = 4;
                        this.running = true;
                        this.hitbox = {
                            x: 0,
                            y: 0,
                            w: 0,
                            h: 0
                        };
                        this.h = 2;
                    }
                    //sleep or delete
                }
                if (this.sprite == 2) {
                    //sleep or delete
                    if (this.frame >= this.spritePos.x[2].length - 1) {
                        this.frame = 0;
                        this.frameCounter = 0;
                        this.slowness = 3;
                        this.sprite = 3;
                        this.timer = 0;
                        this.h = 1;
                    }
                    this.running = true;
                }
                if (this.sprite == 3) {
                    //sleep or delete
                    this.timer++;
                    let testHitbox = {
                        x: this.x,
                        y: this.y,
                        w: 1,
                        h: 0.5
                    };
                    if (this.timer >= 120 && !collided(testHitbox, player)) {
                        this.touched = false;
                        this.sprite = 0;
                        this.timer = 0;
                        this.hitbox = {
                            x: this.x,
                            y: this.y,
                            w: 1,
                            h: 0.5
                        };
                    }
                }
            }
        }
    }
    class Clock extends SpecialTile {
        constructor(x, y) {
            super(x, y);
            this.sprite = 0;
            this.spritePos = {
                x: [[8, 9, 10, 11], [8, 9, 10, 11]], //0
                y: [[0, 0, 0, 0], [1, 1, 1, 1]], //18
                w: [1, 1],
                h: [1, 1],
            };
            this.repeat = true;
            this.running = true;
            this.slowness = 60;
            this.type = "clock";
            this.touched = false;
            this.xVel = 0;
            this.yVel = 0;
            this.speed = 0.1;
            this.w = 1;
            this.h = 1;
            this.stop = false;
            this.initialPos = {
                x: x,
                y: y
            };
            this.hitbox = {
                x: x,
                y: y,
                w: 1,
                h: 1
            };
        }
        action(collider, colDir) {
            switch (colDir) {
                case "b":
                    this.touched = true;
                    collider.grounded = true;
                    if (!this.stop) {
                        switch (this.frame) {
                            case 0:
                                collider.yVelExt = this.speed;
                                break;
                            case 1:
                                collider.xVelExt = this.speed;
                                break;
                            case 2:
                                collider.yVelExt = -this.speed;
                                break;
                            case 3:
                                collider.xVelExt = -this.speed;
                                break;
                        }
                    }
                    break;
                case "t":
                    if (collider.yVel < 0) {
                        collider.yVel = 0;
                    }
                    break;
            }
        }
        canMove() {
            let nextMovX = 0,
                nextMovY = 0;
            switch (this.frame) {
                case 0:
                    nextMovY = this.speed;
                    break;
                case 1:
                    nextMovX = this.speed;
                    break;
                case 2:
                    nextMovY = -this.speed;
                    break;
                case 3:
                    nextMovX = -this.speed;
                    break;
            }
            let nextHitbox = {
                x: this.x + nextMovX,
                y: this.y + nextMovY,
                w: 1,
                h: 1
            };
            for (let j = 0; j < map.length; j++) {
                if (collided(nextHitbox, map[j])) {
                    return false;
                }
            }
            return true;

        }
        move() {
            if (player.respawning) {
                this.x = this.initialPos.x;
                this.y = this.initialPos.y;
                this.hitbox.x = this.initialPos.x;
                this.hitbox.y = this.initialPos.y;
                this.frameCounter = 0;
                this.frame = 0;
            }


            this.xVel = 0;
            this.yVel = 0;
            if (this.touched) {
                this.frameCounter--;
                this.sprite = 1;
                if (this.canMove()) {
                    this.stop = false;
                    switch (this.frame) {
                        case 0:
                            this.yVel = this.speed;
                            break;
                        case 1:
                            this.xVel = this.speed;
                            break;
                        case 2:
                            this.yVel = -this.speed;
                            break;
                        case 3:
                            this.xVel = -this.speed;
                            break;
                    }
                    this.x += this.xVel;
                    this.y += this.yVel;
                    this.hitbox.x += this.xVel;
                    this.hitbox.y += this.yVel;
                } else {
                    this.stop = true;
                }
            } else {
                if (this.sprite !== 0) {
                    this.sprite = 0;
                    this.frame++;
                    this.frameCounter = 0;
                }
            }
            this.touched = false;
        }
    }
    class BreakableStone extends SpecialTile {
        constructor(x, y) {
            super(x, y);
            this.sprite = 0;
            this.spritePos = {
                x: [[0], [1, 3, 5, 7, 9, 11], [11, 9, 7, 5, 3, 1]], //0
                y: [[20], [20, 20, 20, 20, 20, 20], [22, 22, 22, 22, 22, 22]],
                w: [1, 2, 2],
                h: [1, 2, 2],
            };
            this.repeat = true;
            this.running = false;
            this.slowness = 4;
            this.initialPos = {
                x: x,
                y: y
            };
            this.type = "breakable";
            this.w = 1;
            this.h = 1;
            this.hitbox = {
                x: x,
                y: y,
                w: 1,
                h: 1
            };
        }
        action(collider, colDir) {
            switch (colDir) {
                case "b":
                    if (collider.dash) {
                        if (collider.left) {
                            this.x -= 1;
                            this.sprite = 2;
                        } else {
                            this.sprite = 1;
                        }
                        this.running = true;
                        this.y -= 0.5;
                        this.w = 2;
                        this.h = 2;
                        this.hitbox.w = 0;
                        this.hitbox.h = 0;
                        this.hitbox.x = 0;
                        this.hitbox.y = 0;
                        collider.col.B = 0;
                        audio.fall.playy();
                        shake = 4;
                    } else {
                        collider.grounded = true;
                    }
                    break;
                case "t":
                    if (collider.dash) {
                        if (collider.left) {
                            this.x -= 1;
                            this.sprite = 2;
                        } else {
                            this.sprite = 1;
                        }
                        this.running = true;
                        collider.col.T = 0;
                        this.y -= 0.5;
                        this.w = 2;
                        this.h = 2;
                        this.hitbox.w = 0;
                        this.hitbox.h = 0;
                        this.hitbox.x = 0;
                        this.hitbox.y = 0;
                        audio.fall.playy();
                        shake = 4;
                    } else if (collider.yVel < 0) {
                        collider.yVel = 0;
                    }
                    break;
                case "l":
                    if (collider.dash) {
                        this.sprite = 2;
                        this.running = true;
                        collider.col.L = 0;
                        this.y -= 0.5;
                        this.x -= 1;
                        this.w = 2;
                        this.h = 2;
                        this.hitbox.w = 0;
                        this.hitbox.h = 0;
                        this.hitbox.x = 0;
                        this.hitbox.y = 0;
                        audio.fall.playy();
                        shake = 4;
                    }
                    break;
                case "r":
                    if (collider.dash) {
                        this.sprite = 1;
                        this.running = true;
                        collider.col.R = 0;
                        this.y -= 0.5;
                        this.w = 2;
                        this.h = 2;
                        this.hitbox.w = 0;
                        this.hitbox.h = 0;
                        this.hitbox.x = 0;
                        this.hitbox.y = 0;
                        audio.fall.playy();
                        shake = 4;
                    }
                    break;
            }
        }
        move() {
            if (this.sprite == 0 && player.attack) {
                if (collided(player.atkHitbox, this)) {
                    if (player.left) {
                        this.sprite = 2;
                        this.running = true;
                        player.col.L = 0;
                        this.y -= 0.5;
                        this.x -= 1;
                        this.w = 2;
                        this.h = 2;
                        this.hitbox.w = 0;
                        this.hitbox.h = 0;
                        this.hitbox.x = 0;
                        this.hitbox.y = 0;
                        audio.fall.playy();
                        shake = 4;
                    } else {
                        this.sprite = 1;
                        this.running = true;
                        player.col.R = 0;
                        this.y -= 0.5;
                        this.w = 2;
                        this.h = 2;
                        this.hitbox.w = 0;
                        this.hitbox.h = 0;
                        this.hitbox.x = 0;
                        this.hitbox.y = 0;
                        audio.fall.playy();
                        shake = 4;
                    }
                }
            }
            if (player.respawning) {
                this.x = this.initialPos.x;
                this.y = this.initialPos.y;
                this.w = 1;
                this.h = 1;
                this.hitbox = {
                    x: this.x,
                    y: this.y,
                    w: 1,
                    h: 1
                };
                this.sprite = 0;
            }
            if (this.sprite == 1 || this.sprite == 2) {
                if (this.frame >= this.spritePos.x[this.sprite].length - 1) {
                    this.x = 0;
                    this.y = 0;
                    this.w = 0;
                    this.h = 0;
                }
            }
        }
    }
    class Speeder extends SpecialTile {
        constructor(x, y, dir) {
            super(x, y);
            this.repeat = true;
            this.running = true;
            this.sprite = dir;
            this.dir = dir;
            this.slowness = 3;
            this.spritePos = {
                x: [[12, 12, 12], [12, 12, 12]],
                y: [[5, 6, 7], [8, 9, 10]],
                w: [1, 1],
                h: [1, 1],
            };
            this.type = "speeder";
        }
        action(collider, colDir) {
            switch (colDir) {
                case "b":
                    audio.speed1.playy();
                    if (this.dir === 0) {
                        collider.xVelExt += 0.05;
                    } else if (this.dir === 1) {
                        collider.xVelExt -= 0.05;
                    }
                    collider.grounded = true;
                    break;
                case "t":
                    if (collider.yVel < 0) {
                        collider.yVel = 0;
                    }
                    break;
            }
        }
    }
    class Spikes extends SpecialTile {
        constructor(x, y, tile) {
            super(x, y);
            this.sprite = 0;
            this.spritePos = {
                x: [[tiles[tile][0]]],
                y: [[tiles[tile][1]]],
                w: [1],
                h: [1]
            };
            this.repeat = false;
            this.running = false;
            this.slowness = 3;
            this.type = "spikes";
            this.hitbox = {
                x: x,
                y: y,
                w: 1,
                h: 1
            };
            this.dmgHitbox = {
                x: x,
                y: y,
                w: 1,
                h: 1
            };
            switch (tiles[tile][1]) {
                case 5: //up
                    this.hitbox = {
                        x: x,
                        y: y + 0.5,
                        w: 1,
                        h: 0.5
                    };
                    this.dmgHitbox = {
                        x: x + 0.15,
                        y: y,
                        w: 0.7,
                        h: 0.6
                    };
                    break;
                case 6: //right
                    this.hitbox = {
                        x: x,
                        y: y,
                        w: 0.5,
                        h: 1
                    };
                    this.dmgHitbox = {
                        x: x + 0.4,
                        y: y + 0.15,
                        w: 0.6,
                        h: 0.7
                    };
                    break;
                case 7: //down
                    this.hitbox = {
                        x: x,
                        y: y,
                        w: 1,
                        h: 0.5
                    };
                    this.dmgHitbox = {
                        x: x + 0.15,
                        y: y + 0.4,
                        w: 0.7,
                        h: 0.6
                    };
                    break;
                case 8: //left
                    this.hitbox = {
                        x: x + 0.5,
                        y: y,
                        w: 0.5,
                        h: 1
                    };
                    this.dmgHitbox = {
                        x: x,
                        y: y + 0.15,
                        w: 0.6,
                        h: 0.7
                    };
                    break;

            }
        }
        action(collider, colDir) {
            switch (colDir) {
                case "b":
                case "l":
                case "r":
                case "t":
                    break;
            }
        }
        move() {
            if (!isOutOfScreen(this) && collided(this.dmgHitbox, player.dmgHitbox)) {
                if (!player.dead) {
                    visualFxs.push(new DeathFx(player.x, player.y));
                    audio.death.playy();
                    player.dead = true;
                    setTimeout(function () {
                        player.respawnEvent();
                    }, 1200);
                }
                if (player.yVel < 0) {
                    player.yVel = 0;
                }
            }
        }
    }
    class PizzaGuy extends SpecialTile {
        constructor(x, y) {
            super(x, y);
            this.repeat = true;
            this.initX = x;
            this.initY = y;
            this.running = true;
            this.sprite = 1;
            this.slowness = 6;
            this.load = 0;
            this.spritePos = {
                x: [[16, 16, 16, 16], [14, 14, 14, 14], [22, 22], [22]],
                y: [[21, 22, 23, 24], [21, 22, 23, 24], [21, 23], [21]],
                w: [1, 2, 2, 2],
                h: [1, 1, 2, 2],
            };
            this.hitbox = {
                x: x,
                y: y,
                w: 1,
                h: 1
            };
            this.type = "pizzaguy";
        }
        move() {
            switch (this.sprite) {
                case 0:
                    this.hitbox.x = this.initX;
                    this.x = this.initX;
                    this.w = 1;
                    break;
                case 1:
                    this.hitbox.x = this.initX;
                    this.x = this.initX - 1;
                    this.w = 2;
                    break;
                case 2:
                    this.hitbox.x = this.initX;
                    this.x = this.initX - 0.5;
                    this.y = this.initY - 1;
                    this.w = 2;
                    this.h = 2;
                    break;
                case 3:
                    this.hitbox.x = this.initX;
                    this.x = this.initX - 0.5;
                    this.y = this.initY - 1;
                    this.w = 2;
                    this.h = 2;
                    this.initX += 0.3;
                    if (isOutOfScreen(pizzaGuy)) {
                        this.load++;
                        blackScreen = this.load + 1;
                    }
                    break;
            }
        }
        action(collider, colDir) {}
    }
    class TimedSpikes extends SpecialTile {
        constructor(x, y, active, timing) {
            super(x, y);
            this.sprite = active ? 1 : 3;
            this.initialSprite = active ? 1 : 3;
            this.spritePos = {
                x: [[15], [15, 15, 15], [15], [15, 15, 15]],
                y: [[5], [6, 7, 8], [9], [8, 7, 6]],
                w: [1, 1, 1, 1],
                h: [1, 1, 1, 1],
            };
            this.repeat = true;
            this.running = true;
            this.active = active;
            this.initialActive = active;
            this.timing = 100;
            this.time = timing ? timing : 0;
            this.initialTime = timing ? timing : 0;
            this.slowness = 2;
            this.type = "timedSpikes";
            this.hitbox = {
                x: x,
                y: y + 0.5,
                w: 1,
                h: 0.5
            };
            this.dmgHitbox = {
                x: x + 0.15,
                y: y,
                w: 0.7,
                h: 0.5
            };
        }
        action(collider, colDir) {
            switch (colDir) {
                case "b":
                case "l":
                case "r":
                case "t":
                    break;
            }
        }
        move() {
            if (player.respawning) {
                this.time = this.initialTime;
                this.sprite = this.initialSprite;
                this.active = this.initialActive;
                this.frameCounter = 0;
                this.frame = 0;
            }
            this.time++;
            if (this.time > this.timing) {
                this.time = 0;
                this.active = !this.active;
                this.sprite = this.active ? 1 : 3;
                this.frameCounter = 0;
                this.frame = 0;
                if (options.audio == true && !isOutOfScreen(this)) {
                    let volume = (15 - Math.abs(player.hitbox.x + player.hitbox.w / 2 - this.x + this.w / 2)) / 30;
                    if (volume > 0) {
                        if (this.active) {
                            audio.spikes1.volume = volume;
                            audio.spikes1.playy();
                        } else {
                            audio.spikes2.volume = volume;
                            audio.spikes2.playy();
                        }
                    }
                }
            }
            switch (this.sprite) {
                case 0:
                    break;
                case 1:
                    if (this.frame >= this.spritePos.x[1].length - 1) {
                        this.frame = 0;
                        this.frameCounter = 0;
                        this.sprite = 2;
                    }
                    break;
                case 2:
                    if (collided(player, this.dmgHitbox)) {
                        if (!player.dead) {
                            visualFxs.push(new DeathFx(player.x, player.y));
                            audio.death.playy();
                            player.dead = true;
                            setTimeout(function () {
                                player.respawnEvent();
                            }, 1500);
                        }
                        if (player.yVel < 0) {
                            player.yVel = 0;
                        }
                    }
                    break;
                case 3:
                    if (this.frame >= this.spritePos.x[1].length - 1) {
                        this.frame = 0;
                        this.frameCounter = 0;
                        this.sprite = 0;
                    }
                    break;
            }
        }
    }
    class MovingPlat extends SpecialTile {
        constructor(x, y, sprite, xVel, yVel, range) {
            super(x, y);
            this.sprite = 0;
            this.spritePos = {
                x: [sprite[0]],
                y: [sprite[1]],
                w: [1],
                h: [1]
            };
            this.xVel = xVel;
            this.yVel = yVel;
            this.xI = x;
            this.yI = y;
            this.dir = 1;
            this.range = range;
            this.repeat = false;
            this.running = false;
            this.slowness = 3;
            this.type = "movingPlat";
        }
        move() {
            if (this.dir) {
                this.x += this.xVel;
                this.y += this.yVel;
                if (this.x >= this.xI + this.range && this.xVel !== 0 || this.y > this.yI + this.range && this.yVel !== 0) {
                    this.xVel *= -1;
                    this.yVel *= -1;
                    this.dir = 0;
                }
            } else {
                this.x += this.xVel;
                this.y += this.yVel;
                if (this.x <= this.xI && this.xVel !== 0 || this.y <= this.yI && this.yVel !== 0) {
                    this.xVel *= -1;
                    this.yVel *= -1;
                    this.dir = 1;
                }
            }
        }
        action(collider, colDir) {
            this.running = true;
            switch (colDir) {
                case "b":
                    collider.xVelExt = this.xVel;
                    if (this.yVel < 0) {
                        collider.yVelExt = this.yVel;
                    } else if (this.yVel < collider.maxVelocity) {
                        collider.grounded = true;
                        collider.yVelExt = this.yVel;
                    }
                    break;
                case "l":
                    //collider.xVel = 0;
                    if (this.xVel > 0) {
                        collider.xVelExt = this.xVel;
                    }
                    break;
                case "r":
                    //collider.xVel = 0;
                    if (this.xVel > 0) {
                        collider.xVelExt = this.xVel;
                    }
                    break;
                case "t":
                    if (collider.yVel < 0) {
                        collider.yVel = 0;
                    }
                    break;
            }
        }
    }

    function renderSpecialTiles() {
        for (let i = 0; i < specialTiles.length; i++) {
            if (isOutOfScreen(specialTiles[i]) && specialTiles[i].move == null) {
                continue;
            }
            if (specialTiles[i].move !== undefined) {
                specialTiles[i].move();
            }
            if (specialTiles[i].frameCounter !== undefined && specialTiles[i].running) {
                specialTiles[i].frameCounter++;
                if (specialTiles[i].frameCounter > specialTiles[i].slowness) {
                    specialTiles[i].frame++;
                    specialTiles[i].frameCounter = 0;
                }
                if (specialTiles[i].frame > specialTiles[i].spritePos.x[specialTiles[i].sprite].length - 1) {
                    specialTiles[i].frame = 0;
                    if (!specialTiles[i].repeat) {
                        specialTiles[i].running = false;
                    }
                }
            }

            if (isOutOfScreen(specialTiles[i])) {
                continue;
            }
            let collision = null;
            if (collided(player, specialTiles[i])) {
                collision = colCheck(player, specialTiles[i]);
            }
            if (collision !== null) {
                if (specialTiles[i].action !== undefined) {
                    specialTiles[i].action(player, collision);
                }
            }
            stats.blocks++;
            c.drawImage(
                specialTiles[i].sheet,
                specialTiles[i].spritePos.x[specialTiles[i].sprite][specialTiles[i].frame] * 16,
                specialTiles[i].spritePos.y[specialTiles[i].sprite][specialTiles[i].frame] * 16,
                specialTiles[i].spritePos.w[specialTiles[i].sprite] * 16,
                specialTiles[i].spritePos.h[specialTiles[i].sprite] * 16,
                (specialTiles[i].x + mapX) * ratio | 0,
                (specialTiles[i].y + mapY) * ratio | 0,
                (specialTiles[i].w) * ratio | 0,
                (specialTiles[i].h) * ratio | 0);
        }
    }

    function renderHpBars() {
        for (let i = 0; i < monsters.length; i++) {
            let hpRatio = monsters[i].hp / monsters[i].maxHp;
            let barW = Math.round(16 * hpRatio);
            c.drawImage(
                id("hp-bar"),
                0,
                0,
                16,
                2,
                (monsters[i].x + mapX + monsters[i].w / 2) * ratio - (ratio / 2) | 0,
                (monsters[i].y + mapY - 2 / 16) * ratio - (ratio / tileSize) | 0,
                (ratio) | 0,
                (2 / 16 * ratio) | 0
            );
            c.drawImage(
                id("hp-bar"),
                0,
                2,
                barW,
                2,
                (monsters[i].x + mapX + monsters[i].w / 2) * ratio - (ratio / 2) | 0,
                (monsters[i].y + mapY - 2 / 16) * ratio - (ratio / tileSize) | 0,
                (ratio * hpRatio) | 0,
                (2 / 16 * ratio) | 0
            );
        }
    }
    //document.onclick=()=>alert(monsters[0].x+" "+monsters[0].y)
    function renderTexts() {
        textsRemoveList = [];
        c.textAlign = "center";
        for (let i = 0; i < texts.length; i++) {
            texts[i].draw();
        }
        for (let i = textsRemoveList.length - 1; i >= 0; i--) {
            texts.splice(textsRemoveList[i], 1);
        }
    }

    /*
    actions:
    0:idle right
    1:idle left
    2:walk right
    3:walk left
    4:jump right
    5:jump left
    6:attack right
    7:attack left
    */


    ///////////////////////////////////////////////////////////////////////////////
    ////////////////////////////////// MAIN LOOP //////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////////
    if (!Date.now) {
        Date.now = function now() {
            return new Date().getTime();
        };
    }
    var blackScreen = 0;
    var timeStart = Date.now(),
        timeElapsed, deltaTime = 1;
    var requestAnimationFrame = window.requestAnimationFrame;
    if (!requestAnimationFrame) {
        loopMode = 2;
        requestAnimationFrame = function (arg) {
            setTimeout(arg, 1000 / 60);
        };
    }

    function loop() {
        if (loopMode !== 3 && loopInterval) {
            clearInterval(loopInterval);
        }
        if (!gamePaused && loopMode == 2) {
            setTimeout(loop, (1000 / 60));
        }
        /*
        let newTime = Date.now();
        timeElapsed = newTime - timeStart;
        timeStart = newTime;
        deltaTime = timeElapsed / (1000 / 60);
*/
        fps++;
        if (shake) {
            shake--;
            mapY += shakeArr[shake] / 20;
        }
        paused = 0;
        displaySpacebar = false; //[spacebar] to read
        c.clearRect(0, 0, canvas.width, canvas.height);
        c.fillStyle = bgColor;
        c.fillRect(0, 0, canvas.width, canvas.height);
        //calculate character
        //draw environment
        moveCamera();
        if (!player.dead && !isOutOfScreen(player)) {
            player.compute();
        } else if (!audio.walking.paused) {
            audio.walking.pause();
        }
        drawEnvironment();
        checkCollisions();
        renderSpecialTiles();
        for (let i = 0; i < monsters.length; i++) {
            monsters[i].frameCounter++;
            monsters[i].compute();
        }
        if (!player.dead) {
            player.adjustCollided();
        }
        //draw character
        for (let i = monsters.length - 1; i >= 0; i--) {
            if (isOutOfScreen(monsters[i])) {
                continue;
            }
            monsters[i].draw(i);
        }
        player.reading = false;
        for (let i = visualFxs.length - 1; i >= 0; i--) {
            if (visualFxs[i] == null) {
                continue;
            }
            drawFxs(visualFxs[i], i);
        }
        //happens when teleporting
        if (blackScreen) {
            c.globalAlpha = blackScreen / 100;
            c.fillStyle = "#000000";
            c.fillRect(0, 0, canvas.width, canvas.height);
            c.globalAlpha = 1;
            blackScreen--;
        }
        if (!player.dead) {
            player.draw();
        }
        if (displaySpacebar) {
            c.drawImage(
                spriteSheet,
                48,
                208,
                80,
                16,
                ((canvas.width / 2) - (5 * ratio / 2)) | 0,
                ((canvas.height / 1.2) - (1 * ratio / 2)) | 0,
                5 * ratio | 0,
                1 * ratio | 0);
        }
        renderTexts();
        displayStats();
        dialogueEngine.compute();
        moneyCounter.compute();
        if (touchDevice) {
            if (player.uncontrollable) {
                id("arrowCont").style.display = "none";
                id("spacebarCont").style.display = "none";
                id("othersCont").style.display = "none";
            } else {
                id("arrowCont").style.display = "block";
                id("spacebarCont").style.display = "block";
                id("othersCont").style.display = "block";
            }
        }
        if (!gamePaused && loopMode == 1) {
            requestAnimationFrame(loop);
        }
        if (gameEnded) {
            gameOver();
        }
    }
    ///////////////////////////////////////////////////////////////////////////////
    ////////////////////////////////// MAIN LOOP //////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////////




    function financial(x) {
        return Number.parseFloat(x).toFixed(2);
    }
    class MoneyCounter {
        constructor() {
            this.currentMoney = 0;
            this.totalMoney = 0;
            this.size = 1;
            this.color = sheetsColors[selectedSheet][3];
            this.color2 = sheetsColors[selectedSheet][2];
        }
        //moneys should be multiplied by 5 and then divided by 1000
        compute() {
            this.totalMoney = player.money + player.levelMoney;
            if (this.totalMoney > 0 || this.currentMoney > 0) {
                if (this.currentMoney < this.totalMoney) {
                    this.currentMoney += ((this.totalMoney - this.currentMoney) / 5);
                    if (this.currentMoney > this.totalMoney) {
                        this.currentMoney = this.totalMoney;
                    }
                }
                if (this.currentMoney > this.totalMoney) {
                    this.currentMoney += ((this.totalMoney - this.currentMoney) / 5);
                    if (this.currentMoney < this.totalMoney) {
                        this.currentMoney = this.totalMoney;
                    }
                }
                this.draw(financial(this.currentMoney * 5 / 1000));
            }
        }
        draw(moneyFixed) {
            moneyFixed += " C";
            c.textAlign = "right";
            c.font = Math.round(this.size * ratio) + "px" + " 'VT323'";
            c.fillStyle = this.color2;
            c.fillText(
                moneyFixed,
                canvas.width - ratio,
                ratio * 1.1);
            c.fillStyle = this.color;
            c.fillText(
                moneyFixed,
                canvas.width - ratio,
                ratio);

        }
    }
    var moneyCounter = new MoneyCounter();

    ///////////////////////////////////////////////////////////////////////////////
    ////////////////////////////// DIALOGUE ENGINE  ///////////////////////////////
    ///////////////////////////////////////////////////////////////////////////////
    /*
     */

    class DialogueEngine {
        constructor() {
            this.ratio = ratio;
            this.layout = id("d-layout");
            this.portraits = [[id("ghost-0"), id("ghost-1"), id("ghost-2")], [id("player-0"), id("player-1"), id("player-2")], [id("pizza-0"), id("pizza-1"), id("pizza-2"), id("pizza-3")]];
            this.portrait = 0;
            this.emotion = 0;
            this.wholeText = "";
            this.text = "";
            this.textIterator = 0;
            this.slowness = 3;
            this.slowness2 = 8;
            this.counter = 0;
            this.size = 0.8;
            this.input = 0;
            this.frame = 0;
            this.frameLength = 0;
            this.frameCounter = 0;
            this.color = "white";
            this.textBox = {
                x: (this.layout.width / tileSize / 3),
                y: (this.layout.height / tileSize / 1.8),
                w: (this.layout.width / tileSize) / 2,
                h: (this.layout.height / tileSize) / 2,
            };
            this.texts = [];
            this.voices = [voices.ghost, voices.player, voices.pizza];
            this.voice = this.voices[this.portrait][0];
        }
        newText(text, speaker) {
            let newTextObj = {
                text: text,
                type: speaker,

            };
            this.texts.push(newTextObj);
            player.uncontrollable = true;
            player.L = false;
            player.R = false;
            watchDown = false;
        }
        stopTalk() {
            for (let j = 0; j < this.voices.length; j++) {
                for (let k = 0; k < this.voices[j].length; k++) {
                    if (!this.voices[j][k].paused) {
                        this.voices[j][k].pause();
                        this.voices[j][k].currentTime = 0;
                    }
                }
            }
        }
        compute() {
            if (this.texts.length > 0) {
                let newPortrait = 0;
                switch (this.texts[0].type) {
                    case "ghostgirl":
                        newPortrait = 0;
                        this.frameLength = 3;
                        if (!isOutOfScreen(ghost)) {
                            camera.focus = 1;
                        }
                        break;
                    case "player":
                        newPortrait = 1;
                        this.frameLength = 0;
                        camera.focus = 0;
                        break;
                    case "pizzaguy":
                        newPortrait = 2;
                        this.frameLength = 0;
                        if (!isOutOfScreen(pizzaGuy) && !isOutOfScreen(pizzaGuy)) {
                            camera.focus = 2;
                        }
                        break;
                }
                if (newPortrait != this.portrait) {
                    this.stopTalk();
                    this.portrait = newPortrait;
                }
            }
            if (this.input) {
                this.stopTalk();
                if (this.text.length <= this.wholeText.length - 1) {
                    this.text = this.wholeText;
                    this.draw();
                    this.input = false;
                } else {
                    this.texts.splice(0, 1);
                    this.text = "";
                    this.textIterator = 0;
                    this.input = false;
                    if (this.texts.length > 0) {
                        this.draw();
                    } else {
                        player.uncontrollable = false;
                        camera.focus = 0;
                    }
                }
            } else if (this.texts.length > 0) {
                this.draw();
            }
        }
        speak() {
            if (this.voice.paused) {
                this.voice = this.voices[this.portrait][(Math.random() * this.voices[this.portrait].length) | 0];
                this.voice.playbackRate = 1;
                this.voice.play();
            }
        }
        draw() {
            //pizza guy: 0 serious - 1 angry - 2 sad - 3 happy
            if (this.wholeText !== this.texts[0].text) {
                this.wholeText = this.texts[0].text;
                if (this.texts[0].text[0] == "#") {
                    switch (this.texts[0].text[1]) {
                        case "0": //normal/thinking
                            if (this.emotion !== 0) {
                                this.emotion = 0;
                            }
                            break;
                        case "1": //concerned/serious
                            if (this.emotion !== 1) {
                                this.emotion = 1;
                            }
                            break;
                        case "2": //laughing/sad
                            if (this.emotion !== 2) {
                                this.emotion = 2;
                            }
                            break;
                        case "3": //laughing/sad
                            if (this.emotion !== 3 && this.portrait == 2) {
                                this.emotion = 3;
                            }
                            break;
                    }
                }
            }
            c.textAlign = "left";
            c.font = Math.round(this.size * ratio) + "px" + " 'VT323'";
            c.fillStyle = this.color;
            let lines = this.text.split('/n');
            for (let i = 0; i < lines.length; i++) {
                for (let j = lines[i].length - 1; j >= 0; j--) {
                    if (lines[i][j] == "#") {
                        switch (lines[i][j + 1]) {
                            case "0": //happy
                                if (this.emotion !== 0) {
                                    this.emotion = 0;
                                }
                                break;
                            case "1": //sad
                                if (this.emotion !== 1) {
                                    this.emotion = 1;
                                }
                                break;
                            case "2": //sad
                                if (this.emotion !== 2) {
                                    this.emotion = 2;
                                }
                                break;
                            case "3": //laughing/sad
                                if (this.emotion !== 3 && this.portrait == 2) {
                                    this.emotion = 3;
                                }
                                break;
                            case "a": //no pizza
                                pizzaGuy.sprite = 0;
                                break;
                            case "s": //pizza 
                                pizzaGuy.sprite = 1;
                                break;
                            case "d": //bike tremble
                                pizzaGuy.sprite = 2;
                                break;
                            case "f": //bike going
                                pizzaGuy.sprite = 3;
                                break;
                            case "k": //bike going
                                //gameEnded = true;
                                break;
                            case "b": //no money
                                player.money = 0;
                                break;
                        }
                    }
                }
                // emotions
                lines[i] = lines[i].replace("#0", "");
                lines[i] = lines[i].replace("#1", "");
                lines[i] = lines[i].replace("#2", "");
                lines[i] = lines[i].replace("#3", "");
                // pizzaGuy sprites
                lines[i] = lines[i].replace("#a", "");
                lines[i] = lines[i].replace("#s", "");
                lines[i] = lines[i].replace("#d", "");
                lines[i] = lines[i].replace("#f", "");
                lines[i] = lines[i].replace("#k", "");
                // coins/time
                lines[i] = lines[i].replace("#c", "" + financial(player.money * 5 / 1000));
                lines[i] = lines[i].replace("#e", "" + financial(player.money * 5 / 1000 - 8.5));
                lines[i] = lines[i].replace("#t", "" + session.endTime / 60 | 0);
                lines[i] = lines[i].replace("#b", "");

                lines[i] = lines[i].replace("#", "");
                lines[i] = lines[i].replace("/n", "");
                lines[i] = lines[i].replace("/", "");
            }

            // draw layout
            c.drawImage(
                this.layout,
                canvas.width / 2 - this.layout.width / tileSize * ratio / 2 | 0,
                canvas.height - this.layout.height / tileSize * ratio | 0,
                this.layout.width / tileSize * ratio | 0,
                this.layout.height / tileSize * ratio | 0
            );

            //draw portrait
            if (this.textIterator > 0) {
                this.frameCounter++;
                if (this.frameCounter >= this.slowness2) {
                    this.frameCounter = 0;
                    this.frame++;
                }
            }
            if (this.frame > this.frameLength) {
                this.frame = 0;
            }
            if (this.emotion >= this.portraits[this.portrait].length) {
                this.emotion--;
            }
            c.drawImage(
                this.portraits[this.portrait][this.emotion],
                0,
                82 * this.frame,
                this.layout.width,
                82,
                canvas.width / 2 - this.layout.width / tileSize * ratio / 2 | 0,
                canvas.height - this.layout.height / tileSize * ratio | 0,
                this.layout.width / tileSize * ratio | 0,
                this.layout.height / tileSize * ratio | 0
            );


            for (let i = 0; i < lines.length; i++) {
                c.fillText(
                    lines[i],
                    (this.layout.width / tileSize / 3 * ratio | 0) + (canvas.width / 2 - this.layout.width / tileSize * ratio / 2 | 0),
                    (this.layout.height / tileSize / 2.2 * ratio | 0) + (canvas.height - this.layout.height / tileSize * ratio | 0) + (this.size * ratio * i)
                );
            }
            if (this.text.length <= this.wholeText.length - 1) {
                this.counter++;
                if (this.counter >= this.slowness) {
                    this.counter = 0;
                    this.text += this.wholeText[this.textIterator];
                    this.textIterator++;
                    if (this.text[this.textIterator - 1] != " " && this.text[this.textIterator - 1] != ".") {
                        this.speak();
                    } else {
                        this.frame = 1;
                        this.frameCounter = 0;
                    }
                }
            } else {
                this.textIterator = 0;
                if (this.frameLength > 0) {
                    this.frame = 1;
                }
            }
        }
    }
    var dialogueEngine = new DialogueEngine();

    ///////////////////////////////////////////////////////////////////////////////
    ////////////////////////////// DIALOGUE ENGINE  ///////////////////////////////
    ///////////////////////////////////////////////////////////////////////////////

    var camBoxes = [];
    var camera = {
        focus: 0,
        subject: player
    };

    function moveCamera() {
        //locked camera
        camera.subject = player;
        switch (camera.focus) {
            case 0:
                camera.subject = player;
                break;
            case 1:
                camera.subject = ghost;
                break;
            case 2:
                camera.subject = pizzaGuy;
                break;
        }
        var camObject = 0;
        if (camBoxes.length > 0) {
            camObject = 0;
            for (let i = 0; i < camBoxes.length; i++) {
                if (collided(camera.subject, camBoxes[i])) {
                    cameraType = camBoxes[i].type;
                    camObject = camBoxes[i];
                }
            }

        }
        if (cameraType === 2) {
            mapX = -camObject.x;
            mapY = -camObject.y;
        }
        var cameraDir = tilesWidth / 2 - 2;
        if (cameraType === 0) {
            cameraDir = tilesWidth / 2 - 2;
        } else if (cameraType === 1) {
            cameraDir = camera.subject.left ? tilesWidth - 3 : 2;
        }
        //let cameraDir = player.left ? tilesWidth / 2 : tilesWidth / 6;
        if (mapX < -camera.subject.x + cameraDir) {
            // means camera moves forward
            if (Math.abs((-camera.subject.x + cameraDir - mapX) / 6) > 1 / 100) {
                mapX += (-camera.subject.x + cameraDir - mapX) / 6;
            }
        } else if (mapX > -camera.subject.x + cameraDir) {
            // means camera moves backward
            if (Math.abs((-camera.subject.x + cameraDir - mapX) / 6) > 1 / 100) {
                mapX += (-camera.subject.x + cameraDir - mapX) / 6;
            }
        }
        let lookDown = watchDown ? 15 / 4 : 0; //15 is tilesHeight standard
        if (mapY < -(camera.subject.y + lookDown) + tilesHeight / 2) {
            // means camera moves downward
            if (Math.abs((-(camera.subject.y + lookDown) + tilesHeight / 2 - mapY) / 6) > 1 / 100) {
                mapY += (-(camera.subject.y + lookDown) + tilesHeight / 2 - mapY) / 6;
            }
        } else if (mapY > -(camera.subject.y + lookDown) + tilesHeight / 2) {
            // means camera moves upward
            if (Math.abs((-(camera.subject.y + lookDown) + tilesHeight / 2 - mapY) / 6) > 1 / 100) {
                mapY += (-(camera.subject.y + lookDown) + tilesHeight / 2 - mapY) / 6;
            }
        }
    }

    function isOutOfScreen(Entity) {
        if (Entity == null) {
            return true;
        }
        if (Entity.x > tilesWidth - mapX) {
            return true;
        }
        if (Entity.x + Entity.w < -mapX) {
            return true;
        }
        if (Entity.y > tilesHeight - mapY + 1) {
            return true;
        }
        if (Entity.y + Entity.h < -mapY) {
            return true;
        }
        return false;
    }

    function checkCollisions() {
        player.grounded = false;
        player.col.L = false;
        player.col.R = false;
        player.col.T = false;
        player.col.B = false;
        for (let i = 0; i < monsters.length; i++) {
            monsters[i].grounded = false;
            monsters[i].col.L = false;
            monsters[i].col.R = false;
            monsters[i].col.T = false;
            monsters[i].col.B = false;
            if (collided(player, monsters[i])) {
                colCheck(player, monsters[i]);
            }
        }
        for (let i = 0; i < map.length; i++) {
            for (let m = 0; m < monsters.length; m++) {
                if (collided(monsters[m], map[i])) {
                    colCheck(monsters[m], map[i]);
                }
            }
            if (isOutOfScreen(map[i])) {
                continue;
            }
            if (collided(player, map[i])) {
                colCheck(player, map[i]);
            }
        }

        for (let i = 0; i < specialTiles.length; i++) {
            if (isOutOfScreen(specialTiles[i])) {
                continue;
            }
            for (let m = 0; m < monsters.length; m++) {
                if (collided(monsters[m], specialTiles[i])) {
                    colCheck(monsters[m], specialTiles[i]);
                }
            }
        }
    }

    var backgrounds = [id("bg1"), id("cloud1"), id("cloud2"), id("bg2"), id("bg3"), id("bg4")];
    var background = false;
    var cloudsX = [0, 0];

    function drawBackground() {
        for (let j = 0; j < 5; j++) {
            c.drawImage(
                backgrounds[1],
                (-tilesWidth / 2 + (backgrounds[1].width / tileSize) * j + mapX / 20 - cloudsX[0]) * ratio | 0,
                (mapY / 20) * ratio | 0,
                (backgrounds[1].width / tileSize) * ratio | 0,
                (backgrounds[1].height / tileSize) * ratio | 0
            );
        }
        cloudsX[0] += (backgrounds[1].width / tileSize) / 4000;
        if (cloudsX[0] >= backgrounds[1].width / tileSize) {
            cloudsX[0] = 0;
        }
        //clouds
        for (let j = 0; j < 5; j++) {
            c.drawImage(
                backgrounds[2],
                (-tilesWidth / 2 + (backgrounds[2].width / tileSize) * j + mapX / 18 - cloudsX[1]) * ratio | 0,
                (mapY / 18) * ratio | 0,
                (backgrounds[2].width / tileSize) * ratio | 0,
                (backgrounds[2].height / tileSize) * ratio | 0
            );
        }
        cloudsX[1] += (backgrounds[2].width / tileSize) / 6000;
        if (cloudsX[1] >= backgrounds[1].width / tileSize) {
            cloudsX[1] = 0;
        }
        for (let j = 0; j < 5; j++) {
            c.drawImage(
                backgrounds[3],
                (-tilesWidth / 2 + (backgrounds[3].width / tileSize) * j + mapX / 10) * ratio | 0,
                (5 + mapY / 10) * ratio | 0,
                (backgrounds[3].width / tileSize * ratio) | 0,
                (backgrounds[3].height / tileSize * ratio) | 0
            );
        }

        for (let j = 0; j < 5; j++) {
            c.drawImage(
                backgrounds[4],
                (-tilesWidth / 2 + (backgrounds[4].width / tileSize * j) + mapX / 8) * ratio | 0,
                (5 + mapY / 8) * ratio | 0,
                (backgrounds[4].width / tileSize) * ratio | 0,
                (backgrounds[4].height / tileSize) * ratio | 0
            );
        }
        for (let j = 0; j < 5; j++) {
            c.drawImage(
                backgrounds[5],
                (-tilesWidth / 2 * ratio + (backgrounds[5].width / tileSize * ratio * j) + (mapX * ratio) / 6) | 0,
                (5 + mapY / 8) * ratio | 0,
                (backgrounds[5].width / tileSize * ratio) | 0,
                (backgrounds[5].height / tileSize * ratio) | 0
            );
        }
        for (let j = 0; j < 5; j++) {
            c.drawImage(
                backgrounds[5],
                (-tilesWidth / 2 * ratio + (backgrounds[5].width / tileSize * ratio * j) + (mapX * ratio) / 6) | 0,
                (5 + mapY / 7) * ratio | 0,
                (backgrounds[5].width / tileSize * ratio) | 0,
                (backgrounds[5].height / tileSize * ratio) | 0
            );
        }
        for (let j = 0; j < 5; j++) {
            c.fillStyle = "#323c39";
            c.fillRect(
                (-tilesWidth / 2 * ratio + (backgrounds[5].width / tileSize * ratio * j) + (mapX * ratio) / 6) | 0,
                (5 + mapY / 7) * ratio + (backgrounds[5].height / tileSize * ratio) | 0,
                (backgrounds[5].width / tileSize * ratio) | 0,
                (backgrounds[5].height / tileSize * ratio) | 0
            );
        }
    }

    var checkBlock = {
        x: 0,
        y: 0,
        w: 0,
        h: 0
    };

    function drawEnvironment() {
        if (background) {
            drawBackground();
        }
        for (let i = bgTiles.length - 1; i >= 0; i--) {
            if (isOutOfScreen(bgTiles[i])) {
                continue;
            }
            for (let j = 0; j < bgTiles[i].h; j++) {
                for (let k = 0; k < bgTiles[i].w; k++) {
                    //skips out of bounds tiles
                    checkBlock.x = bgTiles[i].x + k;
                    checkBlock.y = bgTiles[i].y + j;
                    checkBlock.w = 1;
                    checkBlock.h = 1;
                    if (isOutOfScreen(checkBlock)) {
                        continue;
                    }
                    stats.blocks++;
                    c.drawImage(
                        spriteSheet,
                        tiles[bgTiles[i].type][0] * 16,
                        tiles[bgTiles[i].type][1] * 16,
                        tileSize,
                        tileSize,
                        (bgTiles[i].x + k + mapX) * ratio | 0,
                        (bgTiles[i].y + j + mapY) * ratio | 0,
                        ratio | 0,
                        ratio | 0);
                }
            }
        }
        for (let i = 0; i < map.length; i++) {
            if (isOutOfScreen(map[i])) {
                continue;
            }
            for (let j = 0; j < map[i].h; j++) {
                for (let k = 0; k < map[i].w; k++) {
                    checkBlock.x = map[i].x + k;
                    checkBlock.y = map[i].y + j;
                    checkBlock.w = 1;
                    checkBlock.h = 1;
                    if (isOutOfScreen(checkBlock)) {
                        continue;
                    }
                    stats.blocks++;
                    c.drawImage(
                        spriteSheet, tiles[map[i].type][0] * 16,
                        tiles[map[i].type][1] * 16,
                        tileSize,
                        tileSize,
                        (map[i].x + k + mapX) * ratio | 0,
                        (map[i].y + j + mapY) * ratio | 0,
                        ratio | 0,
                        ratio | 0);
                }
            }
        }
    }



    // COLLISION DETECTORS
    function colCheck(shapeA, shapeB) {
        stats.col3++;
        // get the vectors to check against
        var shapeAA, shapeBB;
        if (shapeA.hitbox != null) {
            shapeAA = shapeA.hitbox;
        } else {
            shapeAA = shapeA;
        }
        if (shapeB.hitbox != null) {
            shapeBB = shapeB.hitbox;
        } else {
            shapeBB = shapeB;
        }
        var vX = (shapeAA.x + (shapeAA.w / 2)) - (shapeBB.x + (shapeBB.w / 2)),
            vY = (shapeAA.y + (shapeAA.h / 2)) - (shapeBB.y + (shapeBB.h / 2)),
            // add the half widths and half heights of the objects
            hWidths = (shapeA.hitbox.w / 2) + (shapeBB.w / 2),
            hHeights = (shapeA.hitbox.h / 2) + (shapeBB.h / 2),
            colDir = null;

        // if the x and y vector are less than the half width or half height, they we must be inside the object, causing a collision
        if (Math.abs(vX) < hWidths && Math.abs(vY) < hHeights) {
            // figures out on which side we are colliding (top, bottom, left, or right)
            var oX = hWidths - Math.abs(vX),
                oY = hHeights - Math.abs(vY);
            if (oX >= oY) {
                if (vY > 0) {
                    colDir = "t";
                    if (shapeA.col.T < oY && !shapeB.xVel) {
                        shapeA.col.T += oY;
                        if (shapeA.type == "player") {
                            if (shapeB.type != null) {
                                shapeA.lastCollided = shapeB.type;
                            }
                        }
                    }
                } else {
                    colDir = "b";
                    if (shapeA.col.B < oY) {
                        shapeA.col.B = oY;
                        if (shapeA.type == "player") {
                            if (shapeB.type != null) {
                                shapeA.lastCollided = shapeB.type;
                            }
                        }
                    }
                    if (shapeB.xVel) {
                        shapeA.xVelExt = shapeB.xVel;
                    }
                    if (shapeB.xVel) {
                        if (shapeB.yVel < 0) {
                            shapeA.yVelExt = shapeB.yVel;
                        }
                        if (shapeB.yVel > 0) {
                            shapeA.yVelExt = shapeB.yVel;
                        }
                    }
                }
            } else {
                if (vX > 0) {
                    colDir = "l";
                    if (shapeA.col.L < oX) {
                        if (oX > 0.01)
                            shapeA.col.L += oX;
                        if (shapeA.type == "player") {
                            if (shapeB.type != null) {
                                shapeA.lastCollided = shapeB.type;
                            }
                        }
                    }
                } else {
                    colDir = "r";
                    if (shapeA.col.R < oX) {
                        if (oX > 0.01)
                            shapeA.col.R += oX;
                        if (shapeA.type == "player") {
                            if (shapeB.type != null) {
                                shapeA.lastCollided = shapeB.type;
                            }
                        }
                    }
                }
            }

        }

        return colDir;

    }

    function collided(a, b) {
        stats.col2++;
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

    function pointSquareCol(point, sq) {
        stats.col1++;
        var square = sq;
        if (sq.hitbox !== undefined) {
            square = sq.hitbox;
        }
        if (point.x > square.x) {
            if (point.x < square.x + square.w) {
                if (point.y > square.y) {
                    if (point.y < square.y + square.h) {
                        return true;
                    }
                }

            }
        }
        return false;
    }
    // STATS




    function displayStats() {
        id("BLOCKS").innerHTML = "blocks: " + stats.blocks;
        id("COL-1").innerHTML = "PointSquareColCheck: " + stats.col1;
        id("COL-2").innerHTML = "SquareSquareColCheck: " + stats.col2;
        id("COL-3").innerHTML = "DirSquarescolCheck: " + stats.col3;
        id("COL-L").innerHTML = "player.col.L: " + player.col.L;
        id("COL-R").innerHTML = "player.col.R: " + player.col.R;
        id("COL-T").innerHTML = "player.col.T: " + player.col.T;
        id("COL-B").innerHTML = "player.col.B: " + player.col.B;
        stats.blocks = 0;
        stats.col1 = 0;
        stats.col2 = 0;
        stats.col3 = 0;
    }







    //Mouse controls
    var jmpKeyPressed = 0;
    window.onmousedown = function (e) {
        if (player.uncontrollable) {
            dialogueEngine.input = 1;
        }
        if (typeof e === 'object' && !touchDevice && !player.uncontrollable) {
            switch (e.button) {
                case 0:
                    //console.log('Left button clicked.');
                    if (!gamePaused) {
                        player.attackEvent();
                    }
                    break;
                case 1:
                    //console.log('Middle button clicked.');
                    break;
                case 2:
                    //console.log('Right button clicked.');
                    if (!jmpKeyPressed && !gamePaused) {
                        player.jump();
                        jmpKeyPressed = true;
                    }
                    break;
                default:
                    console.log(`Unknown button code`);
            }
        }
    };
    window.onmouseup = function (e) {
        if (typeof e === 'object' && !touchDevice) {
            switch (e.button) {
                case 0:
                    //console.log('Left button clicked.');
                    break;
                case 1:
                    //console.log('Middle button clicked.');
                    break;
                case 2:
                    //console.log('Right button clicked.');
                    player.jumping = false;
                    jmpKeyPressed = false;
                    break;
                default:
                    console.log(`Unknown button code`);
            }
        }
    };
    window.oncontextmenu = function (event) {
        if (preventDefault) {
            event.preventDefault();
        }
    };

    function safeEval(level) {
        if (typeof level === 'object' && level !== null) {
            map = Object.create(level.map);
            spawnPoint = Object.create(level.spawnPoint);
            biome = level.biome;
            camBoxes = level.camBoxes;
            console.log("safe eval");
        }
    }

    var loopInterval = false;

    function startLoop() {
        if (gamePaused) {
            gamePaused = false;
            gameStarted = true;
            switch (loopMode) {
                case 1:
                    requestAnimationFrame(loop);
                    break;
                case 2:
                    setTimeout(loop, 1000 / 60);
                    break;
                case 3:
                    if (loopInterval) {
                        clearInterval(loopInterval);
                    }
                    loopInterval = setInterval(loop, 1000 / 58);
                    break;
            }

        }
    }

    function pauseLoop() {
        if (!gamePaused) {
            slowFlags = 0;
            gamePaused = true;
            switch (loopMode) {
                case 1:
                    break;
                case 2:
                    break;
                case 3:
                    clearInterval(loopInterval);
                    break;
            }
        }
    }
    // Mobile controls


    var touchDevice = false;

    function menuTransition(left) {
        if (left) {
            menuUI.visible = false;
            id("title-screen").style.left = "-100%";
            id("canvas").style.left = "0%";
            canvas.style.visibility = "visible";
            setTimeout(function () {
                id("title-screen").style.visibility = "hidden";
            }, 1000);
        } else {
            id("title-screen").style.visibility = "visible";
            id("title-screen").style.left = "0%";
            id("pause-screen").style.display = "none";
            id("pause-screen").style.visibility = "hidden";
            menuUI.visible = true;
        }
    }

    function mobileInit(isContinue) {
        touchDevice = true;
        console.log("mobile");
        adjustScreen("mobile");
        if (isContinue && canStorage) {
            safeEval(maps[window.localStorage['LvL'] || 0]);
            currentLevel = window.localStorage['LvL'];
            player.money = parseInt(window.localStorage["money"]);
            player.deaths = parseInt(window.localStorage["deaths"]);
            session.retention = parseInt(window.localStorage["time"]);
        } else {
            safeEval(maps[0]);
        }
        adaptBiome();
        initializeMap();
        startLoop();
        gameStarted = true;
        menuTransition(true);




        id("arrowCont").style.display = "block";
        id("spacebarCont").style.display = "block";
        id("othersCont").style.display = "block";
        id("up").ontouchstart = function () {
            id("up").style.transform = "scale(1.2)";
            id("up").style.opacity = "1";

            if (!jmpKeyPressed) {
                player.jump();
                jmpKeyPressed = true;
            }
        };
        id("canvas").ontouchstart = function () {
            if (player.uncontrollable) {
                dialogueEngine.input = 1;
            }
        };
        id("up").ontouchend = function () {
            id("up").style.transform = "";
            id("up").style.opacity = "0.4";

            player.jumping = false;
            if (player.jumping && player.jumpCounter < 9) {
                p.yVel = 0;
            }
            jmpKeyPressed = false;
        };

        id("left").ontouchstart = function () {
            id("left").style.transform = "scale(1.2)";
            id("left").style.opacity = "1";

            player.L = true;
        };
        id("left").ontouchend = function () {
            id("left").style.transform = "";
            id("left").style.opacity = "0.4";

            player.L = false;
        };

        id("right").ontouchstart = function () {
            id("right").style.transform = "scale(1.2)";
            id("right").style.opacity = "1";

            player.R = true;
        };
        id("right").ontouchend = function () {
            id("right").style.transform = "";
            id("right").style.opacity = "0.4";

            player.R = false;
        };
        id("atk").ontouchstart = function () {
            id("atk").style.transform = "scale(1.2)";
            id("atk").style.opacity = "1";

            player.attackEvent();
        };
        id("atk").ontouchend = function () {
            id("atk").style.transform = "";
            id("atk").style.opacity = "0.4";
        };
        id("lookDownBtn").ontouchstart = function () {
            id("lookDownBtn").style.transform = "scale(1.2)";
            id("lookDownBtn").style.opacity = "1";

            watchDown = true;
        };
        id("lookDownBtn").ontouchend = function () {
            id("lookDownBtn").style.transform = "";
            id("lookDownBtn").style.opacity = "0.4";

            watchDown = false;
        };
        id("lookFurtherBtn").ontouchstart = function () {
            id("lookFurtherBtn").style.transform = "scale(1.2)";
            id("lookFurtherBtn").style.opacity = "1";

            cameraType = 1;
        };
        id("lookFurtherBtn").ontouchend = function () {
            id("lookFurtherBtn").style.transform = "";
            id("lookFurtherBtn").style.opacity = "0.4";

            cameraType = 0;
        };

        id("spacebar").ontouchstart = function () {
            id("spacebar").style.transform = "scale(1.2)";
            id("spacebar").style.opacity = "1";
            if (gamePaused) {
                startLoop();
                id("arrowCont").style.visibility = "visible";
                id("othersCont").style.visibility = "visible";
                if (player.reading) {
                    id(player.currentBook).style.visibility = "hidden";
                } else {
                    pauseUI.visible = false;
                    id("pause-screen").style.display = "none";
                    id("pause-screen").style.visibility = "hidden";
                    id("controls").style.visibility = "hidden";
                }
            } else {
                id("arrowCont").style.visibility = "hidden";
                id("othersCont").style.visibility = "hidden";
                pauseLoop();
                //c.globalAlpha=0.6;
                //UI
                if (player.reading) {
                    id(player.currentBook).style.visibility = "visible";
                } else {
                    pauseUI.visible = true;
                    id("pause-screen").style.display = "block";
                    id("pause-screen").style.visibility = "visible";
                    id("controls").style.visibility = "hidden";
                }
            }
        };
        id("spacebar").ontouchend = function () {
            id("spacebar").style.transform = "";
            id("spacebar").style.opacity = "0.4";
        };

    }
    id("container").addEventListener('touchstart', function (e) {
        if (preventDefault) {
            e.preventDefault();
        }
    });
    id("newGame").addEventListener("touchstart", function () {

        mobileInit(false);
    }, {
        once: true
    });

    // Keyboard controls
    var xKeyDown = false,
        zKeyDown = false,
        spacebarPressed = false;
    window.addEventListener("keydown", function (event) {
        if (!menuUI.visible) {
            let key = event.keyCode;
            if (key !== 122) {

                if (preventDefault) {
                    event.preventDefault();
                }
            }
            if (key === 112) {
                id("stats").style.visibility = "visible";
                stats.colPoints = true;
            }
            if (key === 113) {
                console.log("performance mode");
                gamePaused = true;
                loopMode = 3;
                startLoop();
            }
            if (key === 114) {

            }
            if (!gamePaused && !player.uncontrollable && gameStarted) {
                switch (key) {
                    case 27:
                    case 32: // esc/space key
                        if (!spacebarPressed) {
                            pauseLoop();
                            console.log("pausing");
                            //c.globalAlpha=0.6;
                            //UI
                            if (player.reading) {
                                id(player.currentBook).style.visibility = "visible";
                            } else if (!spacebarPressed) {
                                pauseUI.visible = true;
                                id("pause-screen").style.display = "block";
                                id("pause-screen").style.visibility = "visible";
                                id("controls").style.visibility = "hidden";
                            }
                        }
                        spacebarPressed = true;
                        break;
                    case 65: //left key down (A / left arrow)
                    case 37:
                        player.L = true;
                        break;
                    case 68: //right key down (D / right arrow)
                    case 39:
                        player.R = true;
                        break;
                    case 83: //down key down (S /down arrow)
                    case 40:
                        watchDown = true;
                        break;
                    case 87: //jump key down (W / Z / up arrow)
                    case 90:
                    case 38:
                        if (!jmpKeyPressed) {
                            player.jump();
                            jmpKeyPressed = true;
                        }
                        break;
                    case 82: //R
                        if (!player.dead) {
                            visualFxs.push(new DeathFx(player.x, player.y));
                            audio.death.playy();
                            player.dead = true;
                            setTimeout(function () {
                                player.respawnEvent();
                            }, 1500);
                        }
                        break;
                    case 70: //attack key down (F / X)
                    case 88:
                        player.attackEvent();
                        break;
                    case 67: //camera key (C)
                        cameraType = 1;
                        break;
                    case 69: //dance key (E)
                        player.dance = true;
                        console.log("player.x: " + player.x + "\nplayer.y: " + player.y);
                        break;
                    case 71: //g key down
                        if (goldenUnlocked) {
                            goldenMode();
                        }
                        break;
                    case 72: //h key down
                        //nothing
                        break;
                    case 49: // 1
                        monsters.push(new Slime(5 - mapX, -mapY));
                        break;
                    case 50: // 2
                        monsters.push(new Lizard(5 - mapX, -mapY));
                        break;
                    case 51: // 3
                        monsters.push(new Zombie(5 - mapX, -mapY));
                        break;
                    case 52: // 4
                        monsters.push(new Superzombie(5 - mapX, -mapY));
                        break;
                    case 53: // 5
                        monsters.push(new Bear(5 - mapX, -mapY));
                        break;
                    case 54: // 6
                        /* TESTING PURPOSES
                        safeEval(maps[0]);
                        initializeMap();
                        */
                        break;
                    case 55: // 7
                        /* TESTING PURPOSES
                        safeEval(maps[10]);
                        initializeMap();
                        */
                        break;
                }
            } else if (key === 27 || key === 32) {

                //UI
                if (player.reading && !spacebarPressed) {
                    spacebarPressed = true;
                    id(player.currentBook).style.visibility = "hidden";
                    startLoop();
                    console.log("stopped reading");
                } else if (player.uncontrollable) {
                    spacebarPressed = true;
                    dialogueEngine.input = 1;
                    console.log("dialogues input");
                } else if (!spacebarPressed) {
                    spacebarPressed = true;
                    console.log("out of pause menu");
                    pauseUI.visible = false;
                    id("pause-screen").style.display = "none";
                    id("pause-screen").style.visibility = "hidden";
                    id("controls").style.visibility = "hidden";
                    startLoop();
                }
            } else if (key === 88) {
                if (!gamePaused && player.uncontrollable && !player.reading && !xKeyDown) {
                    dialogueEngine.input = 1;
                    xKeyDown = true;
                }
            } else if (key === 90) {
                if (!gamePaused && player.uncontrollable && !player.reading && !zKeyDown) {
                    dialogueEngine.input = 1;
                    zKeyDown = true;
                }
            }
            /*
            switch (key) {
                case 32: // esc/space key
                    gamePaused = true;
                    //c.globalAlpha=0.6;
                    //UI
                    if (player.reading) {
                        id(player.currentBook).style.visibility = "visible";
                    } else {
                        pauseUI.visible = true;
                        id("pause-screen").style.display = "block";
                        id("pause-screen").style.visibility = "visible";
                        id("controls").style.visibility = "hidden";
                    }

                    break;
                case 65: //left key down (A / left arrow)
                case 37:
                    player.L = true;
                    break;
                case 68: //right key down (D / right arrow)
                case 39:
                    player.R = true;
                    break;
                case 83: //down key down (S /down arrow)
                case 40:
                    watchDown = true;
                    break;
                case 87: //jump key down (W / Z / up arrow)
                case 90:
                case 38:
                    if (!jmpKeyPressed) {
                        player.jump();
                        jmpKeyPressed = true;
                    }
                    break;
            }
            */
        }
    });
    window.addEventListener("keyup", function (event) {
        let key = event.keyCode;
        if (gameStarted) {
            switch (key) {
                case 65: //left key up (A / left arrow)
                case 37:
                    player.L = false;
                    break;
                case 9:
                    switch (selectedSheet) {
                        case 0:
                            selectedSheet = 1;
                            if (player.golden) {
                                spriteSheet.src = "resources/sheetWarmPalette2.png";;
                            } else {
                                spriteSheet.src = sheets[selectedSheet];
                            }
                            bgColor = sheetsColors[selectedSheet][biome];
                            console.log(bgColor);
                            biomes[biome].bgColor = bgColor;
                            break;
                        case 1:
                            selectedSheet = 0;
                            if (player.golden) {
                                spriteSheet.src = "resources/goldenSheet.png";;
                            } else {
                                spriteSheet.src = sheets[selectedSheet];
                            }
                            bgColor = sheetsColors[selectedSheet][biome];
                            biomes[biome].bgColor = bgColor;
                            break;
                    }
                    break;
                case 67: //camera key (C)
                    cameraType = 0;
                    break;
                case 27: //spacebar
                case 32: //esc
                    spacebarPressed = false;
                    break;

                case 68: //right key up (D / right arrow)
                case 39:
                    player.R = false;
                    break;
                case 83: //down key up (S /down arrow)
                case 40:
                    watchDown = false;
                    break;
                case 87: //jump key down (W / Z / up arrow)
                case 90:
                case 38:
                    player.jumping = false;
                    if (player.jumping && player.jumpCounter < 9) {
                        p.yVel = 0;
                    }
                    jmpKeyPressed = false;
                    zKeyDown = false;
                    break;
                case 88:
                    xKeyDown = false;
                    break;
            }
        }
    });

    function adaptBiome() {
        background = biomes[biome].background;
        bgColor = biomes[biome].bgColor;
        biomes[biome].other();
    }
    var ghost = {};

    function songPlayer() {
        let pickSong = (currentLevel / 2 | 0) >= biomes[biome].music.length ? (Math.random() * biomes[biome].music.length) | 0 : currentLevel / 2 | 0;
        if (biomes[biome].music[pickSong].paused) {
            for (let j = 0; j < biomes.length; j++) {
                if (typeof biomes[j].ambient !== undefined) {
                    biomes[j].ambient.pause();
                    biomes[j].ambient.currentTime = 0;
                }
                for (let i = 0; i < biomes[j].music.length; i++) {
                    biomes[j].music[i].pause();
                    biomes[j].music[i].currentTime = 0;
                }
            }
            biomes[biome].music[pickSong].loop = true;
            biomes[biome].music[pickSong].playy();
            biomes[biome].ambient.playy();
        }
    }

    function initializeMap() {
        songPlayer();
        var spTiles = [];
        var removeList = [];
        specialTiles = [];
        bgTiles = [];
        visualFxs = [];
        player.x = spawnPoint.x;
        player.y = spawnPoint.y;
        ghost = new GhostGirl(player.x - 3, player.y - 3);
        player.events.length = 0;
        visualFxs.push(ghost);
        monsters = [];
        for (let i = map.length - 1; i >= 0; i--) {
            switch (map[i].type) {
                case 17:
                case 18:
                case 19:
                case 42:
                case 43:
                case 44:
                case 45:
                case 46:
                case 47:
                case 48:
                case 49:
                case 50:
                case 51:
                case 64:
                case 65:
                case 66:
                case 67:
                case 68:
                case 70:
                case 71:
                case 72:
                case 73:
                case 74:
                case 75:
                case 76:
                case 77:
                case 78:
                case 79:
                    spTiles.push(i);
                    removeList.push(i);
                    break;
                case 52:
                case 53:
                case 54:
                case 55:
                case 56:
                case 57:
                case 58:
                case 59:
                case 60:
                case 61:
                case 62:
                case 63:
                    bgTiles.push(map[i]);
                    removeList.push(i);
                    break;
            }
        }
        //[13, 5],[13, 6],[13, 7],[13, 8], //traps rock
        //[14, 5],[14, 6],[14, 7],[14, 8], //traps stone
        //constructor(x, y, active, timing) {
        for (let i = 0; i < spTiles.length; i++) {
            for (let j = 0; j < map[spTiles[i]].h; j++) {
                for (let k = 0; k < map[spTiles[i]].w; k++) {
                    switch (map[spTiles[i]].type) {
                        case 17:
                            specialTiles.push(new Bouncy(map[spTiles[i]].x + k, map[spTiles[i]].y + j));
                            break;
                        case 18:
                            visualFxs.push(new Grass(map[spTiles[i]].x + k, map[spTiles[i]].y + j));
                            break;
                        case 19: // speeder R
                            specialTiles.push(new Speeder(map[spTiles[i]].x + k, map[spTiles[i]].y + j, 0));
                            break;
                        case 42: // up
                        case 43: // right
                        case 44: // bottom
                        case 45: // left
                            specialTiles.push(new Spikes(map[spTiles[i]].x + k, map[spTiles[i]].y + j, map[spTiles[i]].type));
                            break;
                        case 46: // up
                        case 47: // right
                        case 48: // bottom
                        case 49: // left
                            specialTiles.push(new Spikes(map[spTiles[i]].x + k, map[spTiles[i]].y + j, map[spTiles[i]].type));
                            break;
                        case 50: // slime
                            monsters.push(new Slime(map[spTiles[i]].x + k, map[spTiles[i]].y + j));
                            break;
                        case 51: // speeder L
                            specialTiles.push(new Speeder(map[spTiles[i]].x + k, map[spTiles[i]].y + j, 1));
                            break;
                        case 64: // crystal
                            visualFxs.push(new Crystal(map[spTiles[i]].x + k, map[spTiles[i]].y + j));
                            break;
                        case 65: // door
                            visualFxs.push(new Door(map[spTiles[i]].x + k, map[spTiles[i]].y + j, map[spTiles[i]].text));
                            break;
                        case 66: // book
                            visualFxs.push(new Book(map[spTiles[i]].x + k, map[spTiles[i]].y + j, map[spTiles[i]].text));
                            break;
                        case 67: // timedSpikes
                            specialTiles.push(new TimedSpikes(map[spTiles[i]].x + k, map[spTiles[i]].y + j, 0, parseInt(map[spTiles[i]].text)));
                            break;
                        case 68: // timedSpikes
                            specialTiles.push(new TimedSpikes(map[spTiles[i]].x + k, map[spTiles[i]].y + j, 1, parseInt(map[spTiles[i]].text)));
                            break;
                        case 71: // falling Stone
                            specialTiles.push(new FallingStone(map[spTiles[i]].x + k, map[spTiles[i]].y + j));
                            break;
                        case 72: // breakable Stone
                            specialTiles.push(new BreakableStone(map[spTiles[i]].x + k, map[spTiles[i]].y + j));
                            break;
                        case 73: // clock
                            specialTiles.push(new Clock(map[spTiles[i]].x + k, map[spTiles[i]].y + j));
                            break;
                        case 75: // 0.01
                            visualFxs.push(new Coin(map[spTiles[i]].x + k, map[spTiles[i]].y + j, 1));
                            break;
                        case 76: // 0.05
                            visualFxs.push(new Coin(map[spTiles[i]].x + k, map[spTiles[i]].y + j, 2));
                            break;
                        case 77: // 0.10
                            visualFxs.push(new Coin(map[spTiles[i]].x + k, map[spTiles[i]].y + j, 3));
                            break;
                        case 78: // 0.10
                            pizzaGuy = new PizzaGuy(map[spTiles[i]].x + k, map[spTiles[i]].y + j);
                            specialTiles.push(pizzaGuy);
                            break;
                    }
                }
            }
            switch (map[spTiles[i]].type) {
                case 70: // dialogue
                    map[spTiles[i]].speaker = "ghostgirl";
                    player.events.push(map[spTiles[i]]);
                    break;
                case 74: // dialogue2
                    map[spTiles[i]].speaker = "player";
                    player.events.push(map[spTiles[i]]);
                    break;
                case 79: // dialogue3
                    map[spTiles[i]].speaker = "pizzaguy";
                    player.events.push(map[spTiles[i]]);
                    break;
            }
        }
        for (let i = 0; i < removeList.length; i++) {
            map.splice(removeList[i], 1);
        }

        for (let i = map.length - 1; i >= 0; i--) {
            if (map[i].y + map[i].h > mapHeight) {
                mapHeight = map[i].y + map[i].h;
            }
        }
        for (let i = map.length - 1; i >= 0; i--) {
            if (map[i].x + map[i].w > mapWidth) {
                mapWidth = map[i].x + map[i].w;
            }
        }

    }
    //UI
    window.onresize = function () {
        if (window.innerWidth >= canvas.width * 2 && window.innerHeight >= canvas.height * 2) {
            location.reload();
        }
        if (canvas.width > 320 && (window.innerWidth < canvas.width || window.innerHeight < canvas.height)) {
            location.reload();
        }
    };
    if (mapTester) {
        adjustScreen("pc");
        menuTransition(true);
        dialogueOn = true;
        adaptBiome();
        initializeMap();
        gamePaused = false;
        gameStarted = true;
        loop();
        console.log("map tester initialized");
    }
    if (!mapTester) {
        let buttons = document.getElementsByClassName("button");
        for (let i = 0; i < buttons.length; i++) {
            buttons[i].style.fontSize = (parseInt(id("container").style.width) / 20 | 0) + "px";
        }
        id("audio2").style.width = (parseInt(id("container").style.width) / 320 * 18) + "px";
        id("music2").style.width = (parseInt(id("container").style.width) / 320 * 18) + "px";
        id("twitter").style.fontSize = (parseInt(id("container").style.width) / 20 | 0) + "px";
        id("disclaimer").style.fontSize = (parseInt(id("container").style.width) / 30 | 0) + "px";
        id("twitter-logo").style.height = (parseInt(id("container").style.width) / 20 | 0) + "px";
        id("newGame").onmousedown = function () {
            goldenNotice = false;
            session = new Session();
            player = new Player(spawnPoint.x, spawnPoint.y);
            if (goldenUnlocked) {
                goldenMode();
            }
            adjustScreen("pc");
            console.log("pc");
            safeEval(maps[0]);
            adaptBiome();
            initializeMap();
            player.reading = true;
            gamePaused = true;
            gameStarted = false;
            menuTransition(true);
            loop();
            id("controls").style.visibility = "visible";
        };
        id("dialogueBtn").onclick = dialoguesOnOff;
        id("dialogueBtn").ontouchstart = dialoguesOnOff;
        if (canStorage) {
            if (window.localStorage['LvL'] != null && window.localStorage['LvL'] < 15) {
                id("continue").addEventListener("touchstart", function () {
                    mobileInit(true);
                }, {
                    once: true
                });
                id("continue").onmousedown = function () {
                    player = new Player(0, 0);
                    if (goldenUnlocked) {
                        goldenMode();
                    }
                    goldenNotice = false;
                    adjustScreen("pc");
                    safeEval(maps[parseInt(window.localStorage['LvL'] || 0)]);
                    currentLevel = parseInt(window.localStorage['LvL']);
                    session.retention = parseInt(window.localStorage['time']);
                    player.money = parseInt(window.localStorage["money"]);
                    console.log(parseInt(window.localStorage["money"]))
                    player.deaths = parseInt(window.localStorage["deaths"] || 0);
                    adaptBiome();
                    initializeMap();
                    startLoop();
                    gameStarted = true;
                    menuTransition(true);
                    id("controls").style.visibility = "hidden";
                };
                id("continue").style.opacity = "1";
            } else {
                id("continue").style.opacity = "0.5";
            }
        } else {
            id("continue").style.opacity = "0.5";
        }
    }
    var options = {
        audio: true,
        music: true,
    };
    id("ctrlButton").onclick = function () {
        pauseUI.visible = false;
        id("pause-screen").style.display = "none";
        id("pause-screen").style.visibility = "hidden";
        id("controls").style.visibility = "visible";
        canvas.style.visibility = "visible";
    };
    id("menuButton").onclick = function () {
        gameEnded = false;
        blackScreen = 0;
        credits = false;
        menuTransition(false);
        gamePaused = true;
        if (canStorage) {
            window.localStorage['time'] = session.retention;
            window.localStorage["money"] = player.money;
            window.localStorage["deaths"] = player.deaths;
            if (window.localStorage['LvL'] != null && window.localStorage['LvL'] < 15) {
                id("continue").onmousedown = function () {
                    player = new Player(0, 0);
                    adjustScreen("pc");
                    safeEval(maps[parseInt(window.localStorage['LvL'] || 0)]);
                    currentLevel = parseInt(window.localStorage['LvL']);
                    session.retention = parseInt(window.localStorage['time']);
                    player.money = parseInt(window.localStorage["money"]);
                    player.deaths = parseInt(window.localStorage["deaths"] || 0);
                    adaptBiome();
                    initializeMap();
                    startLoop();
                    gameStarted = true;
                    menuTransition(true);
                };
                id("continue").style.opacity = "1";
            }
        } else {
            id("continue").style.opacity = "0.5";
        }

    };
    id("music").onclick = musicBtn;
    id("music").ontouchstart = musicBtn;
    id("music2").onclick = musicBtn;
    id("music2").ontouchstart = musicBtn;

    function musicBtn() {
        if (options.music) {
            options.music = false;
            id("music").src = "ui/music-off.png";
            id("music2").src = "ui/music-off2.png";
            id("music2").style.opacity = "0.5";
            audio.haydn_1.volume = 0;
            audio.haydn_2.volume = 0;
            audio.bach_1.volume = 0;
            audio.bach_2.volume = 0;
            audio.bach_3.volume = 0;
            audio.bach_4.volume = 0;
            audio.bach_5.volume = 0;
            audio.bach_6.volume = 0;
            audio.bach_7.volume = 0;
        } else {
            options.music = true;
            id("music").src = "ui/music-on.png";
            id("music2").src = "ui/music-on2.png";
            id("music2").style.opacity = "1";
            audio.haydn_1.volume = 0.2;
            audio.haydn_2.volume = 0.2;
            audio.bach_1.volume = 0.3;
            audio.bach_2.volume = 0.3;
            audio.bach_3.volume = 0.3;
            audio.bach_4.volume = 0.3;
            audio.bach_5.volume = 0.3;
            audio.bach_6.volume = 0.3;
            audio.bach_7.volume = 0.3;
        }
    }
    id("audio").onclick = audioBtn;
    id("audio").ontouchstart = audioBtn;
    id("audio2").onclick = audioBtn;
    id("audio2").ontouchstart = audioBtn;

    function audioBtn() {
        if (options.audio) {
            options.audio = false;
            id("audio").src = "ui/sound-off.png";
            id("audio2").src = "ui/sound-off2.png";
            id("audio2").style.opacity = "0.5";
            for (let i = 0; i < voices.ghost.length; i++) {
                voices.ghost[i].volume = 0;
            }
            for (let i = 0; i < voices.player.length; i++) {
                voices.player[i].volume = 0;
            }
            for (let i = 0; i < voices.pizza.length; i++) {
                voices.pizza[i].volume = 0;
            }
            audio.bounce1.volume = 0;
            audio.bounce2.volume = 0;
            audio.bounce3.volume = 0;
            audio.bounce4.volume = 0;
            audio.speed1.volume = 0;
            audio.speed2.volume = 0;
            audio.jump.volume = 0;
            audio.dash.volume = 0;
            audio.attack.volume = 0;
            audio.hit.volume = 0;
            audio.portal.volume = 0;
            audio.death.volume = 0;
            audio.crystal.volume = 0;
            audio.walking.volume = 0;
            audio.ambient_1.volume = 0;
            audio.ambient_2.volume = 0;
            audio.tremble.volume = 0;
            audio.fall.volume = 0;
            audio.money_1.volume = 0;
            audio.money_2.volume = 0;
            audio.money_3.volume = 0;

        } else {
            options.audio = true;
            id("audio").src = "ui/sound-on.png";
            id("audio2").src = "ui/sound-on2.png";
            id("audio2").style.opacity = "1";
            for (let i = 0; i < voices.ghost.length; i++) {
                voices.ghost[i].volume = 0.4;
            }
            for (let i = 0; i < voices.player.length; i++) {
                voices.player[i].volume = 0.75;
            }
            for (let i = 0; i < voices.pizza.length; i++) {
                voices.pizza[i].volume = 0.75;
            }
            audio.bounce1.volume = 0.4;
            audio.bounce2.volume = 0.4;
            audio.bounce3.volume = 0.4;
            audio.bounce4.volume = 0.4;
            audio.speed1.volume = 0.8;
            audio.speed2.volume = 0.5;
            audio.jump.volume = 0.45;
            audio.dash.volume = 0.3;
            audio.attack.volume = 0.5;
            audio.hit.volume = 0.5;
            audio.portal.volume = 0.5;
            audio.death.volume = 0.5;
            audio.crystal.volume = 1;
            audio.walking.volume = 1;
            audio.ambient_1.volume = 0.1;
            audio.ambient_2.volume = 0.0;
            audio.tremble.volume = 0.1;
            audio.fall.volume = 0.1;
            audio.money_1.volume = 0.3;
            audio.money_2.volume = 0.3;
            audio.money_3.volume = 0.3;

        }
    }

    id("dialogues").onclick = dialoguesOnOff;
    id("dialogues").ontouchstart = dialoguesOnOff;

    function dialoguesOnOff() {
        if (dialogueOn) {
            id("dialogueBtn").innerHTML = "Dialogues(OFF)";
            id("dialogueBtn").style.opacity = "0.5";

            id("dialogues").src = "ui/dialogues-off.png";
        } else {
            id("dialogueBtn").innerHTML = "Dialogues(ON)";
            id("dialogueBtn").style.opacity = "1";

            id("dialogues").src = "ui/dialogues-on.png";
        }
        dialogueOn = !dialogueOn;
    }

    //UI end

    // GAMEPAD CONTROLS
    var haveEvents = 'GamepadEvent' in window;
    var controllers = {};

    function connectHandler(e) {
        gamepadOn = true;
        session.gamepad = true;
        addGamepad(e.gamepad);
        for (let i = 0; i < menuUI.buttons.length; i++) {
            if (i == menuUI.selected) {
                menuUI.buttons[i].className += " selected";
            } else {
                menuUI.buttons[i].classList.remove("selected");
            }
        }
        for (let i = 0; i < pauseUI.buttons.length; i++) {
            if (i == pauseUI.selected) {
                pauseUI.buttons[i].className += " selected";
            } else {
                pauseUI.buttons[i].classList.remove("selected");
            }
        }
    }
    var GAMEPAD = {
        index: "",
        buttons: [],
        axes: []
    };
    var GAMEPADcache = {
        index: "",
        buttons: [],
        axes: []
    };

    function handleGamepad() {
        for (let i = 0; i < GAMEPAD.buttons.length; i++) {
            if (GAMEPAD.buttons[i].pressed) {
                handleButtonPress(i);
            }
            if (GAMEPADcache.buttons[i].pressed >= 0.5 && GAMEPAD.buttons[i].pressed < 0.5) {
                handleButtonRelease(i);
            }
        }
        for (let i = 0; i < GAMEPAD.axes.length; i++) {
            if (i == 0 || i == 2) { //x Axes
                if (GAMEPAD.axes[i].value >= 0.5) {
                    handleButtonPress(15); //right
                } else if (GAMEPADcache.axes[i].value >= 0.5) {
                    handleButtonRelease(15); //right release
                }
                if (GAMEPAD.axes[i].value <= -0.5) {
                    handleButtonPress(14); //left
                } else if (GAMEPADcache.axes[i].value <= -0.5) {
                    handleButtonRelease(14); //left release
                }
            }
            if (i == 1 || i == 3) { //y Axes
                if (GAMEPAD.axes[i].value >= 0.5) {
                    handleButtonPress(13); //up
                } else if (GAMEPADcache.axes[i].value >= 0.5) {
                    handleButtonRelease(13); //up release
                }
                if (GAMEPAD.axes[i].value <= -0.5) {
                    handleButtonPress(12); //down
                } else if (GAMEPADcache.axes[i].value <= -0.5) {
                    handleButtonRelease(12); //down release
                }
            }
        }
        cacheInputs(GAMEPAD, GAMEPADcache);
    }

    function handleButtonPress(key) {
        if (gameStarted && !player.uncontrollable) { //!player.uncontrollable
            switch (key) {
                case 0: //A
                    if (!gamePaused) {
                        if (!jmpKeyPressed) {
                            player.jump();
                            jmpKeyPressed = true;
                        }
                    }
                    break;
                case 1: //B
                    player.attackEvent();
                    break;
                case 2: //X
                    cameraType = 1;
                    break;
                case 3: //Y
                    watchDown = true;
                    break;
                case 4: //L1
                    cameraType = 1;
                    break;
                case 5: //R1
                    cameraType = 1;
                    break;
                case 6: //L2
                    watchDown = true;
                    break;
                case 7: //R2
                    watchDown = true;
                    break;
                case 8: //SELECT
                    if (!player.dead) {
                        visualFxs.push(new DeathFx(player.x, player.y));
                        audio.death.playy();
                        player.dead = true;
                        setTimeout(function () {
                            player.respawnEvent();
                        }, 100);
                    }
                    break;
                case 9: //START
                    break;
                case 10: //LEFT PAD CLICK
                    player.dance = true;
                    break;
                case 11: //RIGHT PAD CLICK
                    player.dance = true;
                    break;
                case 12: //UP
                    break;
                case 13: //DOWN
                    watchDown = false;
                    break;
                case 14: //LEFT
                    player.L = true;
                    break;
                case 15: //RIGHT
                    player.R = true;
                    break;
                case 16: //
                    break;
            }
        }
    }

    function handleButtonRelease(key) {
        if (gameStarted) {
            if (!gamePaused && player.uncontrollable && !player.read) {
                if (key == 0 || key == 9) {
                    dialogueEngine.input = 1;
                }
            }
            switch (key) {
                case 0: //A
                    player.jumping = false;
                    if (player.jumping && player.jumpCounter < 9) {
                        p.yVel = 0;
                    }
                    jmpKeyPressed = false;
                    break;
                case 1: //B
                    break;
                case 2: //X
                    cameraType = 0;
                    break;
                case 3: //Y
                    watchDown = false;
                    break;
                case 4: //L1
                    cameraType = 0;
                    break;
                case 5: //R1
                    cameraType = 0;
                    break;
                case 6: //L2
                    watchDown = false;
                    break;
                case 7: //R2
                    watchDown = false;
                    break;
                case 8: //SELECT
                    break;
                case 9: //START
                    console.log("start");
                    if (!gamePaused && !player.uncontrollable) {
                        gamePaused = true;
                        //c.globalAlpha=0.6;
                        //UI
                        if (player.reading) {
                            id(player.currentBook).style.visibility = "visible";
                        } else {
                            pauseUI.visible = true;
                            id("pause-screen").style.display = "block";
                            id("pause-screen").style.visibility = "visible";
                            id("controls").style.visibility = "hidden";
                        }
                    } else {
                        if (player.reading) {
                            id(player.currentBook).style.visibility = "hidden";
                            startLoop();
                        } else if (player.uncontrollable) {
                            dialogueEngine.input = 1;
                        } else {
                            pauseUI.visible = false;
                            id("pause-screen").style.display = "none";
                            id("pause-screen").style.visibility = "hidden";
                            id("controls").style.visibility = "hidden";
                            startLoop();
                        }
                    }
                    break;
                case 10: //LEFT PAD CLICK
                    break;
                case 11: //RIGHT PAD CLICK
                    break;
                case 12: //UP
                    break;
                case 13: //DOWN
                    break;
                case 14: //LEFT
                    player.L = false;
                    break;
                case 15: //RIGHT
                    player.R = false;
                    break;
                case 16: //
                    break;
            }
        }
        if (menuUI.visible) {
            switch (key) {
                case 12: //UP
                case 14: //LEFT
                    menuUI.selected--;
                    if (menuUI.selected < 0) {
                        menuUI.selected = menuUI.buttons.length - 1;
                    }
                    for (let i = 0; i < menuUI.buttons.length; i++) {
                        if (i == menuUI.selected) {
                            menuUI.buttons[i].className += " selected";
                        } else {
                            menuUI.buttons[i].classList.remove("selected");
                        }
                    }
                    break;
                case 13: //DOWN
                case 15: //RIGHT
                    console.log("down");
                    menuUI.selected++;
                    if (menuUI.selected >= menuUI.buttons.length) {
                        menuUI.selected = 0;
                    }
                    for (let i = 0; i < menuUI.buttons.length; i++) {
                        if (i == menuUI.selected) {
                            menuUI.buttons[i].className += " selected";
                        } else {
                            menuUI.buttons[i].classList.remove("selected");
                        }
                    }
                    break;
                case 0: //A
                    if (menuUI.selected < 2) { //If new game or continue initialize for pc(by triggering mousedown)
                        triggerMouseEvent(menuUI.buttons[menuUI.selected], "mousedown");
                    } else {
                        triggerMouseEvent(menuUI.buttons[menuUI.selected], "click");
                    }
                    console.log("mhmhm");
                    break;
            }
        }
        if (pauseUI.visible) {
            switch (key) {
                case 12: //UP
                case 14: //LEFT
                    pauseUI.selected--;
                    if (pauseUI.selected < 0) {
                        pauseUI.selected = pauseUI.buttons.length - 1;
                    }
                    for (let i = 0; i < pauseUI.buttons.length; i++) {
                        if (i == pauseUI.selected) {
                            pauseUI.buttons[i].className += " selected";
                        } else {
                            pauseUI.buttons[i].classList.remove("selected");
                        }
                    }
                    break;
                case 13: //DOWN
                case 15: //RIGHT
                    pauseUI.selected++;
                    if (pauseUI.selected >= pauseUI.buttons.length) {
                        pauseUI.selected = 0;
                    }
                    for (let i = 0; i < pauseUI.buttons.length; i++) {
                        if (i == pauseUI.selected) {
                            pauseUI.buttons[i].className += " selected";
                        } else {
                            pauseUI.buttons[i].classList.remove("selected");
                        }
                    }
                    break;
                case 0: //A
                    triggerMouseEvent(pauseUI.buttons[pauseUI.selected], "click");
                    break;
            }
        }
    }

    function cacheInputs(a, b) {
        for (let i = 0; i < a.buttons.length; i++) {
            b.buttons[i].pressed = a.buttons[i].pressed;
        }
        for (let i = 0; i < a.axes.length; i++) {
            b.axes[i].value = a.axes[i].value;
        }
    }

    function addGamepad(gamepad) {
        controllers[gamepad.index] = gamepad;
        GAMEPAD.index = "id", "controller" + gamepad.index;
        GAMEPADcache.index = "id", "controller" + gamepad.index;
        for (let i = 0; i < gamepad.buttons.length; i++) {
            GAMEPAD.buttons.push({
                pressed: false,
            });
            GAMEPADcache.buttons.push({
                pressed: false,
            });
        }
        for (let i = 0; i < gamepad.axes.length; i++) {
            GAMEPAD.axes.push({
                value: 1,
            });
            GAMEPADcache.axes.push({
                value: 1,
            });
        }
        requestAnimationFrame(updateStatus);
    }

    function disconnectHandler(e) {
        gamepadOn = false;
        removeGamepad(e.gamepad);
    }

    function removeGamepad(gamepad) {
        delete controllers[gamepad.index];
    }

    function updateStatus() {
        scanGamepads();
        for (let j in controllers) {
            var controller = controllers[j];
            for (let i = 0; i < controller.buttons.length; i++) {
                var val = controller.buttons[i];
                var pressed = val == 1.0;
                if (typeof (val) == "object") {
                    pressed = val.pressed;
                    val = val.value;
                }
                GAMEPAD.buttons[i].pressed = val;
            }

            for (let i = 0; i < controller.axes.length; i++) {
                GAMEPAD.axes[i].value = controller.axes[i].toFixed(4);
            }
        }

        if (gamepadOn) {
            handleGamepad();
        }
        requestAnimationFrame(updateStatus);
    }

    function scanGamepads() {
        var gamepads = navigator.getGamepads ? navigator.getGamepads() : (navigator.webkitGetGamepads ? navigator.webkitGetGamepads() : []);
        for (let i = 0; i < gamepads.length; i++) {
            if (gamepads[i]) {
                if (!(gamepads[i].index in controllers)) {
                    addGamepad(gamepads[i]);
                } else {
                    controllers[gamepads[i].index] = gamepads[i];
                }
            }
        }
    }

    if (haveEvents) {
        window.addEventListener("gamepadconnected", connectHandler);
        window.addEventListener("gamepaddisconnected", disconnectHandler);
    } else {
        setInterval(scanGamepads, 500);
    }

    function triggerMouseEvent(node, eventType) {
        let clickEvent = document.createEvent('MouseEvents');
        clickEvent.initEvent(eventType, true, true);
        node.dispatchEvent(clickEvent);
    }


    /*CREDITS*/
    var credits = false;
    var badEnding = 1;

    function initCredits() {
        credits = {
            thanks: ["SPECIAL THANKS:", "", "[HAPPY TO HELP]", "Haris", "Bruno Andrade", "Tim Commandeur", "Aaron Denny", "Harrk", "indiexpo.net", "Guilherme Prada", "Rad Giraffe", "Francesco(SB_Fra5197)", "RE-MAT2089", "Skull Commando Labs", "Stone Story RPG", "my bro (@xluppolox)", "Sam", "", "and thanks to YOU for playing this far!"],
            img: [id("pizza"), id("no-pizza"), ],
            offsetY: tilesHeight * ratio,
            size: 1,
            slowness: 6,
            pizza: {
                size: 10,
                frame: 0,
                frameCounter: 0,
                wait: 30
            },
            rolling: false,
            badEnding: badEnding
        };
    }
    var gameEnded = false;
    var goldenSwapped = false;

    function gameOver() {
        if (!credits) {
            initCredits();
        }
        if (!credits.badEnding) {
            player.dance = true;
        }
        c.textAlign = "center";
        c.font = Math.round(credits.size * ratio) + "px" + " 'VT323'";
        c.fillStyle = "white";
        c.fillText("Game Over", canvas.width / 2 | 0, -canvas.height / 8 + credits.offsetY | 0); //text, x, y
        if (goldenNotice) {
            c.fillStyle = "#fbf236";
            c.fillText("Congratulations! You collected every coin !!", canvas.width / 2 | 0, -canvas.height / 8 + credits.offsetY + (credits.size * ratio) | 0); //text, x, y
            c.fillText("[Golden skin unlocked, press G to toggle]", canvas.width / 2 | 0, -canvas.height / 8 + credits.offsetY + (credits.size * 2 * ratio) | 0); //text, x, y
            if (!player.golden && !goldenSwapped) {
                goldenSwapped = true;
                goldenMode();
            }
        }
        c.fillStyle = "white";
        c.fillText("TIME: " + (session.endTime / 60 | 0) + " minutes and " + (session.endTime % 60 | 0) + " seconds", canvas.width / 2 | 0, -canvas.height / 8 + credits.offsetY + (credits.size * 3 * ratio) | 0); //text, x, y
        c.fillStyle = "#ac3232";
        c.fillText("DEATHS x" + (session.deaths.length), canvas.width / 2 | 0, -canvas.height / 8 + credits.offsetY + (credits.size * 4 * ratio) | 0); //text, x, y
        c.fillStyle = "white";
        c.fillText("PROGRAMMING, DESIGN, AUDIO and ART by", canvas.width / 2 | 0, -canvas.height / 8 + credits.offsetY + (credits.size * 6 * ratio) | 0); //text, x, y
        c.fillStyle = "#639bff";
        c.fillText("@saantonandre", canvas.width / 2 | 0, -canvas.height / 8 + credits.offsetY + (credits.size * 7 * ratio) | 0); //text, x, y
        c.fillStyle = "white";
        c.drawImage(
            credits.img[credits.badEnding],
            0,
            160 * credits.pizza.frame,
            160,
            160,
            canvas.width / 2 - (5 * ratio) | 0,
            canvas.height / 2 - (5 * ratio) + (credits.offsetY - tilesHeight * ratio) | 0,
            credits.pizza.size * ratio | 0,
            credits.pizza.size * ratio | 0);
        credits.pizza.frameCounter++;
        if (credits.pizza.frameCounter > 5) {
            credits.pizza.frameCounter = 0;
            if (credits.pizza.frame < credits.slowness) {
                credits.pizza.frame++;
                if (credits.badEnding) {
                    if (credits.pizza.frame === 1) {
                        voices.player[0].play();
                    }
                    if (credits.pizza.frame === 5) {
                        voices.player[1].play();
                    }
                }
            } else {
                if (credits.pizza.wait > 0) {
                    credits.pizza.wait--;
                } else {
                    credits.rolling = true;
                }
            }
        }
        if (credits.rolling) {
            if (credits.offsetY < -32 * ratio) {
                credits.rolling = false;
            } else {
                credits.offsetY -= 0.02 * ratio;
            }
        }
        for (let i = 0; i < credits.thanks.length; i++) {
            c.textAlign = "center";
            c.font = Math.round(credits.size * ratio) + "px" + " 'VT323'";
            c.fillStyle = "white";
            c.fillText(credits.thanks[i], canvas.width / 2 | 0, canvas.height / 2 + credits.offsetY + (credits.size * ratio * (i * 1.5)) | 0); //text, x, y
        }
    }


    if (!mapTester) {
        setInterval(() => {
            if (!gamePaused) {
                let device = touchDevice ? "mobile" : "pc";
                session.device = device;
                session.level = currentLevel;
                session.retention++;
                session.deathsN = player.deaths;
                session.dialogues = dialogueOn ? "ON" : "OFF";
            }
        }, 1000);
    }
    window.addEventListener("beforeunload", function (event) {
        if (canStorage) {
            window.localStorage["time"] = session.retention;
            window.localStorage["deaths"] = player.deaths;
        }
    });
}
