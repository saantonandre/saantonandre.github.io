/*
CLASS LIST

class Meta

class Map

class Player

class Entity

class Destructible

class Bomb

class Explosion

class Interface

class Portal

class Vfx

class Sounds

class Barrel

class GrogBarrel

class Grog

class Paper

class Spike

class MainMenu

class Instructions

class Necromancer

class Skull




*/


// ACHIEVEMENTS
/*
die 50 times - 5 points
die 100 times - 10 points
jump 50 times 5 points

die - 5 points
explode 30 barrels - 5 points

find grog - 15 points
find captain grog - 5 points
exchange with captain grog - 15 points
win main mode - 100 points 
destroy band - 5 points
win in less than 10 minutes- 20 points
win in less than 5 minutes- 50 points
win in less than 3 minutes- 100 points
zero deaths - 60 points

-hasty pirate
"Looks like he has places to go to, and possibly explode"

-fastest skeleton
"He might look like a "regular" skeleton, but he never skips femur day"

-ticking bomb
"Some tales will probably tell about this"

-zero deaths
"Not counting his first one of course"

-fair trade
"You gave Captain Grog what he wanted, and he gave you everything he had"

-Mutineer
"You're bound to explod-*coff*.. explore the seven seas"

-Killjoy
"(shanty music stops)"

-Captain Grog
"Another skeleton, a shady one.... most of them are, to be fair."

-Mysterious bottle
"Drink it? No, no. You simply do not drink what could be instead used as an explosive ingredient."

-Fallen Legend
"You approached Bertha, Captain Grog's cursed Gallion."

-How Dare You
"His thirst for power eventually drowned him."
*/
class Achievements {
    constructor() {
        this.sheet = id("medals-sheet");
        this.medals = [{
            name: "Captain Grog",
            x: 2,
            y: 2
        }, {
            name: "Hasty Pirate",
            x: 0,
            y: 4
        }, {
            name: "Fastest Skeleton",
            x: 1,
            y: 4
        }, {
            name: "Ticking Bomb",
            x: 2,
            y: 4
        }, {
            name: "ZERO DEATHS",
            x: 0,
            y: 1
        }, {
            name: "Fair Trade",
            x: 0,
            y: 3
        }, {
            name: "Killjoy",
            x: 2,
            y: 3
        }, {
            name: "Mutineer",
            x: 1,
            y: 3
        }, {
            name: "Mysterious Bottle",
            x: 1,
            y: 2
        }, {
            name: "*Mildly surprised expression*",
            x: 0,
            y: 0
        }, {
            name: "Fallen Legend",
            x: 0,
            y: 5
        }, {
            name: "How Dare You",
            x: 1,
            y: 5
        }, ]
        for (let i = 0; i < this.medals.length; i++) {
            this.medals[i].slowness = 6;
            this.medals[i].action = 0;
            this.medals[i].frame = 0;
            this.medals[i].duration = 150;
            this.medals[i].frameCounter = 0;
            this.medals[i].actionX = 150;
            this.medals[i].unlocked = false;
            this.medals[i].active = 0;
            // 0 opening -> 1 stationary -> 2 closing
            this.medals[i].actionY = [[0, 1, 2, 3, 4, 5, 6, 7], [7], [7, 6, 5, 4, 3, 2, 1, 0]];
            this.medals[i].h = 0;
            this.medals[i].actionH = [[0, 15, 30, 39, 43, 48, 48, 50], [50], [50, 48, 48, 43, 39, 30, 15, 0]];
        }
    }
    start(medal) {
        medal.active = true;
        sounds.notes1.playy();
    }
    test() {
        this.start(this.medals[0]);
    }
    unlock(eventName) {
        let i;
        for (i = 0; i < this.medals.length; i++) {
            if (this.medals[i].name == eventName) {
                if (!this.medals[i].unlocked) {
                    this.medals[i].unlocked = true;
                    //* ngio
                    unlockMedal(this.medals[i].name);
                    //*/
                }
                return;
            }
        }
    }
    render() {
        for (let i = 0, h = 0; i < this.medals.length; i++) {
            if (this.medals[i].active) {
                this.medals[i].frameCounter++;

                if (this.medals[i].frameCounter >= this.medals[i].slowness / meta.deltaTime) {
                    this.medals[i].frameCounter = 0;
                    this.medals[i].frame++;
                }
                if (this.medals[i].frame >= this.medals[i].actionY[this.medals[i].action].length) {
                    this.medals[i].frame = 0;
                    this.medals[i].frameCounter = 0;
                    // if opening has ended go stationary
                    if (this.medals[i].action == 0) {
                        this.medals[i].action = 1
                        //console.log(this.medals[i].action)

                    }
                    // if closing has ended return
                    if (this.medals[i].action == 2) {
                        this.medals[i].active = false;
                        this.medals[i].action = 0;
                        this.medals[i].duration = 100;
                        return;
                    }
                }

                // if stationary count down the duration
                if (this.medals[i].action == 1) {
                    // if duration is less then 0 start closing animation
                    if (this.medals[i].duration > 0) {
                        this.medals[i].duration -= meta.deltaTime;
                    } else {
                        this.medals[i].action = 2;
                    }
                }
                // if duration has ended


                // renders the medal
                c.drawImage(
                    this.sheet,
                    this.medals[i].x * 50,
                    this.medals[i].y * 50,
                    50,
                    this.medals[i].actionH[this.medals[i].action][this.medals[i].frame],
                    canvas.width - 1 * meta.ratio * meta.tilesize - (50 * meta.ratio),
                    3 * meta.ratio * meta.tilesize + (55 * meta.ratio * h),
                    50 * meta.ratio,
                    this.medals[i].actionH[this.medals[i].action][this.medals[i].frame] * meta.ratio,
                );


                // renders the rolling paper
                c.drawImage(
                    this.sheet,
                    this.medals[i].actionX,
                    this.medals[i].actionY[this.medals[i].action][this.medals[i].frame] * 50,
                    50,
                    50,
                    canvas.width - 1 * meta.ratio * meta.tilesize - (50 * meta.ratio),
                    3 * meta.ratio * meta.tilesize + (55 * meta.ratio * h),
                    50 * meta.ratio,
                    50 * meta.ratio,
                );
                h++;
            }
        }
    }
}

class Cronometer {
    constructor(time) {
        //seconds
        this.time = time || 0;
        this.lastTimeStamp = Date.now();
        this.fontSize = 16;
        this.timeText = "";
        this.display = false;
        document.addEventListener("keyup", function (e) {
            if (e.keyCode == 69) {
                meta.cronometer.display = !meta.cronometer.display;
            }
        })
    }
    resetTimeStamp() {
        this.lastTimeStamp = Date.now();
    }
    compute() {
        if (meta.loopType == 0 && map.currentLevel !== 17 && !meta.necroDefeated) {
            this.time += (Date.now() - this.lastTimeStamp) / 1000;
            this.timeText = (this.time / 60 | 0) + ":" + (this.time % 60 < 10 ? "0" : "") + (this.time % 60).toFixed(2);
        }
        if (this.display && meta.loopType != 2) {
            this.render();
        }
        this.resetTimeStamp();
    }
    render() {
        c.textAlign = "left";
        c.font = this.fontSize * meta.ratio + "px" + " 'VT323'";
        c.fillStyle = "#b86f50";
        c.strokeStyle = "#000000";
        c.lineWidth = 2 * meta.ratio;

        c.strokeText(this.timeText, 0.6 * meta.tilesize * meta.ratio, -this.fontSize + meta.tilesHeight * meta.tilesize * meta.ratio);
        c.fillText(this.timeText, 0.6 * meta.tilesize * meta.ratio, -this.fontSize + meta.tilesHeight * meta.tilesize * meta.ratio);
    }
}
class Meta {
    constructor() {
        this.fps = 0;
        this.loopType = 0;
        this.ratio = 2;
        this.tilesize = 16;
        this.deltaTime = 1;
        this.targetFrames = 50;
        this.tilesWidth = 32;
        this.tilesHeight = 20;
        this.terminalVel = 0.5;
        this.volume = 0.6;
        this.musicVolume = 0.3;
        this.sfxsVolume = 0.5;
        this.deathCounter = 0;
        this.runTime = 0;
        this.displayTimer = 0;
        this.barrelsDestroyed = 0;
        this.bombCounter = 0;

        this.deathRecord = "none";
        this.timeRecord = "none";
        this.bombRecord = "none";
        this.necroDefeated = false;

        this.berthaDeathRecord = "none";
        this.berthaTimeRecord = "none";
        this.berthaBombRecord = "none";

        this.onBertha = false;

        // Delta Time Computing
        this.perfectFrameTime = 1000 / this.targetFrames;
        this.lastTimestamp = Date.now();
        this.timestamp = Date.now();
        this.bulletTime = false;
        //save variables
        this.papers = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        this.gaveGrog = 0;
        this.gotAllPapers = 0;
        this.cronometer = new Cronometer();
    }
    updateDeltaTime() {
        this.lastTimestamp = this.timestamp;
        this.timestamp = Date.now();
        this.deltaTime = (this.timestamp - this.lastTimestamp) / this.perfectFrameTime;

        // Forces the max slowness as half the fps target
        if (this.deltaTime > 2) {
            this.deltaTime = 2;
        }
    }

}
class Interface {
    constructor() {
        this.levelDisplayer = {
            maxLevel: 0,
            currentLevel: 0,
            fontSize: 20,
            x: 0.6,
            y: 0.4,
            render: function () {
                c.textAlign = "left";
                c.font = this.fontSize * meta.ratio + "px" + " 'VT323'";
                c.fillStyle = "#b86f50";
                c.strokeStyle = "#000000";
                c.lineWidth = 2 * meta.ratio;
                c.strokeText(
                    map.currentLevel + 1 + "/" + (map.levels.length - 1),
                    this.x * meta.tilesize * meta.ratio,
                    this.y * meta.tilesize * meta.ratio + this.fontSize * meta.ratio,
                )
                c.fillText(
                    map.currentLevel + 1 + "/" + (map.levels.length - 1),
                    this.x * meta.tilesize * meta.ratio,
                    this.y * meta.tilesize * meta.ratio + this.fontSize * meta.ratio,
                )
            }
        }
        this.deathDisplayer = {
            sheet: id("sheet"),
            fontSize: 20,
            x: 1.5,
            y: 0.8,
            actionX: [0],
            actionY: [5],
            render: function () {
                c.textAlign = "left";
                c.font = this.fontSize * meta.ratio + "px" + " 'VT323'";
                c.fillStyle = "#b86f50";
                c.strokeStyle = "#000000";
                c.lineWidth = 2 * meta.ratio;
                c.strokeText(
                    meta.deathCounter,
                    1.7 * meta.tilesize * meta.ratio,
                    1.7 * meta.tilesize * meta.ratio + this.fontSize * meta.ratio,
                )
                c.fillText(
                    meta.deathCounter,
                    1.7 * meta.tilesize * meta.ratio,
                    1.7 * meta.tilesize * meta.ratio + this.fontSize * meta.ratio,
                )
                c.drawImage(
                    this.sheet,
                    this.actionX[0] * meta.tilesize,
                    this.actionY[0] * meta.tilesize,
                    1 * meta.tilesize,
                    1 * meta.tilesize,
                    (this.x - 1) * meta.tilesize * meta.ratio,
                    (this.y) * meta.tilesize * meta.ratio + this.fontSize * meta.ratio,
                    1 * meta.tilesize * meta.ratio,
                    1 * meta.tilesize * meta.ratio
                )
            }
        }
        this.itemsDisplayer = {
            sheet: id("sheet"),
            fontSize: 16,
            x: meta.tilesWidth - 1.5,
            y: 0.6,
            actionX: [1, 0],
            actionY: [15, 16],
            text: ["x1", ""],
            render: function (what) {
                c.textAlign = "left";
                c.font = this.fontSize * meta.ratio + "px" + " 'VT323'";
                c.fillStyle = "#b86f50";
                c.strokeStyle = "#000000";
                c.lineWidth = 2 * meta.ratio;
                if (what) {
                    let papersAmount = 0;
                    for (let i = 0; i < meta.papers.length; i++) {
                        if (meta.papers[i]) {
                            papersAmount++;
                        }
                    }
                    let playerPaper = 0;
                    if (player.currentPaper !== "none") {
                        playerPaper = 1;
                    }

                    this.text[what] = "" + (papersAmount + playerPaper) + "/" + meta.papers.length;
                }
                c.strokeText(
                    this.text[what],
                    (this.x - what) * meta.tilesize * meta.ratio,
                    this.y * meta.tilesize * meta.ratio + this.fontSize * meta.ratio,
                )
                c.fillText(
                    this.text[what],
                    (this.x - what) * meta.tilesize * meta.ratio,
                    this.y * meta.tilesize * meta.ratio + this.fontSize * meta.ratio,
                )
                c.drawImage(
                    this.sheet,
                    this.actionX[what] * meta.tilesize,
                    this.actionY[what] * meta.tilesize,
                    1 * meta.tilesize,
                    1 * meta.tilesize,
                    (this.x - 1 - what) * meta.tilesize * meta.ratio,
                    (this.y - 0.9) * meta.tilesize * meta.ratio + this.fontSize * meta.ratio,
                    1 * meta.tilesize * meta.ratio,
                    1 * meta.tilesize * meta.ratio
                )
            }
        }
    }
    render() {
        if (map.currentLevel + 1 > map.levels.length - 1) {
            return;
        }
        this.levelDisplayer.render();
        this.deathDisplayer.render();
        if (player.hasGrog) {
            this.itemsDisplayer.render(0);
        }
        if (meta.gaveGrog) {
            this.itemsDisplayer.render(1);
        }
    }

}
class MainMenu {
    constructor() {
        loadGame();
        this.bg = id("title");
        this.sheet = id("sheet");
        this.hasLoad = (canStorage && map.currentLevel !== 0 && map.currentLevel !== 17);
        this.active = false;
        this.pinkBomb = new MenuBomb(0);
        this.blackBomb = new MenuBomb(1);

        this.clickedNewGame = false;
        this.clickedOptions = false;
        this.clickedContinue = false;
        this.clickedGallionBertha = false;
        this.optionsDisplay = false;
        this.newGame1 = {
            action: 0,
            actionY: [23, 24],
            x: 10,
            y: 12,
            w: 5,
            h: 1
        }
        this.newGame2 = {
            action: 0,
            actionY: [43, 44],
            x: 10,
            y: 12,
            w: 6,
            h: 1
        }
        this.newGame = this.newGame1;
        this.options = {
            action: 0,
            actionY: [35, 36],
            x: 10,
            y: 14.5,
            w: 5,
            h: 1
        }
        this.continue = {
            action: 1,
            actionY: [25, 26, 27],
            x: 17,
            y: 12,
            w: 5,
            h: 1
        }
        this.gallionBertha = {
            action: 0,
            actionY: [29, 31, 33],
            x: 17,
            y: 14,
            w: 5,
            h: 2
        }
        this.back = {
            action: 0,
            actionX: [0, 2],
            actionY: [42, 42],
            x: 15,
            y: 17,
            w: 2,
            h: 1
        }
        this.masterSlider = new MenuSlider(5, 10, 0);
        this.sfxSlider = new MenuSlider(5, 12, 2);
        this.musicSlider = new MenuSlider(5, 14, 1);
        this.ratioSelector = new MenuRatioSelector(16, 10);
        this.credits = new MenuCredits(20.5, 14);
        this.deleteProgress = new MenuDeleteProgress(18, 12);
        this.twitterHandle1 = new TwitterHandle(0.3, 0.9, 1);
        this.twitterHandle2 = new TwitterHandle(0.3, 2.2, 0);
        if (!this.hasLoad) {
            this.continue.action = 0;
        }
        if (meta.gotAllPapers) {
            this.gallionBertha.action = 1;
        }
        window.addEventListener("click", function () {
            if (meta.loopType !== 2) {
                return;
            }
            if (mainMenu.optionsDisplay) {
                if (pointSquareCol(cursor.mapPos, mainMenu.back)) {
                    mainMenu.optionsDisplay = false;
                }
                return;
            }
            if (mainMenu.clickedContinue || mainMenu.clickedNewGame || mainMenu.clickedOptions || mainMenu.clickedGallionBertha) {
                return;
            }
            if (pointSquareCol(cursor.mapPos, mainMenu.newGame)) {
                sounds.throw.playy();
                mainMenu.clickedNewGame = true;
            }
            if (mainMenu.hasLoad && pointSquareCol(cursor.mapPos, mainMenu.continue)) {
                sounds.throw.playy();
                mainMenu.clickedContinue = true;
            }
            if (meta.gotAllPapers && pointSquareCol(cursor.mapPos, mainMenu.gallionBertha)) {
                sounds.throw.playy();
                mainMenu.clickedGallionBertha = true;
            }

            if (pointSquareCol(cursor.mapPos, mainMenu.options)) {
                sounds.throw.playy();
                mainMenu.clickedOptions = true;
            }

        })
    }
    triggerContinue() {
        this.clickedContinue = false;
        this.clickedNewGame = false;
        this.clickedGallionBertha = false;
        this.clickedOptions = false;
        meta.necroDefeated = false;
        captureStopMotion();

        meta.loopType = 1;
        if (meta.onBertha) {
            //changes the levels to the bertha levels
            levels = berthaLevels;
            //imports the levels to the map
            importLevelsArray(levels);
            //changes the bg
            map.bgImages = map.bgImagesBertha;
            meta.onBertha = true;
            if (sounds.shanty_3.paused) {
                sounds.shanty_3.playy();
            }
        } else {
            //changes the levels to the bertha levels
            levels = mainLevels;
            //imports the levels to the map
            importLevelsArray(levels);
            //changes the bg
            map.bgImages = map.bgImagesMain;
            meta.onBertha = false;
            if (sounds.shanty_1.paused) {
                sounds.shanty_1.playy();
            }
        }

        loadGame();
        loadLevel();
    }
    triggerNewGame() {
        this.clickedContinue = false;
        this.clickedNewGame = false;
        this.clickedGallionBertha = false;
        this.clickedOptions = false;
        meta.necroDefeated = false;
        captureStopMotion();
        meta.loopType = 1;

        //changes the levels to the bertha levels
        levels = mainLevels;
        //imports the levels to the map
        importLevelsArray(levels);
        //changes the bg
        map.bgImages = map.bgImagesMain;
        meta.onBertha = false;

        loadGame(true);
        loadLevel();
        if (sounds.shanty_1.paused) {
            sounds.shanty_1.playy();
        }
    }
    triggerOptions() {
        this.optionsDisplay = true;
        this.clickedContinue = false;
        this.clickedNewGame = false;
        this.clickedGallionBertha = false;
        this.clickedOptions = false;
    }
    triggerGallionBertha() {
        meta.necroDefeated = false;
        achievements.unlock("Fallen Legend");
        this.clickedContinue = false;
        this.clickedNewGame = false;
        this.clickedGallionBertha = false;
        this.clickedOptions = false;
        //alert("This area is still in development. Your progress has been saved, return within the next patches and you'll be able to enter this game mode! ")
        captureStopMotion();
        meta.loopType = 1;
        map.currentLevel = 0;

        //changes the levels to the bertha levels
        levels = berthaLevels;
        //imports the levels to the map
        importLevelsArray(levels);
        //changes the bg
        map.bgImages = map.bgImagesBertha;

        meta.onBertha = true;

        loadGame(true);
        loadLevel();
        if (sounds.shanty_3.paused) {
            sounds.shanty_3.playy();
        }
    }
    computeMain() {
        this.hasLoad = (canStorage && map.currentLevel !== 0 && map.currentLevel !== 17 && !(meta.onBertha && map.currentLevel == 8 && meta.necroDefeated));
        if (meta.gaveGrog && !meta.gotAllPapers) {
            this.newGame = this.newGame2;
        } else {
            this.newGame = this.newGame1;
        }
        if (pointSquareCol(cursor.mapPos, this.newGame)) {
            this.newGame.action = 1;
        } else {
            this.newGame.action = 0;
        }
        if (pointSquareCol(cursor.mapPos, this.options)) {
            this.options.action = 1;
        } else {
            this.options.action = 0;
        }
        if (meta.gotAllPapers && pointSquareCol(cursor.mapPos, this.gallionBertha)) {
            this.gallionBertha.action = 2;
        } else if (meta.gotAllPapers) {
            this.gallionBertha.action = 1;
        }

        if (this.hasLoad && pointSquareCol(cursor.mapPos, this.continue)) {
            this.continue.action = 2;
        } else if (this.hasLoad) {
            this.continue.action = 1;
        } else {
            this.continue.action = 0;
        }
        if (this.clickedContinue) {
            this.blackBomb.compute();
        } else if (this.clickedGallionBertha) {
            this.blackBomb.compute();
        } else if (this.clickedNewGame) {
            this.pinkBomb.compute();
        } else if (this.clickedOptions) {
            this.pinkBomb.compute();
        }
    }
    computeOptions() {
        this.masterSlider.compute();
        this.sfxSlider.compute();
        this.musicSlider.compute();
        this.ratioSelector.compute();
        this.deleteProgress.compute();
        this.credits.compute();
        if (pointSquareCol(cursor.mapPos, this.back)) {
            this.back.action = 1;
        } else {
            this.back.action = 0;
        }
    }
    compute() {
        if (this.optionsDisplay) {
            this.computeOptions();
        } else {
            this.computeMain();
        }
        this.twitterHandle1.compute();
        this.twitterHandle2.compute();
    }
    renderOptions() {
        this.masterSlider.render();
        this.sfxSlider.render();
        this.musicSlider.render();
        this.ratioSelector.render();
        this.deleteProgress.render();
        this.credits.render();

        // Draw back button
        c.drawImage(
            this.sheet,
            this.back.actionX[this.back.action] * meta.tilesize,
            this.back.actionY[this.back.action] * meta.tilesize,
            this.back.w * meta.tilesize,
            this.back.h * meta.tilesize,
            this.back.x * meta.tilesize * meta.ratio,
            this.back.y * meta.tilesize * meta.ratio,
            this.back.w * meta.tilesize * meta.ratio,
            this.back.h * meta.tilesize * meta.ratio
        )
    }
    render() {
        c.drawImage(
            this.bg,
            0,
            0,
            canvas.width,
            canvas.height);

        if (this.optionsDisplay) {
            this.renderOptions();
        } else {
            this.renderMain();
        }
        this.twitterHandle1.render();
        this.twitterHandle2.render();
    }
    renderMain() {
        // Draw New Game option
        c.drawImage(
            this.sheet,
            0,
            this.newGame.actionY[this.newGame.action] * meta.tilesize,
            this.newGame.w * meta.tilesize,
            this.newGame.h * meta.tilesize,
            this.newGame.x * meta.tilesize * meta.ratio,
            this.newGame.y * meta.tilesize * meta.ratio,
            this.newGame.w * meta.tilesize * meta.ratio,
            this.newGame.h * meta.tilesize * meta.ratio
        )

        // Draw options option
        c.drawImage(
            this.sheet,
            0,
            this.options.actionY[this.options.action] * meta.tilesize,
            this.options.w * meta.tilesize,
            this.options.h * meta.tilesize,
            this.options.x * meta.tilesize * meta.ratio,
            this.options.y * meta.tilesize * meta.ratio,
            this.options.w * meta.tilesize * meta.ratio,
            this.options.h * meta.tilesize * meta.ratio
        )

        // Draw continue option
        c.drawImage(
            this.sheet,
            0,
            this.continue.actionY[this.continue.action] * meta.tilesize,
            this.continue.w * meta.tilesize,
            this.continue.h * meta.tilesize,
            this.continue.x * meta.tilesize * meta.ratio,
            this.continue.y * meta.tilesize * meta.ratio,
            this.continue.w * meta.tilesize * meta.ratio,
            this.continue.h * meta.tilesize * meta.ratio
        )

        // Draw Gallion Bertha option
        c.drawImage(
            this.sheet,
            0,
            this.gallionBertha.actionY[this.gallionBertha.action] * meta.tilesize,
            this.gallionBertha.w * meta.tilesize,
            this.gallionBertha.h * meta.tilesize,
            this.gallionBertha.x * meta.tilesize * meta.ratio,
            this.gallionBertha.y * meta.tilesize * meta.ratio,
            this.gallionBertha.w * meta.tilesize * meta.ratio,
            this.gallionBertha.h * meta.tilesize * meta.ratio
        )
        //skeleton left
        c.drawImage(
            this.sheet,
            5 * meta.tilesize,
            23 * meta.tilesize + 4 * (this.clickedOptions || this.clickedNewGame) * meta.tilesize,
            4 * meta.tilesize,
            4 * meta.tilesize,
            12 * meta.tilesize * meta.ratio,
            0 * meta.tilesize * meta.ratio,
            4 * meta.tilesize * meta.ratio,
            4 * meta.tilesize * meta.ratio
        )
        //skeleton right
        c.drawImage(
            this.sheet,
            8 * meta.tilesize,
            23 * meta.tilesize + 4 * (this.clickedContinue || this.clickedGallionBertha) * meta.tilesize,
            4 * meta.tilesize,
            4 * meta.tilesize,
            15 * meta.tilesize * meta.ratio,
            0 * meta.tilesize * meta.ratio,
            4 * meta.tilesize * meta.ratio,
            4 * meta.tilesize * meta.ratio
        )

        if (this.clickedContinue || this.clickedGallionBertha) {
            this.blackBomb.render();
        } else if (this.clickedNewGame || this.clickedOptions) {
            this.pinkBomb.render();
        }
    }
}
class TwitterHandle {
    constructor(x, y, which) {
        this.sheet = id("sheet");
        this.x = x;
        this.y = y;
        this.w = 4;
        this.h = 1;
        this.action = 0;
        this.actionX = 7;
        this.actionY = which ? [43, 44] : [45, 46];
        this.link = which ? "https://twitter.com/saantonandre" : "https://gamemakertim.com/";
    }
    compute() {
        if (pointSquareCol(cursor.mapPos, this)) {
            this.action = 1;
            if (controls.lClickDown) {
                controls.lClickDown = false;
                window.open(this.link, "_blank");
            }
        } else {
            this.action = 0;
        }
    }
    render() {
        c.drawImage(
            this.sheet,
            this.actionX * meta.tilesize,
            this.actionY[this.action] * meta.tilesize,
            this.w * meta.tilesize,
            this.h * meta.tilesize,
            this.x * meta.tilesize * meta.ratio,
            this.y * meta.tilesize * meta.ratio,
            this.w * meta.tilesize * meta.ratio,
            this.h * meta.tilesize * meta.ratio)
    }
}
class MenuCredits {
    constructor(x, y) {
        this.sheet = id("sheet");
        this.x = x;
        this.y = y;
        this.w = 4;
        this.h = 1;
        this.action = 0;
        this.actionX = 9;
        this.actionY = [38, 39];
    }
    compute() {
        if (pointSquareCol(cursor.mapPos, this)) {
            this.action = 1;
            if (controls.lClickDown) {

            }
        } else {
            this.action = 0;
        }
    }
    render() {
        c.drawImage(
            this.sheet,
            this.actionX * meta.tilesize,
            this.actionY[this.action] * meta.tilesize,
            this.w * meta.tilesize,
            this.h * meta.tilesize,
            this.x * meta.tilesize * meta.ratio,
            this.y * meta.tilesize * meta.ratio,
            this.w * meta.tilesize * meta.ratio,
            this.h * meta.tilesize * meta.ratio)
    }
}
class MenuDeleteProgress {
    constructor(x, y) {
        this.sheet = id("sheet");
        this.x = x;
        this.y = y;
        this.w = 9;
        this.h = 1;
        this.action = 0;
        this.actionX = 5;
        this.actionY = [40, 41];
    }
    compute() {
        if (pointSquareCol(cursor.mapPos, this)) {
            this.action = 1;
            if (controls.lClickDown) {
                controls.lClickDown = false;
                if (confirm("Are you sure?\nClicking 'Ok' will delete any record/grog bottle/map scraps you may have.")) {
                    controls.lClickDown = false;
                    localStorage.removeItem('saveCode');
                    location.reload();

                }
            }
        } else {
            this.action = 0;
        }
    }
    render() {
        c.drawImage(
            this.sheet,
            this.actionX * meta.tilesize,
            this.actionY[this.action] * meta.tilesize,
            this.w * meta.tilesize,
            this.h * meta.tilesize,
            this.x * meta.tilesize * meta.ratio,
            this.y * meta.tilesize * meta.ratio,
            this.w * meta.tilesize * meta.ratio,
            this.h * meta.tilesize * meta.ratio)
    }
}
class MenuRatioSelector {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.sheet = id("sheet");
        this.text = {
            x: x,
            y: y,
            w: 6,
            h: 1,
            actionX: 3,
            actionY: 37
        }
        this.multipliers = [{
            x: x + 7,
            y: y,
            w: 1,
            h: 1
        }, {
            x: x + 7 + 1,
            y: y,
            w: 1,
            h: 1
        }, {
            x: x + 7 + 2,
            y: y,
            w: 1,
            h: 1
        }, {
            x: x + 7 + 3,
            y: y,
            w: 1,
            h: 1
        }, {
            x: x + 7 + 4,
            y: y,
            w: 1,
            h: 1
        }, {
            x: x + 7 + 5,
            y: y,
            w: 1,
            h: 1
        }, ]
        this.mActionX = [3, 4, 5, 6, 7, 8];
        this.mActionY = [38, 39];
    }
    compute() {
        for (let i = 0; i < this.multipliers.length; i++) {
            if (controls.lClickDown && pointSquareCol(cursor.mapPos, this.multipliers[i])) {
                debug.log("collided")
                if (meta.ratio !== i + 1) {
                    meta.ratio = i + 1;
                    resizeCanvas();
                }

            }
        }
    }
    render() {
        let active = 0;
        c.drawImage(
            this.sheet,
            this.text.actionX * meta.tilesize,
            this.text.actionY * meta.tilesize,
            this.text.w * meta.tilesize,
            this.text.h * meta.tilesize,
            this.text.x * meta.tilesize * meta.ratio,
            this.text.y * meta.tilesize * meta.ratio,
            this.text.w * meta.tilesize * meta.ratio,
            this.text.h * meta.tilesize * meta.ratio,
        )
        for (let i = 0; i < this.multipliers.length; i++) {
            if (i + 1 == meta.ratio) {
                active = 1;
            } else {
                active = 0;
            }
            c.drawImage(
                this.sheet,
                this.mActionX[i] * meta.tilesize,
                this.mActionY[active] * meta.tilesize,
                this.multipliers[i].w * meta.tilesize,
                this.multipliers[i].h * meta.tilesize,
                this.multipliers[i].x * meta.tilesize * meta.ratio,
                this.multipliers[i].y * meta.tilesize * meta.ratio,
                this.multipliers[i].w * meta.tilesize * meta.ratio,
                this.multipliers[i].h * meta.tilesize * meta.ratio,
            )
        }
    }
}
class MenuSlider {
    constructor(x, y, which) {
        this.x = x;
        this.y = y;
        this.which = which;
        this.sheet = id("sheet");
        this.point = {
            x: 0,
            y: 0,
            w: 1,
            h: 1,
            action: 0,
            actionX: [0, 1],
            actionY: [40, 40],
        }
        this.slider = {
            x: 0,
            y: 0,
            w: 5,
            h: 1,
            action: 0,
            actionX: [0],
            actionY: [41],
        }
        this.text = {
            x: 0,
            y: 0,
            w: 3,
            h: 1,
            actionX: [0, 0, 0],
            actionY: [37, 38, 39],
        }
        this.text.x = x;
        this.text.y = y;

        this.slider.x = x + 4;
        this.slider.y = y;

        switch (this.which) {
            case 0:
                this.point.x = this.slider.x + this.slider.w * meta.volume;
                break;
            case 1:
                this.point.x = this.slider.x + this.slider.w * meta.musicVolume;
                break;
            case 2:
                this.point.x = this.slider.x + this.slider.w * meta.sfxsVolume;
                break;
        }
        this.point.y = y;
        /*
        meta.volume = 0.6;
        meta.musicVolume = 0.5;
        meta.sfxsVolume = 0.5;
        */
        this.amount = (this.point.x - this.slider.x) / this.slider.w;
    }
    compute() {
        if (controls.lClickDown) {
            if (pointSquareCol(cursor.mapPos, this.slider)) {
                this.point.x = cursor.mapPos.x;
                this.amount = (this.point.x - this.slider.x) / this.slider.w;
                switch (this.which) {
                    case 0:
                        meta.volume = this.amount;
                        sounds.explosion2.changeVolume()
                        sounds.shanty_1.changeVolume()
                        if (sounds.explosion2.paused) {
                            sounds.explosion2.playy()
                        }
                        if (sounds.shanty_1.paused) {
                            sounds.shanty_1.playy()
                        }
                        break;
                    case 1:
                        sounds.shanty_1.changeVolume()
                        meta.musicVolume = this.amount;
                        if (sounds.shanty_1.paused) {
                            sounds.shanty_1.playy()
                        }
                        break;
                    case 2:
                        sounds.explosion2.changeVolume()
                        meta.sfxsVolume = this.amount;
                        if (sounds.explosion2.paused) {
                            sounds.explosion2.playy()
                        }
                        break;
                }

            }
        } else {
            switch (this.which) {
                case 0:
                    if (!sounds.explosion2.paused) {
                        sounds.explosion2.pause()
                    }
                    if (!sounds.shanty_1.paused) {
                        sounds.shanty_1.pause()
                    }
                    break;
                case 1:
                    if (!sounds.shanty_1.paused) {
                        sounds.shanty_1.pause()
                    }
                    break;
                case 2:
                    if (!sounds.explosion2.paused) {
                        sounds.explosion2.pause()
                    }
                    break;
            }
        }
        if (this.amount < 0.05) {
            this.amount = 0;
            this.point.x = this.slider.x;
            this.point.action = 0;
        } else {
            this.point.action = 1;
        }
    }
    render() {
        //text
        c.drawImage(
            this.sheet,
            this.text.actionX[this.which] * meta.tilesize,
            this.text.actionY[this.which] * meta.tilesize,
            this.text.w * meta.tilesize,
            this.text.h * meta.tilesize,
            this.text.x * meta.tilesize * meta.ratio,
            this.text.y * meta.tilesize * meta.ratio,
            this.text.w * meta.tilesize * meta.ratio,
            this.text.h * meta.tilesize * meta.ratio,
        )
        //slider back
        c.drawImage(
            this.sheet,
            this.slider.actionX[this.slider.action] * meta.tilesize,
            this.slider.actionY[this.slider.action] * meta.tilesize,
            this.slider.w * meta.tilesize,
            this.slider.h * meta.tilesize,
            this.slider.x * meta.tilesize * meta.ratio,
            this.slider.y * meta.tilesize * meta.ratio,
            this.slider.w * meta.tilesize * meta.ratio,
            this.slider.h * meta.tilesize * meta.ratio,
        )
        //slider point
        c.drawImage(
            this.sheet,
            this.point.actionX[this.point.action] * meta.tilesize,
            this.point.actionY[this.point.action] * meta.tilesize,
            this.point.w * meta.tilesize,
            this.point.h * meta.tilesize,
            (this.point.x - 0.5) * meta.tilesize * meta.ratio,
            this.point.y * meta.tilesize * meta.ratio,
            this.point.w * meta.tilesize * meta.ratio,
            this.point.h * meta.tilesize * meta.ratio,
        )

    }
}
class MenuBomb {
    constructor(which) {
        {
            this.sheet = id("sheet");
            this.which = which;
            this.reset();
        }

    }
    reset() {
        this.action = 0;
        this.actionX = [[5, 5, 5], [7, 7, 7]];
        this.actionY = [[31, 33, 35], [31, 33, 35]];
        this.x = this.which ? 17 : 12;
        this.y = 2;
        this.w = 2;
        this.h = 2;
        this.xVel = 0;
        this.yVel = -0.15;
        this.gForce = 0.01;
        // Rendering Variables 
        this.frame = 0;
        this.frameCounter = 0;
        this.baseSlowness = 5;
        this.slowness = this.baseSlowness;
        this.action = 0;

    }
    compute() {
        this.yVel += this.gForce * meta.deltaTime;
        if (this.yVel > meta.terminalVel) {
            this.yVel = meta.terminalVel;
        }
        this.y += this.yVel * meta.deltaTime;


    }
    render() {
        //rendering
        this.slowness = this.baseSlowness / meta.deltaTime;
        this.frameCounter++;
        if (this.frameCounter >= this.slowness) {
            this.frameCounter = 0;
            this.frame++;
        }
        if (this.frame >= this.actionX[this.which].length) {
            this.frame = 0;
            this.frameCounter = 0;
        }
        c.drawImage(
            this.sheet,
            this.actionX[this.which][this.frame] * meta.tilesize,
            this.actionY[this.which][this.frame] * meta.tilesize,
            this.w * meta.tilesize,
            this.h * meta.tilesize,
            ((this.x) * meta.tilesize * meta.ratio) | 0,
            ((this.y) * meta.tilesize * meta.ratio) | 0,
            (this.w * meta.tilesize * meta.ratio) | 0,
            (this.h * meta.tilesize * meta.ratio) | 0
        )
        if (mainMenu.clickedContinue) {
            if (collided(this, mainMenu.continue)) {
                mainMenu.triggerContinue();
                sounds.explosion2.playy();
                this.reset();
            }

        } else if (mainMenu.clickedNewGame) {
            if (collided(this, mainMenu.newGame)) {
                mainMenu.triggerNewGame();
                sounds.explosion1.playy();
                this.reset();
            }
        } else if (mainMenu.clickedGallionBertha) {
            if (collided(this, mainMenu.gallionBertha)) {
                mainMenu.triggerGallionBertha();
                sounds.explosion1.playy();
                this.reset();
            }
        } else if (mainMenu.clickedOptions) {
            if (collided(this, mainMenu.options)) {
                mainMenu.triggerOptions();
                sounds.explosion1.playy();
                this.reset();
            }
        }
    }
}
class Entity {
    constructor(x, y) {
        this.initialX = x;
        this.initialY = y;
        this.resetBasicVariables(this.initialX, this.initialY);
    }
    resetBasicVariables(xx, yy) {
        this.x = xx;
        this.y = yy;
        this.w = 1;
        this.h = 1;
        this.strikeable = true;
        this.removed = false;
        this.sheet = id("sheet");
        this.hp = 1;
        this.recoilAttacker = false;
        this.type = "something";
        this.solid = false;
        //compute/render even if out of screen
        this.important = false;


        // Rendering Variables 
        this.frame = 0;
        this.frameCounter = 0;
        this.baseSlowness = 6;
        this.slowness = this.baseSlowness;

        this.action = 0;
        this.xVel = 0;
        this.yVel = 0;

        //collisions found
        this.col = {
            L: 0,
            R: 0,
            T: 0,
            B: 0
        }
    }
    onCollision() {}
    onHit() {}
    onPlayerCollision() {}
}

class Paper extends Entity {
    constructor(x, y, id) {
        super(x, y);
        this.actionX = [2, 2, 2, 2];
        this.actionY = [15, 16, 17, 18];
        this.action = 0;
        this.slowness = 6;
        this.solid = false;
        this.id = id || 0;
        if (meta.papers[this.id] || !meta.gaveGrog) {
            this.removed = true;
        }

    }
    compute() {
        if (collided(this, player)) {
            this.removed = true;
            player.currentPaper = this.id;
            sounds.getPaper.playy();
        }
    }
    render() {
        this.frameCounter++;
        if (this.frameCounter >= this.slowness / meta.deltaTime) {
            this.frameCounter = 0;
            this.frame++;
        }
        if (this.frame >= this.actionX.length) {
            this.frame = 0;
            this.frameCounter = 0;
        }

        c.drawImage(
            this.sheet,
            this.actionX[this.frame] * meta.tilesize,
            this.actionY[this.frame] * meta.tilesize,
            this.w * meta.tilesize,
            this.h * meta.tilesize,
            (this.x + map.x) * meta.tilesize * meta.ratio | 0,
            (this.y + map.y) * meta.tilesize * meta.ratio | 0,
            this.w * meta.tilesize * meta.ratio,
            this.h * meta.tilesize * meta.ratio,
        )
    }
}

class Spike extends Entity {
    constructor(x, y) {
        super(x, y);
        this.solid = false;
        this.hitbox = {
            x: this.x + 0.35,
            y: this.y + 0.35,
            w: 0.3,
            h: 0.3
        }
        this.actionX = 2;
        this.actionY = 14;
    }
    compute() {
        if (player.removed) {
            return;
        }
        if (collided(this, player)) {
            player.die("Spike");
        }
    }
    render() {
        c.drawImage(
            this.sheet,
            this.actionX * meta.tilesize,
            this.actionY * meta.tilesize,
            this.w * meta.tilesize,
            this.h * meta.tilesize,
            (this.x + map.x) * meta.tilesize * meta.ratio | 0,
            (this.y + map.y) * meta.tilesize * meta.ratio | 0,
            this.w * meta.tilesize * meta.ratio | 0,
            this.h * meta.tilesize * meta.ratio | 0
        )
    }
}
class HeavySpike extends Entity {
    constructor(x, y) {
        super(x, y);
        this.solid = true;
        this.gForce = 0.012;
        this.type = "HeavySpike";
        this.actionX = 3;
        this.actionY = 14;
        this.damageHitbox = {
            x: 0,
            y: 0,
            w: 1,
            h: 1
        };
        this.damageHitbox.x = this.x + 0.15;
        this.damageHitbox.y = this.y + 0.15;
        this.damageHitbox.w = 0.7;
        this.damageHitbox.h = 0.7;
    }
    compute() {
        map.checkCollisions(this, false, true);
        if (!this.grounded) {
            this.yVel += this.gForce * meta.deltaTime;
        } else {
            this.yVel = 0;
        }
        if (this.yVel > meta.terminalVel * 0.8) {
            this.yVel = meta.terminalVel * 0.8;
        }

        this.y += this.yVel * meta.deltaTime;
        this.x += this.xVel * meta.deltaTime;
        if (player.removed) {
            return;
        }
        this.damageHitbox.x = this.x + 0.1;
        this.damageHitbox.y = this.y + 0.1;
        if (collided(this.damageHitbox, player)) {
            player.die("Heavy spike");
        }
    }
    render() {
        /*
        c.fillStyle = "purple";
        c.fillRect(
            (this.x + map.x) * meta.tilesize * meta.ratio,
            (this.y + map.y) * meta.tilesize * meta.ratio,
            this.w * meta.tilesize * meta.ratio,
            this.h * meta.tilesize * meta.ratio)
            //*/

        c.drawImage(
            this.sheet,
            this.actionX * meta.tilesize,
            this.actionY * meta.tilesize,
            this.w * meta.tilesize,
            this.h * meta.tilesize,
            (this.x + map.x) * meta.tilesize * meta.ratio | 0,
            (this.y + map.y) * meta.tilesize * meta.ratio | 0,
            this.w * meta.tilesize * meta.ratio | 0,
            this.h * meta.tilesize * meta.ratio | 0
        )
    }
}

//Text that appears on lv 1, gets removed if you press the T key
class Instructions {
    constructor() {
        this.image = [id("instructions-0"), id("instructions-1"), id("instructions-2")];
        this.which = 0;
        this.display = false;
        this.inputT = false;
    }
    compute() {
        if (controls.t && !this.inputT) {
            this.inputT = true;
            if (this.display) {
                this.which++;
                if (this.which > 2) {
                    this.display = false;
                    sounds.notes1.playy();
                }
                sounds.notes2.playy();
            } else {
                this.display = true;
                this.which = 0;
                sounds.notes2.playy();
            }
        } else if (!controls.t && this.inputT) {
            this.inputT = false;
        }
    }
    render() {
        if (!this.display) {
            return;
        }
        c.drawImage(
            this.image[this.which],
            (canvas.width - this.image[this.which].width * meta.ratio) / 2,
            (canvas.height - this.image[this.which].height * meta.ratio) / 2,
            this.image[this.which].width * meta.ratio,
            this.image[this.which].height * meta.ratio,
        )
    }
}
class CallToAction {
    constructor(text) {
        this.x = 0;
        this.y = 18;
        this.solid = false;
        this.fontSize = 18;
        this.text = text;
        this.removed = false;
        this.duration = 180;
        this.opacity = 1;
        if (map.currentLevel == 9) {
            player.spyglassNotice ? this.duration = 0 : player.spyglassNotice = true;
        }
        if (map.currentLevel == 0) {
            this.duration = 270;
        }
    }
    compute() {
        if (map.currentLevel !== 17 && !(meta.onBertha && map.currentLevel===8)) {
            this.duration -= meta.deltaTime;
            this.opacity = Math.sin(this.duration / 30);
        }
        if (this.opacity < 0) {
            this.opacity *= -1;
        }
        if (this.duration <= 0) {
            this.removed = true;
        }
    }
    render() {
        // Draws the text
        c.textAlign = "left";
        c.font = this.fontSize * meta.ratio + "px" + " 'VT323'";
        c.fillStyle = "#f9f5ef";

        this.x = (canvas.width - c.measureText(this.text).width) / 2;
        c.globalAlpha = this.opacity;
        c.fillText(
            this.text,
            (this.x),
            (this.y * meta.tilesize * meta.ratio) + (this.fontSize * meta.ratio)
        )
        c.globalAlpha = 1;
    }
}

class Portal {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.w = 1;
        this.h = 1;
        this.sheet = id("sheet");
        this.actionX = 0;
        this.actionY = 8;
    }
    compute() {
        if (collided(this, player)) {
            map.currentLevel++;
            captureCall = true;
            meta.loopType = 1;
            //loadLevel();
            loadCall = true;
            if (player.currentPaper !== "none") {
                meta.papers[player.currentPaper] = 1;
                player.currentPaper = "none";
            }
            sounds.transition.playy();
        }
    }
    render() {
        c.drawImage(
            this.sheet,
            this.actionX * meta.tilesize,
            this.actionY * meta.tilesize,
            this.w * meta.tilesize,
            this.h * meta.tilesize,
            (this.x + map.x) * meta.tilesize * meta.ratio | 0,
            (this.y + map.y) * meta.tilesize * meta.ratio | 0,
            this.w * meta.tilesize * meta.ratio | 0,
            this.h * meta.tilesize * meta.ratio | 0
        )
    }
}
class Destructible extends Entity {
    constructor(x, y, w, h) {
        super(x, y);
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.sheet = id("sheet");
        this.solid = true;
        this.destructible = true;
        this.horizontal = (this.w > this.h) ? true : false;
        if (this.horizontal) {
            this.actionX = [12, 13, 14];
            this.actionY = [12, 12, 12];
        } else {
            this.actionX = [11, 11, 11];
            this.actionY = [12, 13, 14];
        }
    }
    explode() {
        if (this.horizontal) {
            for (let i = 0; i < this.w; i++) {
                map.vfxs.push(new Vfx(i + this.x + 1 / 2, this.y + 1 / 2, 5, true));
                map.vfxs.push(new Vfx(i + this.x + 1 / 2, this.y + 1 / 2, 6, true));
                map.vfxs.push(new Vfx(i + this.x + 1 / 2, this.y + 1 / 2, 7, true));
                map.vfxs.push(new Vfx(i + this.x + 1 / 2, this.y + 1 / 2, 8, true));
            }
        } else {
            for (let i = 0; i < this.h; i++) {
                map.vfxs.push(new Vfx(this.x + 1 / 2, i + this.y + 1 / 2, 5, true));
                map.vfxs.push(new Vfx(this.x + 1 / 2, i + this.y + 1 / 2, 6, true));
                map.vfxs.push(new Vfx(this.x + 1 / 2, i + this.y + 1 / 2, 7, true));
                map.vfxs.push(new Vfx(this.x + 1 / 2, i + this.y + 1 / 2, 8, true));
            }
        }
        sounds.broke.playy();
        screenShake.duration = 30;
        this.removed = true;
    }
    compute() {

    }
    render() {
        let tile = 0;
        if (this.horizontal) {
            for (let i = 0; i < this.w; i++) {
                if (i == 0) {
                    tile = 0;
                } else if (i == this.w - 1) {
                    tile = 2;
                } else {
                    tile = 1;
                }
                c.drawImage(
                    this.sheet,
                    this.actionX[tile] * meta.tilesize,
                    this.actionY[tile] * meta.tilesize,
                    1 * meta.tilesize,
                    1 * meta.tilesize,
                    (this.x + i + map.x) * meta.tilesize * meta.ratio | 0,
                    (this.y + map.y) * meta.tilesize * meta.ratio | 0,
                    1 * meta.tilesize * meta.ratio,
                    1 * meta.tilesize * meta.ratio,
                )
            }
        } else {
            for (let i = 0; i < this.h; i++) {
                if (i == 0) {
                    tile = 0;
                } else if (i == this.h - 1) {
                    tile = 2;
                } else {
                    tile = 1;
                }
                c.drawImage(
                    this.sheet,
                    this.actionX[tile] * meta.tilesize,
                    this.actionY[tile] * meta.tilesize,
                    1 * meta.tilesize,
                    1 * meta.tilesize,
                    (this.x + map.x) * meta.tilesize * meta.ratio | 0,
                    (this.y + i + map.y) * meta.tilesize * meta.ratio | 0,
                    1 * meta.tilesize * meta.ratio,
                    1 * meta.tilesize * meta.ratio,
                )
            }
        }
    }
}

class Barrel extends Entity {
    constructor(x, y) {
        super(x, y);
        this.x = x;
        this.y = y;
        this.w = 1;
        this.h = 1;
        this.sheet = id("sheet");
        this.solid = true;
        this.type = "barrel";
        this.destructible = true;
        this.actionX = [1];
        this.actionY = [14];
        this.action = 0;
        this.gForce = 0.01;
    }
    explode() {
        meta.barrelsDestroyed++;
        map.vfxs.push(new Vfx(this.x, this.y, 10, false));
        map.vfxs.push(new Vfx(this.x, this.y, 10, false));
        map.vfxs.push(new Vfx(this.x, this.y, 11, false));
        map.vfxs.push(new Vfx(this.x, this.y, 11, false));
        map.vfxs.push(new Vfx(this.x, this.y, 12, false));
        map.vfxs.push(new Vfx(this.x, this.y, 13, false));
        map.vfxs.push(new Vfx(this.x, this.y, 13, false));
        map.vfxs.push(new Vfx(this.x, this.y, 13, false));
        this.removed = true;
    }
    compute() {
        map.checkCollisions(this, false, true);
        if (!this.grounded) {
            this.yVel += this.gForce * meta.deltaTime;
        } else {
            this.yVel = 0;
        }
        if (this.yVel > meta.terminalVel) {
            this.yVel = meta.terminalVel;
        }

        this.y += this.yVel * meta.deltaTime;
        this.x += this.xVel * meta.deltaTime;

    }
    render() {
        c.drawImage(
            this.sheet,
            this.actionX[this.action] * meta.tilesize,
            this.actionY[this.action] * meta.tilesize,
            this.w * meta.tilesize,
            this.h * meta.tilesize,
            (this.x + map.x) * meta.tilesize * meta.ratio | 0,
            (this.y + map.y) * meta.tilesize * meta.ratio | 0,
            this.w * meta.tilesize * meta.ratio,
            this.h * meta.tilesize * meta.ratio,
        )
    }
}
class ExplosiveBarrel extends Barrel {
    constructor(x, y) {
        super(x, y);
        this.actionX = [6];
        this.actionY = [14];
        this.destructible = true;
    }
    compute() {

    }
    explode() {
        map.vfxs.push(new Vfx(this.x, this.y, 10, false));
        map.vfxs.push(new Vfx(this.x, this.y, 12, false));
        map.vfxs.push(new Vfx(this.x, this.y, 13, false));
        this.removed = true;
        map.vfxs.push(new BarrelExplosion(this.x, this.y));
        sounds.explosion3.playy();
    }
}
class GrogBarrel extends Barrel {
    constructor(x, y) {
        super(x, y);
        this.actionX = [0];
        this.actionY = [15];
        this.gForce = 0.015;
    }
    explode() {
        meta.barrelsDestroyed++;
        map.vfxs.push(new Vfx(this.x, this.y, 10, false));
        map.vfxs.push(new Vfx(this.x, this.y, 10, false));
        map.vfxs.push(new Vfx(this.x, this.y, 11, false));
        map.vfxs.push(new Vfx(this.x, this.y, 11, false));
        map.vfxs.push(new Vfx(this.x, this.y, 12, false));
        map.vfxs.push(new Vfx(this.x, this.y, 13, false));
        map.vfxs.push(new Vfx(this.x, this.y, 13, false));
        map.vfxs.push(new Vfx(this.x, this.y, 13, false));
        this.removed = true;
        if (!meta.gaveGrog && !player.hasGrog) {
            let grog = new Grog(this.x + this.w / 2, this.y + this.h / 2);
            grog.yVel = -0.3;
            grog.xVel = -0.06;
            map.entities.push(grog);
            sounds.grog.playy();
        }
    }
}
class Grog extends Barrel {
    constructor(x, y) {
        super(x, y);
        this.x -= this.w / 2;
        this.y -= this.h / 2;
        this.friction = 0.98;
        this.actionX = [1];
        this.actionY = [15];
        this.destructible = false;
        this.solid = false;
        this.lastFrameGrounded = false;
        this.point = {
            x: this.x + this.w / 2,
            y: this.y + this.h / 2
        }
    }
    compute() {
        map.checkCollisions(this);
        if (!this.grounded) {
            this.yVel += this.gForce * meta.deltaTime;
        } else {
            this.yVel = 0;
        }
        if (this.yVel > meta.terminalVel) {
            this.yVel = meta.terminalVel;
        }
        if (Math.abs(this.xVel) > 0.01) {
            if (this.col.L || this.col.R) {
                this.xVel *= -1;
            }
            this.xVel *= Math.pow(this.friction, meta.deltaTime);
        } else {
            this.xVel = 0;
        }
        if (this.grounded) {
            this.xVel *= Math.pow(this.friction, meta.deltaTime);
            if (!this.lastFrameGrounded) {
                this.lastFrameGrounded = true;
                sounds.grog.playy();
            }
        }
        this.y += this.yVel * meta.deltaTime;
        this.x += this.xVel * meta.deltaTime;
        this.point.x = this.x + this.w / 2;
        this.point.y = this.y + this.h / 2;
        if (pointSquareCol(this.point, player)) {
            this.removed = true;
            player.hasGrog = true;
            sounds.getItem.playy();
            achievements.unlock("Mysterious Bottle");
        }
    }
}
/*test
document.oncontextmenu = function () {
    map.foreground.push(new GallionBerthaUnlocked());
}
//*/
class GallionBerthaUnlocked extends Entity {
    constructor() {
        super(0, 0);
        this.sheet = id("notification");
        this.actionX = [[0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0]];
        this.actionY = [[0, 1, 2, 3, 4, 5, 6, 7, 8], [9, 10, 11, 12], [8, 7, 6, 5, 4, 3, 2, 1, 0]];
        this.action = 0;
        this.w = 16;
        this.h = 3;
        this.x = (meta.tilesWidth - this.w) / 2;
        this.y = 1;
        this.important = true;
        this.removed = false;
        this.loops = 4;
        sounds.notes1.playy();
    }
    compute() {

    }
    onActionEnded(action) {
        switch (action) {
            case 0:
                this.action = 1;
                break;
            case 1:
                if (this.loops > 0) {
                    this.loops--;
                } else {
                    this.action = 2;
                    sounds.notes2.playy();
                }
                break;
            case 2:
                this.removed = true;
                break;
        }
    }
    render() {
        //console.log("rendering")
        this.frameCounter++;
        if (this.frameCounter >= this.slowness / meta.deltaTime) {
            this.frameCounter = 0;
            this.frame++;
        }
        if (this.frame >= this.actionX[this.action].length) {
            this.frame = 0;
            this.frameCounter = 0;
            this.onActionEnded(this.action);
        }
        if (this.removed) {
            return;
        }
        c.drawImage(
            this.sheet,
            this.actionX[this.action][this.frame] * meta.tilesize,
            this.actionY[this.action][this.frame] * 48,
            this.w * meta.tilesize,
            this.h * meta.tilesize,
            (this.x * meta.tilesize * meta.ratio) | 0,
            (this.y * meta.tilesize * meta.ratio) | 0,
            (this.w * meta.tilesize * meta.ratio) | 0,
            (this.h * meta.tilesize * meta.ratio) | 0
        )
    }
}
class Necromancer extends Entity {
    constructor(x, y) {
        super(x, y);

        this.x = x;
        this.y = y;
        this.w = 2;
        this.h = 2;
        this.action = 0;
        this.slowness = 8;
        this.speed = 0.1;
        this.important = true;
        this.xVel = 0;
        this.yVel = 0;
        this.left = 0;
        this.gForce = 0.01;
        this.hits = 0;
        //0 - normal L
        //2 - floating L
        //4 - damaged L
        //6 - dying L
        //8 - transform L
        //10 - attack L
        //12 - transform back L
        this.actionX = [[33], [35], [37, 37, 37, 37], [37, 37, 37, 37], [33, 33, 33], [35, 35, 35], [33, 33], [35, 35], [39, 39, 39, 39], [41, 41, 41, 41], [39, 39, 39], [41, 41, 41], [39, 39, 39, 39], [41, 41, 41, 41]];

        this.actionY = [[12], [12], [12, 14, 16, 18], [12, 14, 16, 18], [14, 16, 18], [14, 16, 18], [20, 22], [20, 22], [12, 14, 16, 18], [12, 14, 16, 18], [20, 22, 24], [20, 22, 24], [18, 16, 14, 12], [18, 16, 14, 12]];
        this.aggro = false;
        this.grounded = false;
        this.solid = false;
        this.dying = false;
        this.hitbox = {
            x: this.x + 0.5,
            y: this.y + 0.2,
            w: this.w - 1,
            h: this.h - 0.2
        }
        this.patternX = [0, -4, 17, 5, -18, 17];
        this.patternY = [-11, -16, -1, -12, -1, -1];

        //6 - 24  42 - 24
        this.pattern = 5;
        this.voice = sounds.necromancer;
        this.attackable = true;
        this.transform = false;
        this.cooldown = 60;
        this.ability_1 = 0;
        this.movementComplete = false;

        this.point = {
            x: this.x,
            y: this.y
        }
        if (meta.necroDefeated) {
            this.removed = true;
            return;
        }
        if (!sounds.shanty_3.paused) {
            sounds.shanty_3.pause();
        }

        this.lines = ["So you're here, my spawn.",
                      "Your purpose was simple. Yet you could not follow my instructions.",
                      "Humpf. Legendary pirate? You must have been famous for your stupidity.",
                      "You would have slept the eternity in your grave if it wasn't for me.",
                      "You are about to commit a big mistake, pirate.",
                      "Your bombs are no match to my power. Bow to me!",
                      "...my stupid minions... how dare they mutiny my ship!",
                      "Mad John, I thought you could be of any help. You were my last resource."
                     ];
        dialogueEngine.loadDialogueQueue([{
            speaker: this,
            text: this.lines[(Math.random() * this.lines.length) | 0]
        }]);
    }
    computeAi() {
        // Margin for the target point
        let margin = this.speed * 2;
        // Face direction of the player
        player.x < this.x ? this.left = 1 : this.left = 0;

        // Move to the pattern target location
        if (this.aggro && (this.action == 0 || this.action == 2)) {
            let reachedX = false;
            if (this.x > this.initialX + this.patternX[this.pattern] + margin) {
                this.xVel = -this.speed * 2;
            } else if (this.x < this.initialX + this.patternX[this.pattern] - margin) {
                this.xVel = +this.speed * 2;
            } else {
                this.xVel = 0;
                reachedX = true;
            }
            if (this.y > this.initialY + this.patternY[this.pattern]) {
                this.yVel = -this.speed;
            } else {
                if (reachedX) {
                    this.onPointB = true;
                    this.xVel = 0;
                }
                //console.log("reached target point")
            }
        }

        // What happens when it reach target location
        if (this.onPointB) {
            if (!this.transform) {
                this.action = 2;
                if (this.pattern == 2 || this.pattern == 4 || this.pattern == 5) {
                    this.transform = true;
                    this.action = 8;
                    sounds.transformIn.playy();
                }
            }
        }
        //if the transformation is complete
        if (this.action == 10) {
            if (sounds.transformAttack.paused) {
                sounds.transformAttack.playy();
            }
            if (this.pattern == 4) {
                this.left = false;
                this.xVel = this.speed * 3;
                this.point.x = this.x + this.w;
            }
            if (this.pattern == 2 || this.pattern == 5) {
                this.left = true;
                this.xVel = -this.speed * 3;
                this.point.y = this.y + this.h / 2;
                this.point.x = this.x;
            }
            for (let i = 0; i < map.tiles.length; i++) {
                if (pointSquareCol(this.point, map.tiles[i])) {
                    if (!sounds.transformAttack.paused) {
                        sounds.transformAttack.pause();
                    }
                    this.action = 12;
                    screenShake.duration = 30;
                    sounds.transformWall.playy();
                    sounds.transformOut.playy();
                    this.xVel = 0;
                    break;
                }
            }
        }
        // Spawns skulls if action == 2;
        if (this.action != 2) {
            return;
        }
        if (this.ability_1 <= 0) {
            this.spawnSkulls();
            this.ability_1 = this.cooldown;
        } else {
            this.ability_1 -= meta.deltaTime;
        }
    }
    spawnSkulls() {
        let skullCounter = 0;
        for (let i = 0; i < map.entities.length; i++) {
            if (!map.entities[i].removed && map.entities[i].type == "skull") {
                skullCounter++;
            }
        }
        if (skullCounter >= 8) {
            return;
        }
        sounds.skull.playy();
        let skull1 = new Skull(this.x - 1, this.y + 1);
        let skull2 = new Skull(this.x + this.w, this.y + 1);
        skull1.xVel = -0.1;
        skull1.yVel = -0.1;

        skull2.xVel = 0.1;
        skull2.yVel = -0.1;
        map.entities.push(skull1)
        map.entities.push(skull2)
    }
    compute() {
        // Here it decides what to do
        this.computeAi();
        this.checkForExplosions();

        if (this.aggro) {
            switch (this.action) {
                case 0:
                case 4:
                case 8:
                case 10:
                case 12:
                    this.attackable = false;
                    break;
                default:
                    this.attackable = true;
            }
        }

        if (!this.grounded) {
            this.yVel += this.gForce * meta.deltaTime;
        }

        this.x += this.xVel * meta.deltaTime;
        this.y += this.yVel * meta.deltaTime;

        map.checkCollisions(this);
        if (this.action == 10 && collided(this, player)) {
            player.die("Necromancer");
        }

        // Updates the collision box
        this.hitbox.x = this.x + 0.5;
        this.hitbox.y = this.y + 0.2;
    }
    //what happens on hit
    onHit() {
        dialogueEngine.active = false;
        if (this.dying) {
            map.foreground.push(new RollingCredits());
            map.foreground.push(new CallToAction("press [P] or [esc] to go back in the main menu"));
            map.entities.push(new BarrelExplosion(this.x + this.w / 2, this.y + this.h / 2))
            this.removed = true;
            achievements.unlock("How Dare You");
            meta.necroDefeated = true;
            screenShake.duration = 30;
            slowMo.duration = 60;
            return;
        }
        this.hits++;
        if (this.hits >= 6) {
            this.dying = true;
        }
        this.onPointB = false;
        this.frameCounter = 0;
        this.frame = 0;
        this.action = 4;
        if (!this.aggro) {
            this.aggro = true;
            if (sounds.shanty_3.paused) {
                sounds.shanty_3.currentTime = 0;
                sounds.shanty_3.playy();
                screenShake.duration = 30;
                slowMo.duration = 60;
            }
        }


        /* Increases the speed/fire rate
        if (this.speed < 0.5) {
            this.speed *= 1.2;
        }
        if (this.cooldown > 10) {
            //this.cooldown *= 0.8;
        }
        //*/


        // Removes the skulls from the screen
        for (let i = 0; i < map.entities.length; i++) {
            if (map.entities[i].removed) {
                continue;
            }
            if (map.entities[i].type == "skull") {
                map.entities[i].explode();
            }
        }
    }
    checkForExplosions() {
        if (!this.attackable) {
            return;
        }
        for (let i = 0; i < map.entities.length; i++) {
            if (!map.entities[i].removed && map.entities[i].type == "bomb" && map.entities[i].which && collided(this, map.entities[i])) {
                map.entities[i].explode();
                this.onHit();
            }
        }
    }
    //what happens after a certai action ends
    onActionEnded(action) {
        switch (action) {
            case 4:
                this.action = 0;
                this.pattern++;
                if (this.pattern >= this.patternX.length) {
                    this.pattern = 0;
                }
                if (this.dying) {
                    if (this.grounded) {
                        this.action = 6;
                        if (!dialogueEngine.active) {
                            dialogueEngine.loadDialogueQueue([{
                                speaker: this,
                                text: "... how ... dare ... you ..."
                        }]);
                        }
                    } else {
                        this.action = 4;
                        this.frame = this.actionX[this.action].length - 1;
                    }
                }
                break;
            case 8:
                this.action = 10;
                break;
            case 12:
                this.action = 0;
                this.transform = false;
                this.pattern++;
                if (this.pattern >= this.patternX.length) {
                    this.pattern = 0;
                }
                break;
        }
    }
    render() {
        this.frameCounter++;
        if (this.frameCounter >= this.slowness / meta.deltaTime) {
            this.frameCounter = 0;
            this.frame++;
        }
        if (this.frame >= this.actionX[this.action].length) {
            this.frame = 0;
            this.frameCounter = 0;
            this.onActionEnded(this.action);
        }
        if (!this.attackable) {
            c.globalAlpha = 0.5;
        }
        c.drawImage(
            this.sheet,
            this.actionX[this.action + this.left][this.frame] * meta.tilesize,
            this.actionY[this.action + this.left][this.frame] * meta.tilesize,
            this.w * meta.tilesize,
            this.h * meta.tilesize,
            ((this.x + map.x) * meta.tilesize * meta.ratio) | 0,
            ((this.y + map.y) * meta.tilesize * meta.ratio) | 0,
            (this.w * meta.tilesize * meta.ratio) | 0,
            (this.h * meta.tilesize * meta.ratio) | 0
        )
        c.globalAlpha = 1;
    }
}

class Skull extends Entity {
    constructor(x, y) {
        super(x, y);
        this.solid = false;
        this.actionX = [[35, 35, 35, 35, 35, 35, 35, 35], [36, 36, 36, 36, 36, 36, 36, 36]];
        this.actionY = [[25, 26, 27, 28, 29, 30, 31, 32], [25, 26, 27, 28, 29, 30, 31, 32]];
        this.left = 0;
        this.xVel = 0;
        this.yVel = 0;
        this.speed = 0.4;
        this.slowness = 4;
        this.left = 0;
        this.important = true;
        this.type = "skull";
        this.ghostly = true;
        this.movRefresh = 60;
        this.point = {
            x: 0,
            y: 0
        }
    }
    getVelocities() {
        let x = this.x + this.w / 2;
        let y = this.y + this.h / 2;
        let x2 = player.x + player.w / 2;
        let y2 = player.y + player.h / 2;
        let deltaX = x - x2;
        let deltaY = y - y2;
        let rotation = Math.atan2(deltaY, deltaX);
        this.xVel = (-Math.cos(rotation) * this.speed + this.xVel) / 2;
        this.yVel = (-Math.sin(rotation) * this.speed + this.yVel) / 2;
    }
    computeAi() {}
    explode() {
        let explosion = new BarrelExplosion(this.x, this.y);
        explosion.frame = 2;
        map.vfxs.push(explosion);
        this.removed = true;
        sounds.explosion3.playy();
    }
    compute() {
        this.movRefresh -= meta.deltaTime;
        if (this.movRefresh < 0) {
            this.movRefresh = 30;
            this.getVelocities();
            this.ghostly = false;
        }
        this.computeAi();
        if (this.x + this.w / 2 > player.x + player.w / 2) {
            this.left = 1;
        } else {
            this.left = 0;
        }
        this.x += this.xVel * meta.deltaTime;
        this.y += this.yVel * meta.deltaTime;
        this.xVel *= Math.pow(0.96, meta.deltaTime)
        this.yVel *= Math.pow(0.96, meta.deltaTime)
        this.point.x = this.x + this.w / 2;
        this.point.y = this.y + this.h / 2;

        for (let i = 0; i < map.tiles.length; i++) {
            if (pointSquareCol(this.point, map.tiles[i])) {
                this.explode();
            }
        }
        if (this.ghostly) {
            return;
        }
        if (pointSquareCol(this, player)) {
            this.explode();
        }
    }
    render() {
        this.frameCounter++;
        if (this.frameCounter >= this.slowness / meta.deltaTime) {
            this.frameCounter = 0;
            this.frame++;
        }
        if (this.frame >= this.actionX[this.action].length) {
            this.frame = 0;
            this.frameCounter = 0;
        }
        if (this.ghostly) {
            c.globalAlpha = 0.5;
        }
        c.drawImage(
            this.sheet,
            this.actionX[this.action + this.left][this.frame] * meta.tilesize,
            this.actionY[this.action + this.left][this.frame] * meta.tilesize,
            this.w * meta.tilesize,
            this.h * meta.tilesize,
            ((this.x + map.x) * meta.tilesize * meta.ratio) | 0,
            ((this.y + map.y) * meta.tilesize * meta.ratio) | 0,
            (this.w * meta.tilesize * meta.ratio) | 0,
            (this.h * meta.tilesize * meta.ratio) | 0
        )
        c.globalAlpha = 1;
    }
}

class Captain extends Entity {
    constructor(x, y) {
        super(x, y);
        this.w = 2;
        this.h = 2;
        this.action = 0;
        this.slowness = 16;
        this.actionX = [[3, 3, 3], [5, 5], [7, 7, 7], [9, 9, 9], [11, 11, 11]];
        this.actionY = [[16, 18, 20], [16, 18], [16, 18, 20], [16, 18, 20], [16, 18, 20]];
        this.solid = false;
        this.destructible = true;
        this.hasGrog = meta.gaveGrog;
        this.type = "captain";
        this.voice = sounds.captain;

        this.hitbox = {
            x: this.x + 0.8,
            y: this.y + 0.3,
            w: 1.2,
            h: 1.7
        };
        achievements.unlock("Captain Grog");
        this.lines = ["No matter 'ow 'ard ye try",
                       "I kind o' miss the past life with me crew",
                       "Mine ship was so beautiful, I miss ye... Bertha",
                     "Shiver me timbers mate, it looks such as yerself really like explosions",
                     "I don't care about gettin out o' thar. But I be sure ye're here t' help no one but yer urge to toss bombs",
                     "...grog...",
                     "Tis ugly boat? it aint mine matey",
                     "...",
                     "Ye would 'ave made a valuable hub if ye were in me crew",
                     "I reckon ye. It has been centuries Mad John. Yer headmoney was about 3 thousands doubloons.",
                     "Aye I remember when i was a sprog I heard tales about ye. They told one day ye exploded yourself by mistake.",
                     ];
        this.grogRelatedLines = ["'Ave you got some o' that there?",
                       "A fine bottle o' grog could really 'elp",
                       "Do ye 'ave spirits with ye? the drinkable ones I mean",
                       "Ye know, ye should give a look at me ship, I could tell ye where it be... if ye 'ad some grog",
                     "Sink this ugly ship down ye wish. but if ye got some grog search fer me!",
                     "'Ay ye, let's make a deal. Brin' me some grog an' I'll give ye the location o' me ship",
                     "I hope ye came wit' grog in yer pockets",
                     "Do ye also 'ave grog in that big sack ye're carryin'?",
                     "Some grog fer me ol' haunted ship. deal?",
                     "Do whatever 'n don't mind me, i lost me will wit' my grog bottle", ];
        if (!this.hasGrog) {
            this.lines.concat(this.grogRelatedLines);
        }
        this.action = (Math.random() * 3) | 0;
        if (this.hasGrog) {
            this.action = (Math.random() * 2) + 3 | 0;
        }
        if (player.hasGrog) {
            dialogueEngine.loadDialogueQueue([{
                speaker: this,
                text: "YARR! is that grog I see there matey? I'm gonna tell you where my ship is located. Come here!"
        }]);
            this.action = 2;
        } else {
            dialogueEngine.loadDialogueQueue([{
                speaker: this,
                text: this.lines[(Math.random() * this.lines.length) | 0]
        }]);
        }


    }
    explode() {
        map.vfxs.push(new Vfx(this.x + this.w / 2, this.y + this.h / 2, 14));
        map.vfxs.push(new Vfx(this.x + this.w / 2, this.y + this.h / 2, 15));
        map.vfxs.push(new Vfx(this.x + this.w / 2, this.y + this.h / 2, 15));
        map.vfxs.push(new Vfx(this.x + this.w / 2, this.y + this.h / 2, 16));
        map.vfxs.push(new Vfx(this.x + this.w / 2, this.y + this.h / 2, 16));
        map.vfxs.push(new Vfx(this.x + this.w / 2, this.y + this.h / 2, 17));
        if (this.hasGrog) {
            map.vfxs.push(new Vfx(this.x + this.w / 2, this.y + this.h / 2, 18));
        }
        this.removed = true;
    }
    compute() {
        if (collided(this, player)) {
            if (player.hasGrog && !meta.gaveGrog) {
                meta.gaveGrog = true;
                player.hasGrog = false;
                sounds.grog.playy();
                this.action = 3;
                this.hasGrog = true;
                achievements.unlock("Fair Trade");
                dialogueEngine.loadDialogueQueue([{
                    speaker: this,
                    text: "Ay right, Captain Grög always keeps his words. I made a map to find my galleon, but the scraps flew around tis same ship. Go search for 'em."
        }]);
            }
        }
        for (let i = 0; i < map.vfxs.length; i++) {
            if (map.vfxs[i].type == "explosion") {
                if (map.vfxs[i].which && map.vfxs[i].frame == 1) {
                    if (collided(this, map.vfxs[i])) {
                        this.explode();
                    }
                }
            }
        }
    }
    render() {
        this.frameCounter++;
        if (this.frameCounter >= this.slowness / meta.deltaTime) {
            this.frameCounter = 0;
            this.frame++;
        }
        if (this.frame >= this.actionX[this.action].length) {
            this.frame = 0;
            this.frameCounter = 0;
        }
        c.drawImage(
            this.sheet,
            this.actionX[this.action][this.frame] * meta.tilesize,
            this.actionY[this.action][this.frame] * meta.tilesize,
            this.w * meta.tilesize,
            this.h * meta.tilesize,
            ((this.x + map.x) * meta.tilesize * meta.ratio) | 0,
            ((this.y + map.y) * meta.tilesize * meta.ratio) | 0,
            (this.w * meta.tilesize * meta.ratio) | 0,
            (this.h * meta.tilesize * meta.ratio) | 0
        )
    }
}
class Map {
    constructor() {
        this.x = 0;
        this.y = 0;
        this.follow = {
            x: 0,
            y: 0
        }
        this.currentLevel = 0;
        this.levels = [];
        this.spawnPoint = {
            x: 0,
            y: 0
        }
        //preprocessed current level map
        this.map = [];
        this.lockedAngles = true;
        this.tiles = [];
        this.entities = [];
        this.vfxs = [];
        this.foreground = [];
        this.levelImage = false;
        this.frontImage = false;
        this.backgroundSpeed = 2;
        this.bgImagesMain = [{
                sheet: id("bg0"),
                x: 0,
                xVel: -0.01
                         },
            {
                sheet: id("bg1"),
                x: 0,
                xVel: -0.02
            }];
        this.bgImagesBertha = [{
                sheet: id("bg2"),
                x: 0,
                xVel: -0.01
                         },
            {
                sheet: id("bg3"),
                x: 0,
                xVel: -0.02
            }];
        this.bgImages = this.bgImagesMain;
        this.cameraFocus = false;

        this.levelX = 0;
        this.levelY = 0;
        this.levelWidth = 0;
        this.levelHeight = 0;
    }
    computeCamera() {
        if (this.cameraFocus) {
            let xx = -(this.cameraFocus.x + this.cameraFocus.w / 2 - meta.tilesWidth / 2)
            let yy = -(this.cameraFocus.y + this.cameraFocus.h / 2 - meta.tilesHeight / 2)
            this.x += (xx - this.x) / 6 * meta.deltaTime;
            this.y += (yy - this.y) / 6 * meta.deltaTime;
        }
        if (player.zooming) {
            let xx = -(this.cameraFocus.x + this.cameraFocus.w / 2 - meta.tilesWidth / 2)
            let yy = -(this.cameraFocus.y + this.cameraFocus.h / 2 - meta.tilesHeight / 2)
            this.x += (xx - this.x) / 300 * meta.deltaTime;
            this.y += (yy - this.y) / 300 * meta.deltaTime;
        }
        if (this.lockedAngles) {
            if (map.levelImage) {
                //check if the map has gone past the image x
                if (-this.x + meta.tilesWidth > this.levelImage.width / meta.tilesize) {
                    this.x = -(this.levelImage.width / meta.tilesize - meta.tilesWidth);
                }
                //check if the map has gone before the image x
                if (this.x > 0) {
                    this.x = 0;
                }
                if (-this.y + meta.tilesHeight > this.levelImage.height / meta.tilesize) {
                    this.y = -(this.levelImage.height / meta.tilesize - meta.tilesHeight);
                }
                if (this.y > 0) {
                    this.y = 0;
                }

            } else {
                if (-this.x + meta.tilesWidth > this.levelWidth) {
                    this.x = -(this.levelWidth - meta.tilesWidth);
                }
                if (-this.x < this.levelX) {
                    this.x = -this.levelX;
                }
                if (-this.y + meta.tilesHeight > this.levelHeight) {
                    this.y = -(this.levelHeight - meta.tilesHeight);
                }
                if (-this.y < this.levelY) {
                    this.y = -this.levelY;
                }
            }
        }
    }
    checkCollisions(obj, returnColliders, simpleCol) {
        let t = this.tiles;
        let col = "none";
        obj.grounded = false;
        obj.col.L = 0;
        obj.col.R = 0;
        obj.col.T = 0;
        obj.col.B = 0;
        let collidersChunk = [];
        for (let i = 0; i < t.length; i++) {
            //isOutOfScreen(t[i]) || t[i].notSolid
            if (t[i].notSolid) {
                continue;
            }
            if (obj === t[i]) {
                continue;
            }
            if (collided(obj, t[i])) {
                //adds item to colliders array
                if (simpleCol) {
                    col = colCheck(obj, t[i]);
                    switch (col) {
                        case "b":
                            if (obj.yVel >= 0) {
                                obj.grounded = true;
                                obj.yVel = 0;
                            }
                            break;
                    }

                } else {
                    collidersChunk.push(t[i]);
                }
            }
        }
        let e = this.entities;
        for (let i = 0; i < e.length; i++) {
            if (obj.type == "player" && e[i].type == "HeavySpike") {
                continue;
            }
            if (e[i].removed || !e[i].solid) {
                continue;
            }
            if (obj === e[i]) {
                continue;
            }
            if (collided(obj, e[i])) {
                if (obj.type == "bomb" && obj.which && e[i].destructible) {
                    e[i].explode();
                }
                //adds item to colliders array
                if (simpleCol) {
                    col = colCheck(obj, e[i]);
                    switch (col) {
                        case "b":
                            if (obj.yVel >= 0) {
                                obj.grounded = true;
                                obj.yVel = 0;
                            }
                            break;
                    }

                } else {
                    collidersChunk.push(e[i]);
                }
            }
        }


        if (collidersChunk.length > 1) {
            collidersChunk = assembleChunk(collidersChunk, obj);
        }
        for (let i = 0; i < collidersChunk.length; i++) {
            col = colCheck(obj, collidersChunk[i]);
            switch (col) {
                case "b":
                    if (obj.yVel >= 0) {
                        obj.grounded = true;
                        obj.yVel = 0;
                    }
                    break;
            }
        }


        if (obj.col.R - obj.col.L !== 0) {
            if (obj.col.R - obj.col.L > 0) {
                obj.x += 0.012;
            } else {
                obj.x -= 0.012;
            }
            obj.x -= obj.col.R - obj.col.L;
        }
        if (obj.col.B - obj.col.T !== 0) {
            obj.y -= obj.col.B - obj.col.T - 0.01;
        }
        if (returnColliders) {
            return collidersChunk;
        }
    }

    renderTiles() {
        if (this.levelImage) {
            c.drawImage(
                this.levelImage,
                (-this.x * meta.tilesize),
                (-this.y * meta.tilesize),
                (meta.tilesWidth * meta.tilesize),
                (meta.tilesHeight * meta.tilesize),
                0,
                0,
                (meta.tilesWidth * meta.tilesize * meta.ratio),
                (meta.tilesHeight * meta.tilesize * meta.ratio)
            )
            c.fillStyle = "black";
            //left wall
            c.fillRect(
                (this.x - 1 + screenShake.amountX) * meta.tilesize * meta.ratio,
                (this.y - 1 + screenShake.amountY) * meta.tilesize * meta.ratio,
                1 * meta.tilesize * meta.ratio,
                (this.levelImage.height + 2 * meta.tilesize) * meta.ratio
            )
            //right wall
            c.fillRect(
                (this.x * meta.tilesize + this.levelImage.width + screenShake.amountX) * meta.ratio,
                (this.y - 1 + screenShake.amountY) * meta.tilesize * meta.ratio,
                1 * meta.tilesize * meta.ratio,
                (this.levelImage.height + 2 * meta.tilesize) * meta.ratio
            )
            //top wall
            c.fillRect(
                (this.x - 1 + screenShake.amountX) * meta.tilesize * meta.ratio,
                (this.y - 1 + screenShake.amountY) * meta.tilesize * meta.ratio,
                (this.levelImage.width + 2 * meta.tilesize) * meta.ratio,
                1 * meta.tilesize * meta.ratio
            )
            //bottom wall
            c.fillRect(
                (this.x - 1 + screenShake.amountX) * meta.tilesize * meta.ratio,
                (this.y * meta.tilesize + this.levelImage.height + screenShake.amountY * meta.tilesize) * meta.ratio,
                (this.levelImage.width + 2 * meta.tilesize) * meta.ratio,
                1 * meta.tilesize * meta.ratio
            )
        } else {
            for (let i = 0; i < this.tiles.length; i++) {
                if (this.tiles[i].removed || isOutOfScreen(this.tiles[i])) {
                    continue;
                }
                renderEntity(this.tiles[i])
            }
            //render the level image
        }
    }
    computeEntities() {
        for (let i = 0; i < this.entities.length; i++) {
            if (this.entities[i].removed) {
                continue;
            }
            this.entities[i].compute();
        }
    }
    renderEntities() {
        for (let i = 0; i < this.entities.length; i++) {
            if (this.entities[i].removed || (!this.entities[i].important && isOutOfScreen(this.entities[i]))) {
                continue;
            }
            this.entities[i].render()
        }
    }
    renderForeground() {
        for (let i = 0; i < this.foreground.length; i++) {
            if (this.foreground[i].removed || (!this.foreground[i].important && isOutOfScreen(this.foreground[i]))) {
                continue;
            }
            this.foreground[i].render()
        }
    }
    computeForeground() {
        for (let i = 0; i < this.foreground.length; i++) {
            if (this.foreground[i].removed) {
                continue;
            }
            this.foreground[i].compute();
        }
    }
    computeVfxs() {
        for (let i = 0; i < this.vfxs.length; i++) {
            if (this.vfxs[i].removed) {
                continue;
            }
            this.vfxs[i].compute();
        }
    }
    renderVfxs() {
        for (let i = 0; i < this.vfxs.length; i++) {
            if (this.vfxs[i].removed || (!this.vfxs[i].important && isOutOfScreen(this.vfxs[i]))) {
                continue;
            }
            this.vfxs[i].render();
        }
    }
    renderBg() {
        if (mapTester) {
            return;
        }
        for (let i = 0; i < this.bgImages.length; i++) {
            this.bgImages[i].x += this.bgImages[i].xVel * meta.deltaTime;
            c.drawImage(
                this.bgImages[i].sheet,
                0,
                0,
                meta.tilesWidth * meta.tilesize,
                meta.tilesHeight * meta.tilesize,
                (this.x / this.backgroundSpeed + this.bgImages[i].x) % meta.tilesWidth * meta.tilesize * meta.ratio,
                0,
                meta.tilesWidth * meta.tilesize * meta.ratio,
                meta.tilesHeight * meta.tilesize * meta.ratio
            )
            c.drawImage(
                this.bgImages[i].sheet,
                0,
                0,
                meta.tilesWidth * meta.tilesize,
                meta.tilesHeight * meta.tilesize,
                ((this.x / this.backgroundSpeed + this.bgImages[i].x) % meta.tilesWidth + meta.tilesWidth) * meta.tilesize * meta.ratio,
                0,
                meta.tilesWidth * meta.tilesize * meta.ratio,
                meta.tilesHeight * meta.tilesize * meta.ratio
            )
        }
    }
    renderFront() {
        if (this.frontImage) {
            c.drawImage(
                this.frontImage,
                (-this.x * meta.tilesize),
                (-this.y * meta.tilesize),
                (meta.tilesWidth * meta.tilesize),
                (meta.tilesHeight * meta.tilesize),
                0,
                0,
                (meta.tilesWidth * meta.tilesize * meta.ratio),
                (meta.tilesHeight * meta.tilesize * meta.ratio)
            )
        }
    }
}
class Sounds {
    constructor() {
        this.playbackRate = 1;
        this.volume = 1;

        Audio.prototype.baseVolume = 1;
        Audio.prototype.isMusic = false;
        Audio.prototype.changeVolume = function () {
            let aud = this;
            if (aud.isMusic) {
                aud.volume = aud.baseVolume * meta.volume * meta.musicVolume;
            } else {
                aud.volume = aud.baseVolume * meta.volume * meta.sfxsVolume;
            }
        }
        Audio.prototype.playy = function () {
            let aud = this;
            aud.playbackRate = sounds.playbackRate;
            if (aud.isMusic) {
                aud.volume = aud.baseVolume * meta.volume * meta.musicVolume;
            } else {
                aud.volume = aud.baseVolume * meta.volume * meta.sfxsVolume;
            }
            if (aud.paused) {
                if (!aud.loop) {
                    aud.currentTime = 0;
                }
                let promise = aud.play();
                if (promise !== undefined) {
                    promise.catch(function (e) {});
                }
            } else {
                if (aud.loop) {
                    return;
                }
                aud.pause();
                aud.currentTime = 0;
                let promise = aud.play();
                if (promise !== undefined) {
                    promise.catch(function (e) {});
                }
            }
        };
        this.explosion1 = new Audio("audio/exp-1.mp3");
        this.explosion2 = new Audio("audio/exp-2.mp3");
        this.explosion3 = new Audio("audio/exp-3.mp3");
        this.explosion3.baseVolume = 0.3;
        this.throw = new Audio("audio/throw.mp3");
        this.death = new Audio("audio/death.mp3");
        this.broke = new Audio("audio/broke.mp3");
        this.transition = new Audio("audio/transition.mp3");
        this.getItem = new Audio("audio/getItem.mp3");
        this.getPaper = new Audio("audio/getPaper.mp3");
        this.getPaper.baseVolume = 0.7;
        this.grog = new Audio("audio/grog.mp3");
        this.respawn = new Audio("audio/respawn.mp3");
        this.notes1 = new Audio("audio/notes-1.mp3");
        this.notes2 = new Audio("audio/notes-2.mp3");

        this.captain = [
            new Audio("audio/captain/0.mp3"),
            new Audio("audio/captain/1.mp3"),
            new Audio("audio/captain/2.mp3"),
            new Audio("audio/captain/3.mp3"),
            new Audio("audio/captain/4.mp3"),
            new Audio("audio/captain/5.mp3")
        ]

        this.necromancer = [
            new Audio("audio/necromancer/0.mp3"),
            new Audio("audio/necromancer/1.mp3"),
            new Audio("audio/necromancer/2.mp3"),
            new Audio("audio/necromancer/3.mp3"),
            new Audio("audio/necromancer/4.mp3"),
            new Audio("audio/necromancer/5.mp3")
        ]
        this.skull = new Audio("audio/necromancer/skull.mp3");
        this.transformIn = new Audio("audio/necromancer/transform-in.mp3");
        this.transformOut = new Audio("audio/necromancer/transform-out.mp3");
        this.transformAttack = new Audio("audio/necromancer/transform-attack.mp3");
        this.transformWall = new Audio("audio/necromancer/transform-wall.mp3");

        this.shanty_1 = new Audio("audio/music/yohoho-minor2.mp3"); // Main loop music
        this.shanty_2 = new Audio("audio/music/yohoho-hg.mp3"); // Last level music
        this.shanty_3 = new Audio("audio/music/bone-bomber.mp3"); // Area 2 music

        this.bandDestroyed = new Audio("audio/band-destroyed.mp3");
        this.bandDestroyed.baseVolume = 0.6;

        this.shanty_1.isMusic = true;
        this.shanty_1.baseVolume = 0.6;
        this.shanty_1.loop = true;

        this.shanty_2.isMusic = true;
        this.shanty_2.baseVolume = 0.6;
        this.shanty_2.loop = true;

        this.shanty_3.isMusic = true;
        this.shanty_3.baseVolume = 0.6;
        this.shanty_3.loop = true;
    }
    changeGlobalVolume(targetVolume) {

    }
    changeGlobalPlaybackRate(playbackRate) {
        this.playbackRate = playbackRate;
    }
}
class Cursor {
    constructor() {
        this.sheet = id("sheet");
        this.mapPos = {
            x: 0,
            y: 0,
            w: 1,
            h: 1,
        }
        this.mapPos2 = {
            x: 0,
            y: 0,
            w: 1,
            h: 1,
        }
        this.w = 1;
        this.h = 1;
        this.action = 0;
        this.actionX = [0, 0, 0];
        this.actionY = [0, 1, 2];
        this.locked = false;
        this.lockedMouse = {
            x: canvas.offsetLeft + canvas.width / 2,
            y: canvas.offsetTop + canvas.height / 2
        }
        this.initialized = false;
        document.addEventListener("mousemove", this.updatePosition);
        document.addEventListener("mousemove", this.updateLockedCursor);
        canvas.addEventListener("click", function () {
            if (!cursor.initialized) {
                cursor.initialize();
            }
        });
    }
    initialize() {
        this.initialized = true;

        if ("onpointerlockchange" in document) {
            document.addEventListener('pointerlockchange', cursor.onLockChange, false);
        } else if ("onmozpointerlockchange" in document) {
            document.addEventListener('mozpointerlockchange', cursor.onLockChange, false);
        }

        // Checks if you can lock the pointer to the canvas
        canvas.requestPointerLock = canvas.requestPointerLock || canvas.mozRequestPointerLock;
        canvas.requestPointerLock();

    }
    onLockChange() {
        if (document.pointerLockElement === canvas ||
            document.mozPointerLockElement === canvas) {
            cursor.locked = true;
        } else {
            cursor.locked = false;
            cursor.initialized = false;
        }
    }
    updateLockedCursor(e) {
        if (!cursor.locked) {
            return;
        }
        cursor.lockedMouse.x += e.movementX;
        cursor.lockedMouse.y += e.movementY;
        
        // checks if mouse has gone further than the canvas
        if (cursor.lockedMouse.x > canvas.width + canvas.offsetLeft) {
            cursor.lockedMouse.x = canvas.width + canvas.offsetLeft;
        }
        if (cursor.lockedMouse.x < canvas.offsetLeft) {
            cursor.lockedMouse.x = canvas.offsetLeft;
        }
        
        if (cursor.lockedMouse.y > canvas.height + canvas.offsetTop) {
            cursor.lockedMouse.y = canvas.height + canvas.offsetTop;
        }
        if (cursor.lockedMouse.y < canvas.offsetTop) {
            cursor.lockedMouse.y = canvas.offsetTop;
        }
    }
    updatePosition(e) {
        if (player.zooming) {
            return;
        }
        let clientX = cursor.locked ? cursor.lockedMouse.x : e.clientX;
        let clientY = cursor.locked ? cursor.lockedMouse.y : e.clientY;
        cursor.mapPos.x = (clientX - canvas.offsetLeft) / (meta.tilesize * meta.ratio);
        cursor.mapPos.y = (clientY - canvas.offsetTop) / (meta.tilesize * meta.ratio);
        let x = cursor.mapPos.x - 2 - map.x;
        let y = cursor.mapPos.y - 2 - map.y;
        let x2 = player.x + player.w / 2;
        let y2 = player.y + player.h / 2;
        let deltaX = x - player.x + player.w / 2;
        let deltaY = y - player.y + player.h / 2;
        let rotation = Math.atan2(deltaY, deltaX);
        let xTarget = Math.cos(rotation) * 5;
        let yTarget = Math.sin(rotation) * 5;
        cursor.mapPos2.x = cursor.mapPos.x - map.x + xTarget;
        cursor.mapPos2.y = cursor.mapPos.y - map.y + yTarget;
    }
    compute() {
        if (meta.loopType == 0) {
            this.action = player.currentBomb;
        } else {
            this.action = 2;
        }
    }
    render() {
        if (player.zooming) {
            return;
        }
        c.drawImage(
            this.sheet,
            this.actionX[this.action] * meta.tilesize,
            this.actionY[this.action] * meta.tilesize,
            this.w * meta.tilesize,
            this.h * meta.tilesize,
            (this.mapPos.x - this.w / 2) * meta.ratio * meta.tilesize,
            (this.mapPos.y - this.h / 2) * meta.ratio * meta.tilesize,
            this.w * meta.ratio * meta.tilesize,
            this.h * meta.ratio * meta.tilesize
        )
    }
}
class Player extends Entity {
    constructor() {
        super();
        this.x = 0;
        this.y = 0;
        this.w = 2;
        this.h = 2;
        this.xVel = 0;
        this.yVel = 0;
        this.speed = 0.03;
        this.airSpeed = 0.015;
        this.maxSpeed = 0.15;
        this.jumpSpeed = -0.24;
        this.gForce = 0.0154;
        this.currentBomb = 0;
        this.spyglassNotice = false;
        this.grounded = true;
        this.removed = false;
        this.zooming = false;
        this.left = 0;
        this.type = "player";
        this.sheet = id("sheet");
        this.armX = [5, 6];
        this.armY = [4, 4];
        this.armRot = 0;
        this.attacking = 0;
        this.jumpCooldown = 0;


        this.hasGrog = false;
        this.totalPapers = 0;
        this.currentPaper = "none";
        /*
            items logic:
            
            Papers:
            if you die in the level you took the paper, you lose the paper
            if you complete the level the paper gets saved PERMANENTLY
            even a new game will keep the paper saved.
            
            Grog:
            if you die in the level you got the grog, you lose the grog
            the grog in your inventory gets saved in memory.
            But if you have the grog and run a new game, you lose the grog.
            if you give the grog to captain grog it gets saved in memory permanently
        */

        this.hitbox = {
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
        }
        window.addEventListener("click", function () {
            if (meta.loopType !== 0) {
                return;
            }
            player.attack();
        })
        this.action = 0;

        this.actionPink = [[1, 1, 1, 1], [3, 3, 3, 3], [5], [7], [5], [7], [1, 3, 5, 7], [1, 3, 5, 7], [5, 13, 13], [7, 15, 15], [13], [13]];
        this.actionBlack = [[9, 9, 9, 9], [11, 11, 11, 11], [5], [7], [5], [7], [9, 11, 13, 15], [9, 11, 13, 15], [5, 13, 13], [7, 15, 15], [13], [13]];


        this.actionY = [[0, 2, 4, 6], [0, 2, 4, 6], [0], [0], [2], [2], [8, 8, 8, 8], [10, 10, 10, 10], [6, 4, 6], [6, 4, 6], [0], [2]];

        this.actionX = this.currentBomb ? this.actionBlack : this.actionPink;
        this.slowness = 6;
    }
    die(causeOfDeath) {
        if (this.removed) {
            return;
        }
        this.currentPaper = "none";
        debug.log("Cause of death: " + causeOfDeath);
        sounds.death.playy();
        slowMo.duration = 30;
        meta.deathCounter++;
        map.vfxs.push(new Vfx(this.x + this.w / 2, this.y + this.h / 2, 0));
        map.vfxs.push(new Vfx(this.x + this.w / 2, this.y + this.h / 2, 0));
        map.vfxs.push(new Vfx(this.x + this.w / 2, this.y + this.h / 2, 1));
        map.vfxs.push(new Vfx(this.x + this.w / 2, this.y + this.h / 2, 2));
        map.vfxs.push(new Vfx(this.x + this.w / 2, this.y + this.h / 2, 3));
        map.vfxs.push(new Vfx(this.x + this.w / 2, this.y + this.h / 2, 3));
        map.vfxs.push(new Vfx(this.x + this.w / 2, this.y + this.h / 2, 4));
        this.x = map.spawnPoint.x;
        this.y = map.spawnPoint.y;
        this.removed = true;
        if (!this.zooming) {
            map.cameraFocus = false;
        }
        setTimeout(function () {
            /*
            captureStopMotion();
            meta.loopType = 1; //transition
            //*/


            //loadLevel();
            loadCall = true;
            //player.removed = false;
            map.cameraFocus = player;
            player.currentBomb = 0;
            player.actionX = player.currentBomb ? player.actionBlack : player.actionPink;
            player.xVel = 0;
            player.yVel = 0;
            player.left = 0;
            player.hitbox = {
                x: 0,
                y: 0,
                w: 0,
                h: 0
            };

        }, 1000)
    }
    attack() {
        if (this.removed || this.zooming) {
            return;
        }
        let x = cursor.mapPos.x - 2 - map.x;
        let y = cursor.mapPos.y - 2 - map.y;
        let x2 = this.x + this.w / 2;
        let y2 = this.y + this.h / 2;
        let deltaX = x - this.x + this.w / 2;
        let deltaY = y - this.y + this.h / 2;
        let rotation = Math.atan2(deltaY, deltaX);
        let a = x - x2;
        let b = y - y2;
        /*
        let distance = Math.sqrt(a * a + b * b);
        if (distance > 10) {
            distance = 10;
        }
        //*/
        let distance = 6;
        let xTarget = Math.cos(rotation) / 20 * distance;
        let yTarget = Math.sin(rotation) / 20 * distance;
        this.armRot = rotation + Math.PI / 4;
        this.attacking = 10;
        map.entities.push(new Bomb(this.x + this.w / 2 - 0.5 + Math.cos(rotation) * 0.7, this.y + this.h / 2 - 0.5 + Math.sin(rotation) * 0.7, xTarget + this.xVel / 2, yTarget + this.yVel / 2, this.currentBomb));
        this.currentBomb ? this.currentBomb = 0 : this.currentBomb = 1;
        this.actionX = this.currentBomb ? this.actionBlack : this.actionPink;
        sounds.throw.playy();
    }
    computeAction() {
        if (this.xVel > 0) {
            this.left = 0;
        } else if (this.xVel < 0) {
            this.left = 1;
        }
        if (this.grounded) {
            this.action = 0;
            if (Math.abs(this.xVel) > 0) {
                this.action = 6;
            }
        } else {
            this.action = 2;
            if (this.col.L && controls.left) {
                this.action = 8;
                this.left = 1;
            }
            if (this.col.R && controls.right) {
                this.action = 8;
                this.left = 0;
            }
        }
        if (this.attacking > 0) {
            this.attacking -= meta.deltaTime;
            this.action = 4;
        }

        if (controls.rClickDown) {
            this.action = 10;
        }
    }
    onExplosion(source) {
        switch (source.col) {
            case "l":
                this.xVel = -this.jumpSpeed * 1.5;
                this.yVel = this.jumpSpeed * 1.5;
                break;
            case "r":
                this.xVel = this.jumpSpeed * 1.5;
                this.yVel = this.jumpSpeed * 1.5;
                break;
            case "t":
                this.yVel = -this.jumpSpeed;
                break;
            case "b":
                this.yVel = this.jumpSpeed * 2;
                break;
        }
        this.grounded = false
    }
    handleControls() {
        if (controls.rClickDown) {
            if (!this.zooming) {
                this.zooming = true;
            }
            map.cameraFocus = cursor.mapPos2;
            if (cursor.mapPos.x - map.x > player.x) {
                this.left = 0;
            } else {
                this.left = 1;
            }
            if (this.grounded) {
                this.xVel = 0;
            }
            return;
        } else {
            map.cameraFocus = this;
            this.zooming = false;
        }
        if (controls.left && !this.col.L) {
            if (this.grounded && this.xVel > 0) {
                this.xVel = 0;
            }
            if (this.xVel > -this.maxSpeed) {
                this.xVel += this.grounded ? -this.speed * meta.deltaTime : -this.airSpeed * meta.deltaTime;
            }
        }
        if (controls.right && !this.col.R) {
            if (this.grounded && this.xVel < 0) {
                this.xVel = 0;
            }
            if (this.xVel < this.maxSpeed) {
                this.xVel += this.grounded ? this.speed * meta.deltaTime : this.airSpeed * meta.deltaTime;
            }
        }
        if (!controls.right && !controls.left && this.grounded) {
            this.xVel = 0;
        }

    }
    handleCollisions() {
        map.checkCollisions(this);
        if (this.col.T && this.yVel < 0) {
            this.yVel = 0;
        }
        if (this.col.R && this.xVel > 0) {
            this.xVel = 0;
        }
        if (this.col.L && this.xVel < 0) {
            this.xVel = 0;
        }
    }
    compute() {
        if (this.removed) {
            return;
        }
        this.handleCollisions();
        this.handleControls();
        if (!this.grounded) {

            this.yVel += this.gForce * meta.deltaTime;

            if (((this.col.L && controls.left) || (this.col.R && controls.right)) && this.yVel > meta.terminalVel * 0.2) {
                this.yVel = meta.terminalVel * 0.2;
            } else if (this.yVel > meta.terminalVel) {
                this.yVel = meta.terminalVel;
            }

        } else {
            this.yVel = 0;
        }
        if (this.grounded && Math.abs(this.xVel) > this.maxSpeed) {
            this.xVel -= 0.001;
        }


        this.x += this.xVel * meta.deltaTime;
        this.y += this.yVel * meta.deltaTime;
        this.hitbox.x = this.x + 0.3;
        this.hitbox.y = this.y + 0.2;
        this.hitbox.w = this.w - 0.6;
        this.hitbox.h = this.h - 0.2;
        this.computeAction();
        if (isOutOfBounds(this)) {
            this.die("Out of bounds");
        }
    }
    render() {
        if (this.removed) {
            return;
        }
        this.slowness = this.baseSlowness / meta.deltaTime;
        this.frameCounter++;
        if (this.frameCounter >= this.slowness) {
            this.frameCounter = 0;
            this.frame++;
        }
        if (this.frame >= this.actionX[this.action].length) {
            this.frame = 0;
            this.frameCounter = 0;
        }
        c.drawImage(
            this.sheet,
            this.actionX[this.action + this.left][this.frame] * meta.tilesize,
            this.actionY[this.action + this.left][this.frame] * meta.tilesize,
            this.w * meta.tilesize,
            this.h * meta.tilesize,
            ((this.x + map.x) * meta.tilesize * meta.ratio) | 0,
            ((this.y + map.y) * meta.tilesize * meta.ratio) | 0,
            (this.w * meta.tilesize * meta.ratio) | 0,
            (this.h * meta.tilesize * meta.ratio) | 0
        )
        if (this.action == 4) {
            c.save();
            c.translate((this.x + map.x + this.w / 2) * meta.tilesize * meta.ratio | 0, (this.y + map.y + this.h / 2) * meta.tilesize * meta.ratio | 0);
            c.rotate(this.armRot);
            c.drawImage(
                this.sheet,
                this.armX[this.left] * meta.tilesize,
                this.armY[this.left] * meta.tilesize,
                1 * meta.tilesize,
                1 * meta.tilesize,
                0 * meta.tilesize * meta.ratio,
                -1 * meta.tilesize * meta.ratio,
                1 * meta.tilesize * meta.ratio | 0,
                1 * meta.tilesize * meta.ratio | 0
            )
            c.restore();
        }
    }
}

// The flying stuff
class Vfx {
    constructor(x, y, type, slow) {
        this.x = x;
        this.y = y;
        this.w = 1;
        this.h = 1;
        this.slow = slow ? true : false;
        //compute/render even if out of screen
        this.important = false;
        this.strikeable = false;
        this.rotation = 0;
        this.rotSpeed = Math.random() * 10;
        this.xVel = Math.random() * 0.3 - 0.15;
        this.yVel = -Math.random() * 0.6 - 0.1;
        if (this.slow) {
            this.xVel = Math.random() * 0.1 - 0.05;
            this.rotSpeed = 0;
        }
        this.sheet = id("sheet");
        this.type = type;
        this.gForce = 0.02;
    }
    compute() {
        this.yVel += this.gForce * meta.deltaTime;
        if (this.y > map.tilesHeight) {
            this.removed = true;
        }
        this.x += this.xVel * meta.deltaTime;
        this.y += this.yVel * meta.deltaTime;
        this.rotation += this.rotSpeed * meta.deltaTime;
    }
    render() {
        c.save();
        c.translate(
            (this.x + this.w / 2 + map.x) * meta.tilesize * meta.ratio,
            (this.y + this.h / 2 + map.y) * meta.tilesize * meta.ratio
        );
        // 
        c.rotate(this.rotation * Math.PI / 180);
        c.drawImage(
            this.sheet,
            30 * meta.tilesize,
            this.type * meta.tilesize,
            this.w * meta.tilesize,
            this.h * meta.tilesize,
            (-this.w / 2) * meta.tilesize * meta.ratio | 0,
            (-this.h / 2) * meta.tilesize * meta.ratio | 0,
            this.w * meta.tilesize * meta.ratio | 0,
            this.h * meta.tilesize * meta.ratio | 0
        )
        c.restore();
    }
}
class Bomb extends Entity {
    constructor(x, y, xVel, yVel, which) {
        super(x, y)
        meta.bombCounter++;
        this.speed = 0.05;
        this.maxSpeed = 0.3;
        this.xVel = xVel;
        this.yVel = yVel;
        this.which = which; //0 = pink, 1 = black
        this.sheet = id("sheet");
        this.left = 0;
        this.action = 0;
        this.actionX = [[15, 15, 15, 15], [16, 16, 16, 16]];
        this.actionY = [[0, 1, 2, 3], [0, 1, 2, 3]];
        this.dir = this.left * 2 - 1;
        this.recoilAttacker = false;
        this.baseSlowness = 4;
        this.slowness = this.baseSlowness;

        this.gForce = 0.011;
        this.jumpSpeed = 0.37;
        this.grounded = false;
        this.jumping = false;
        this.type = "bomb";
        this.friction = 0.99;

        this.controls = {
            left: false,
            right: false,
            up: false,
            down: false
        };
        this.hitbox = {
            x: this.x + 0.15,
            y: this.y + 0.15,
            w: 0.7,
            h: 0.7
        }
    }
    computeAction() {}
    explode(collidedObj) {
        this.removed = true;
        let chunk = map.checkCollisions(this, true);
        let col = colCheck(this, chunk[0]);
        this.x -= this.col.R - this.col.L;
        this.y -= this.col.B - this.col.T;
        map.vfxs.push(new Explosion(this.x, this.y, col, this.which));
        if (this.which) {
            sounds.explosion2.playy();
            screenShake.duration = 10;
        } else {
            sounds.explosion1.playy();
        }
    }
    compute() {
        if (this.yVel < meta.terminalVel) {
            this.yVel += this.gForce * meta.deltaTime;
        } else {
            this.yVel = meta.terminalVel;
        }
        if (this.xVel > meta.terminalVel) {
            this.xVel = meta.terminalVel;
        } else if (this.xVel < -meta.terminalVel) {
            this.xVel = -meta.terminalVel;
        }
        if (this.controls.left) {
            if (this.xVel > -this.maxSpeed) {
                this.grounded ? this.xVel -= this.speed * meta.deltaTime : this.xVel -= this.speed / 2 * meta.deltaTime;
            }
        }
        if (this.controls.right) {
            if (this.xVel < this.maxSpeed) {
                this.grounded ? this.xVel += this.speed * meta.deltaTime : this.xVel += this.speed / 2 * meta.deltaTime;
            }
        }
        if (this.yVel < 0 && this.col.T) {
            this.yVel = 0;
        }
        if (Math.abs(this.xVel) > 0.01) {
            this.xVel *= Math.pow(this.friction, meta.deltaTime);
        } else {
            this.xVel = 0;
        }
        if (this.controls.up && !this.jumping && !this.col.T) {
            this.jumping = true;
            this.yVel -= this.jumpSpeed;
        }

        if (this.col.R && this.xVel > 0 ||
            this.col.L && this.xVel < 0) {
            this.xVel = 0;
        }
        this.y += this.yVel * meta.deltaTime;
        this.x += this.xVel * meta.deltaTime;
        this.hitbox.x = this.x + 0.2;
        this.hitbox.y = this.y + 0.2;

        this.computeAction();

        for (let i = 0; i < map.tiles.length; i++) {
            if (collided(this, map.tiles[i])) {
                this.explode(map.tiles[i]);
                return;
            }
        }
        for (let i = 0; i < map.entities.length; i++) {
            if (map.entities[i].removed || !map.entities[i].solid) {
                continue;
            }
            if (map.entities[i].type == "bomb") {
                continue;
            }
            if (collided(this, map.entities[i])) {
                this.explode(map.entities[i])
                return;
            }
        }
    }
    render() {
        this.slowness = this.baseSlowness / meta.deltaTime;
        this.frameCounter++;
        if (this.frameCounter >= this.slowness) {
            this.frameCounter = 0;
            this.frame++;
            if (this.frame >= this.actionX[this.action].length) {
                this.frame = 0;
                this.frameCounter = 0;
            }
        }
        c.drawImage(
            this.sheet,
            this.actionX[this.action + this.which][this.frame] * meta.tilesize,
            this.actionY[this.action + this.which][this.frame] * meta.tilesize,
            this.w * meta.tilesize,
            this.h * meta.tilesize,
            (this.x + map.x) * meta.tilesize * meta.ratio | 0,
            (this.y + map.y) * meta.tilesize * meta.ratio | 0,
            this.w * meta.tilesize * meta.ratio | 0,
            this.h * meta.tilesize * meta.ratio | 0
        )
        //drawLaser(this,this.left);
    }
}

class Explosion extends Entity {
    constructor(x, y, col, which) {
        super();
        this.x = x - 1;
        this.y = y - 2;
        this.w = 3;
        this.h = 3;
        this.which = which;
        this.sheet = id("sheet");
        this.action = 0;
        this.col = col;
        this.playerCol = false;
        this.type = "explosion";
        switch (this.col) {
            case "b":
                this.action = 0;
                this.x = x - 1;
                this.y = y - 2;
                break;
            case "l":
                this.action = 1;
                this.x = x;
                this.y = y - 1;
                break;
            case "t":
                this.action = 2;
                this.x = x - 1;
                this.y = y;
                break;
            case "r":
                this.action = 3;
                this.x = x - 2;
                this.y = y - 1;
                break;
        }
        this.hitbox = {
            x: this.x + 0.65,
            y: this.y + 0.65,
            w: this.w - 1.3,
            h: this.h - 1.3,
        }
        this.baseSlowness = 4;
        this.slowness = this.baseSlowness;

        //this.actionX = [[0,0,0,0,0,0,0,0,0]];
        //this.actionY = [[0,3,6,9,12,15,18,21,24]];

        //0- B 
        //1- L 
        //2- U 
        //3- R

        this.actionX = [
            [17, 17, 17, 17, 17, 17, 17, 17],
            [20, 20, 20, 20, 20, 20, 20, 20],
            [23, 23, 23, 23, 23, 23, 23, 23],
            [26, 26, 26, 26, 26, 26, 26, 26],
        ];
        this.explosiveY = [
            [0, 3, 6, 9, 12, 15, 18, 21],
            [0, 3, 6, 9, 12, 15, 18, 21],
            [0, 3, 6, 9, 12, 15, 18, 21],
            [0, 3, 6, 9, 12, 15, 18, 21],
        ];
        this.bouncyY = [
            [24, 27, 30, 33, 36, 39, 42, 45],
            [24, 27, 30, 33, 36, 39, 42, 45],
            [24, 27, 30, 33, 36, 39, 42, 45],
            [24, 27, 30, 33, 36, 39, 42, 45],
        ];
        this.actionY = this.which ? this.explosiveY : this.bouncyY;
    }
    compute() {
        if (this.playerCol) {
            return;
        }
        if (this.frame > 0 && this.frame <= 2) {
            if (collided(this, player)) {
                if (!this.which) {
                    player.onExplosion(this);
                } else {
                    player.die("Own bomb");
                    achievements.unlock("*Mildly surprised expression*");
                }
                this.playerCol = true;
            }
        }
    }
    render() {
        this.slowness = this.baseSlowness / meta.deltaTime;
        this.frameCounter++;
        if (this.frameCounter >= this.slowness) {
            this.frameCounter = 0;
            this.frame++;
            if (this.frame >= this.actionX[this.action].length) {
                this.frame = 0;
                this.frameCounter = 0;
                this.removed = true;
                return;
            }
        }
        c.drawImage(
            this.sheet,
            this.actionX[this.action][this.frame] * meta.tilesize,
            this.actionY[this.action][this.frame] * meta.tilesize,
            this.w * meta.tilesize,
            this.h * meta.tilesize,
            (this.x + map.x) * meta.tilesize * meta.ratio | 0,
            (this.y + map.y) * meta.tilesize * meta.ratio | 0,
            this.w * meta.tilesize * meta.ratio | 0,
            this.h * meta.tilesize * meta.ratio | 0
        )

        /*draws the hitbox
        c.fillStyle="red";
        c.fillRect(
        (this.hitbox.x+map.x)* meta.tilesize * meta.ratio,
        (this.hitbox.y+map.y)* meta.tilesize * meta.ratio,
        this.hitbox.w* meta.tilesize * meta.ratio,
        this.hitbox.h* meta.tilesize * meta.ratio)
        //*/
    }
}

class RespawnExplosion extends Entity {
    constructor(x, y) {
        super();
        this.x = x - 0.5;
        this.y = y - 1.3;
        this.w = 3;
        this.h = 3;
        this.sheet = id("sheet");
        this.action = 0;
        this.playerCol = false;
        this.type = "respawnExplosion";
        this.baseSlowness = 5;
        this.slowness = this.baseSlowness;
        this.actionX = [13, 13, 13, 13, 13, 13];
        this.actionY = [13, 16, 19, 22, 25, 28];
    }
    compute() {}
    render() {
        this.slowness = this.baseSlowness / meta.deltaTime;
        this.frameCounter++;
        if (this.frameCounter >= this.slowness) {
            this.frameCounter = 0;
            this.frame++;
            if (this.frame >= this.actionX[this.action].length) {
                this.frame = 0;
                this.frameCounter = 0;
                this.removed = true;
                return;
            }
        }
        c.drawImage(
            this.sheet,
            this.actionX[this.frame] * meta.tilesize,
            this.actionY[this.frame] * meta.tilesize,
            this.w * meta.tilesize,
            this.h * meta.tilesize,
            (this.x + map.x) * meta.tilesize * meta.ratio | 0,
            (this.y + map.y) * meta.tilesize * meta.ratio | 0,
            this.w * meta.tilesize * meta.ratio | 0,
            this.h * meta.tilesize * meta.ratio | 0
        )
    }
}

class BarrelExplosion extends Entity {
    constructor(x, y) {
        super();
        this.x = x - 1;
        this.y = y - 1;
        this.w = 3;
        this.h = 3;
        this.sheet = id("sheet");
        this.action = 0;
        this.playerCol = false;
        this.type = "explosion";
        this.baseSlowness = 4;
        this.important = true;
        this.slowness = this.baseSlowness;
        this.actionX = [32, 32, 32, 32, 32, 32, 32, 32];
        this.actionY = [24, 27, 30, 33, 36, 39, 42, 45];
        this.hitbox = {
            x: this.x + 0.65,
            y: this.y + 0.65,
            w: this.w - 1.3,
            h: this.h - 1.3,
        }
    }
    compute() {
        if (this.frame == 3) {
            if (!player.removed && collided(this, player)) {
                player.die("Barrel bomb");
            }
            for (let i = 0; i < map.entities.length; i++) {
                if (map.entities[i].removed || !map.entities[i].destructible) {
                    continue;
                }
                if (collided(this, map.entities[i])) {
                    map.entities[i].explode();
                }
            }
        }
    }
    render() {
        this.slowness = this.baseSlowness / meta.deltaTime;
        this.frameCounter++;
        if (this.frameCounter >= this.slowness) {
            this.frameCounter = 0;
            this.frame++;
            if (this.frame >= this.actionX[this.action].length) {
                this.frame = 0;
                this.frameCounter = 0;
                this.removed = true;
                return;
            }
        }
        c.drawImage(
            this.sheet,
            this.actionX[this.frame] * meta.tilesize,
            this.actionY[this.frame] * meta.tilesize,
            this.w * meta.tilesize,
            this.h * meta.tilesize,
            (this.x + map.x) * meta.tilesize * meta.ratio | 0,
            (this.y + map.y) * meta.tilesize * meta.ratio | 0,
            this.w * meta.tilesize * meta.ratio | 0,
            this.h * meta.tilesize * meta.ratio | 0
        )
    }
}

class RollingCredits {
    constructor() {
        this.x = 0;
        this.y = meta.tilesHeight - 6;
        this.fontSize = 20;
        this.speed = -0.015;
        this.type = "credits";
        if (meta.onBertha) {

            if (meta.berthaTimeRecord != "none" && meta.berthaTimeRecord != undefined) {
                this.newTimeRecord = meta.cronometer.time < meta.berthaTimeRecord ? true : false;
            } else {
                this.newTimeRecord = false;
            }

            if (meta.berthaDeathRecord != "none" && meta.berthaDeathRecord != undefined) {
                this.newDeathRecord = meta.deathCounter < meta.berthaDeathRecord ? true : false;
            } else {
                this.newDeathRecord = false;
            }

            if (meta.berthaBombRecord != "none" && meta.berthaBombRecord != undefined) {
                this.newBombRecord = meta.bombCounter < meta.berthaBombRecord ? true : false;
            } else {
                this.newBombRecord = false;
            }


            this.bombRecord = "";
            if (this.newBombRecord) {
                this.bombRecord += "(New record! past bomb record(efficiency): " + meta.berthaBombRecord + ")";
                meta.berthaBombRecord = meta.bombCounter;
            } else if (meta.berthaBombRecord == "none" || meta.berthaBombRecord == undefined) {
                meta.berthaBombRecord = meta.bombCounter;
            }


            this.deathRecord = "";
            if (this.newDeathRecord) {
                this.deathRecord += "(New record! past deaths record: " + meta.berthaDeathRecord + ")";
                meta.berthaDeathRecord = meta.deathCounter;
            } else if (meta.deathRecord == "none" || meta.berthaDeathRecord == undefined) {
                meta.berthaDeathRecord = meta.deathCounter;
            }

            this.timeRecord = "";
            if (this.newTimeRecord) {
                let timeText = (meta.berthaTimeRecord / 60 | 0) + ":" + (meta.berthaTimeRecord % 60 < 10 ? "0" : "") + (meta.berthaTimeRecord % 60).toFixed(2);
                this.newTimeRecord += "(New record! past time record: " + timeText + ")";
                meta.berthaTimeRecord = meta.cronometer.time;
            } else if (meta.berthaTimeRecord == "none" || meta.berthaTimeRecord == undefined) {
                meta.berthaTimeRecord = meta.cronometer.time
            }
            postScore('Time Record (Gallion Bertha)', (meta.cronometer.time * 1000) | 0);
            postScore('Bomb Efficiency (Gallion Bertha)', meta.bombCounter);
        } else {
            if (meta.timeRecord != "none" && meta.timeRecord != undefined) {
                this.newTimeRecord = meta.cronometer.time < meta.timeRecord ? true : false;
            } else {
                this.newTimeRecord = false;
            }

            if (meta.deathRecord != "none" && meta.deathRecord != undefined) {
                this.newDeathRecord = meta.deathCounter < meta.deathRecord ? true : false;
            } else {
                this.newDeathRecord = false;
            }


            if (meta.bombRecord != "none" && meta.bombRecord != undefined) {
                this.newBombRecord = meta.bombCounter < meta.bombRecord ? true : false;
            } else {
                this.newBombRecord = false;
            }


            this.bombRecord = "";
            if (this.newBombRecord) {
                this.bombRecord += "(New record! past bomb record(efficiency): " + meta.bombRecord + ")";
                meta.bombRecord = meta.bombCounter;
            } else if (meta.bombRecord == "none" || meta.bombRecord == undefined) {
                meta.bombRecord = meta.bombCounter;
            }


            this.deathRecord = "";
            if (this.newDeathRecord) {
                this.deathRecord += "(New record! past deaths record: " + meta.deathRecord + ")";
                meta.deathRecord = meta.deathCounter;
            } else if (meta.deathRecord == "none" || meta.deathRecord == undefined) {
                meta.deathRecord = meta.deathCounter;
            }

            this.timeRecord = "";
            if (this.newTimeRecord) {
                let timeText = (meta.timeRecord / 60 | 0) + ":" + (meta.timeRecord % 60 < 10 ? "0" : "") + (meta.timeRecord % 60).toFixed(2);
                this.timeRecord += "(New record! past time record: " + timeText + ")";
                meta.timeRecord = meta.cronometer.time;
            } else if (meta.timeRecord == "none" || meta.timeRecord == undefined) {
                meta.timeRecord = meta.cronometer.time
            }
            postScore('Time Record', (meta.cronometer.time * 1000) | 0);
            postScore('Bomb Efficiency', meta.bombCounter);
        }
        saveGame();
        this.texts = [
         //"Display deaths",
         "Deaths: " + meta.deathCounter,
        "" + this.deathRecord,
         //"Display time/Display record",
         "Time: " + meta.cronometer.timeText,
        "" + this.timeRecord,
         //"Display bombs/Display record",
         "Bombs thrown: " + meta.bombCounter,
        "" + this.bombRecord,
        "",
         "ART, SFXs, DESIGN, PROGRAMMING:",
         "Andrea 'Saantonandre' Santona",
        "",
         "OSTs COMPOSER:",
         "Tim 'GamemakerTim' Commandeur",
        "",
         "songs:",
         "'Yo, Ho, Ho! And a Bottle of Bones'",
         "'Yo, Ho, Ho! And a Bottle of Bones (alternative)'",
         "'Bone Bomber'",
        "",
        "",
         "SPECIAL THANKS",
        "",
         "To the musician:",
         "Tim Commandeur (hope we'll get to collab more!)",
        "",
         "To the most patient Alpha testers:",
         "Francesco Truddaiu",
         "Mirko Gelsomino",
         "Angelo 'Giaccio' Giaccio",
        "",
         "and thanks to you for playing till the end (?)!",
        "",
        "",
         "The entire game was made in vanilla Javascript",
         "no engine, no libraries.",
        "",
         "I, the author (saantonandre) reserve all the rights",
         "for the original assets, including art, code,",
         "and sound effects. Please do not distribute/modify without",
         "my consent.",
        ];
    }
    compute() {
        this.x = canvas.width / 2;
        this.y += this.speed * meta.deltaTime;
    }
    render() {

        c.textAlign = "center";
        c.font = this.fontSize * meta.ratio + "px" + " 'VT323'";
        //c.fillStyle = "#b86f50";
        c.fillStyle = "white";
        c.strokeStyle = "#000000";
        c.lineWidth = 2 * meta.ratio;

        let a, b = canvas.height / 2.2,
            alpha;
        for (let i = 0; i < this.texts.length; i++) {
            a = Math.abs(-this.fontSize + (this.y + i) * meta.tilesize * meta.ratio);
            if (a > b) {
                a = 0
            }
            alpha = a < b ? a / b : b / a;
            c.globalAlpha = alpha;
            c.strokeText(this.texts[i], this.x, -this.fontSize + (this.y + i) * meta.tilesize * meta.ratio);
            c.fillText(this.texts[i], this.x, -this.fontSize + (this.y + i) * meta.tilesize * meta.ratio);

        }
        c.globalAlpha = 1;
    }
}

class SkeletonBand {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.sheet = id("sheet");
        this.music = sounds.shanty_2;

        this.hitbox = {
            x: x + 0.5,
            y: y + 1,
            w: 6,
            h: 1
        }
        this.accordion = {
            x: x - 0.5,
            y: y,
            w: 2,
            h: 2,
            action: 0,
            slowness: 8,
            frame: 0,
            frameCounter: 0,
            actionX: [[31], [31, 31, 31, 31]],
            actionY: [[0], [0, 2, 4, 6]],
        }
        this.drums = {
            x: x + 1,
            y: y,
            w: 2,
            h: 2,
            action: 0,
            slowness: 8,
            frame: 0,
            frameCounter: 0,
            actionX: [[33], [33, 33, 33, 33, 33, 33]],
            actionY: [[0], [0, 2, 4, 6, 8, 10]],
        }
        this.violin = {
            x: x + 2,
            y: y - 1,
            w: 2,
            h: 3,
            action: 0,
            slowness: 8,
            frame: 0,
            frameCounter: 0,
            actionX: [[35], [35, 35, 35, 35]],
            actionY: [[0], [0, 3, 6, 9]],
        }
        this.accordion2 = {
            x: x + 3.4,
            y: y,
            w: 2,
            h: 2,
            action: 0,
            slowness: 6,
            frame: 0,
            frameCounter: 0,
            actionX: [[31], [31, 31, 31, 31]],
            actionY: [[8], [8, 10, 12, 14]],
        }
        this.flute = {
            x: x + 4.5,
            y: y,
            w: 2,
            h: 2,
            action: 0,
            slowness: 6,
            frame: 0,
            frameCounter: 0,
            actionX: [[37], [37, 37, 37, 37]],
            actionY: [[0], [0, 2, 4, 6]],
        }
        if (!sounds.shanty_1.paused) {
            sounds.shanty_1.pause();
        }
        if (!sounds.shanty_3.paused) {
            sounds.shanty_3.pause();
        }
        if (!sounds.shanty_2.paused) {
            sounds.shanty_2.pause();
        }
        this.checkedAchievements = false;

    }
    checkAchievements() {
        if (!this.checkedAchievements) {
            this.checkedAchievements = true;
            // Endgame achievements
            achievements.unlock("Mutineer");
            this.checkedAchievements = true;
            if (meta.deathCounter == 0) {
                achievements.unlock("ZERO DEATHS");
            }
            if (meta.cronometer.time <= 600) {
                achievements.unlock("Hasty Pirate");
                if (meta.cronometer.time <= 300) {
                    achievements.unlock("Fastest Skeleton");
                    if (meta.cronometer.time <= 180) {
                        achievements.unlock("Ticking Bomb");
                    }
                }
            }
        }
    }
    createPanNode() {
        this.music.audioContext = new(window.AudioContext || window.webkitAudioContext);
        this.music.source = this.music.audioContext.createMediaElementSource(this.music);
        this.music.panNode = this.music.audioContext.createStereoPanner();
        this.music.source.connect(this.music.panNode);
        this.music.panNode.connect(this.music.audioContext.destination);
    }
    explode() {
        this.music.pause();
        sounds.bandDestroyed.playy();
        this.removed = true;
        achievements.unlock("Killjoy");
        // Flute
        map.vfxs.push(new Vfx(this.flute.x + this.flute.w / 2, this.flute.y + this.flute.h / 2, 19));
        map.vfxs.push(new Vfx(this.flute.x + this.flute.w / 2, this.flute.y + this.flute.h / 2, 29));
        map.vfxs.push(new Vfx(this.flute.x + this.flute.w / 2, this.flute.y + this.flute.h / 2, 30));
        map.vfxs.push(new Vfx(this.flute.x + this.flute.w / 2, this.flute.y + this.flute.h / 2, 31));
        map.vfxs.push(new Vfx(this.flute.x + this.flute.w / 2, this.flute.y + this.flute.h / 2, 31));
        map.vfxs.push(new Vfx(this.flute.x + this.flute.w / 2, this.flute.y + this.flute.h / 2, 32));
        map.vfxs.push(new Vfx(this.flute.x + this.flute.w / 2, this.flute.y + this.flute.h / 2, 32));

        // Drums
        map.vfxs.push(new Vfx(this.drums.x + this.drums.w / 2, this.drums.y + this.drums.h / 2, 20));
        map.vfxs.push(new Vfx(this.drums.x + this.drums.w / 2, this.drums.y + this.drums.h / 2, 27));
        map.vfxs.push(new Vfx(this.drums.x + this.drums.w / 2, this.drums.y + this.drums.h / 2, 27));
        map.vfxs.push(new Vfx(this.drums.x + this.drums.w / 2, this.drums.y + this.drums.h / 2, 28));
        map.vfxs.push(new Vfx(this.drums.x + this.drums.w / 2, this.drums.y + this.drums.h / 2, 28));
        map.vfxs.push(new Vfx(this.flute.x + this.flute.w / 2, this.flute.y + this.flute.h / 2, 30));
        map.vfxs.push(new Vfx(this.flute.x + this.flute.w / 2, this.flute.y + this.flute.h / 2, 31));
        map.vfxs.push(new Vfx(this.flute.x + this.flute.w / 2, this.flute.y + this.flute.h / 2, 31));
        map.vfxs.push(new Vfx(this.flute.x + this.flute.w / 2, this.flute.y + this.flute.h / 2, 32));
        map.vfxs.push(new Vfx(this.flute.x + this.flute.w / 2, this.flute.y + this.flute.h / 2, 32));

        // Violin
        map.vfxs.push(new Vfx(this.violin.x + this.violin.w / 2, this.violin.y + this.violin.h / 2, 21));
        map.vfxs.push(new Vfx(this.violin.x + this.violin.w / 2, this.violin.y + this.violin.h / 2, 26));
        map.vfxs.push(new Vfx(this.violin.x + this.violin.w / 2, this.violin.y + this.violin.h / 2, 35));
        map.vfxs.push(new Vfx(this.violin.x + this.violin.w / 2, this.violin.y + this.violin.h / 2, 35));
        map.vfxs.push(new Vfx(this.violin.x + this.violin.w / 2, this.violin.y + this.violin.h / 2, 36));
        map.vfxs.push(new Vfx(this.violin.x + this.violin.w / 2, this.violin.y + this.violin.h / 2, 37));
        map.vfxs.push(new Vfx(this.violin.x + this.violin.w / 2, this.violin.y + this.violin.h / 2, 37));

        // Accordion
        map.vfxs.push(new Vfx(this.accordion.x + this.accordion.w / 2, this.accordion.y + this.accordion.h / 2, 22));
        map.vfxs.push(new Vfx(this.accordion.x + this.accordion.w / 2, this.accordion.y + this.accordion.h / 2, 25));
        map.vfxs.push(new Vfx(this.accordion.x + this.accordion.w / 2, this.accordion.y + this.accordion.h / 2, 34));
        map.vfxs.push(new Vfx(this.accordion.x + this.accordion.w / 2, this.accordion.y + this.accordion.h / 2, 33));
        map.vfxs.push(new Vfx(this.accordion.x + this.accordion.w / 2, this.accordion.y + this.accordion.h / 2, 33));

        // Accordion2
        map.vfxs.push(new Vfx(this.accordion.x + this.accordion.w / 2, this.accordion.y + this.accordion.h / 2, 23));
        map.vfxs.push(new Vfx(this.accordion.x + this.accordion.w / 2, this.accordion.y + this.accordion.h / 2, 24));
        map.vfxs.push(new Vfx(this.accordion.x + this.accordion.w / 2, this.accordion.y + this.accordion.h / 2, 34));
        map.vfxs.push(new Vfx(this.accordion.x + this.accordion.w / 2, this.accordion.y + this.accordion.h / 2, 33));
        map.vfxs.push(new Vfx(this.accordion.x + this.accordion.w / 2, this.accordion.y + this.accordion.h / 2, 33));






    }
    compute() {
        this.checkAchievements()
        if (!this.music.panNode) {
            this.createPanNode();
        }
        if (!sounds.shanty_1.paused) {
            sounds.shanty_1.pause();
        }
        if (!sounds.shanty_3.paused) {
            sounds.shanty_3.pause();
        }
        this.music.baseVolume = 0.9;


        let x1 = this.x + 3;
        let y1 = this.y + 1;
        let x2 = player.x + player.w / 2;
        let y2 = player.y + player.h / 2;
        let distance = Math.sqrt(Math.pow((x1 - x2), 2) + Math.pow((y1 - y2), 2));
        let volume = 0.9 - distance / 65;
        if (volume > 0 && this.music.paused) {
            this.music.playy();
            let found = false;
            for (let i = 0; i < map.foreground.length; i++) {
                if (map.foreground[i].type == "credits") {
                    found = true;
                }
            }
            if (!found) {
                map.foreground.unshift(new RollingCredits())
            }
        }
        let pan = (distance / 65) * (x1 < x2 ? -1 : 1);
        this.music.panNode.pan.setValueAtTime(pan, this.music.audioContext.currentTime);

        if (volume > 1) {
            volume = 1;
        } else if (volume < 0) {
            volume = 0;
        }
        this.music.volume = volume * meta.musicVolume;


        this.accordion.action = 0;
        this.accordion2.action = 0;
        this.drums.action = 0;
        this.violin.action = 0;
        this.flute.action = 0;
        let time = this.music.currentTime;
        if (time > 0 && time <= 66) {
            this.drums.action = 1;
        }
        if (time >= 6 && time <= 16) {
            this.accordion.action = 1;
        }
        if (time >= 27 && time <= 47) {
            this.accordion.action = 1;
        }


        if (time >= 38 && time <= 59) {
            this.accordion2.action = 1;
            this.flute.action = 1;
        }

        if (time >= 16 && time <= 27) {
            this.flute.action = 1;
        }

        if (time >= 27 && time <= 47) {
            this.violin.action = 1;
        }
        if (time >= 47 && time <= 59) {
            this.accordion2.action = 1;
        }

        for (let i = 0; i < map.vfxs.length; i++) {
            if (map.vfxs[i].type == "explosion") {
                if (map.vfxs[i].which && map.vfxs[i].frame == 1) {
                    if (collided(this, map.vfxs[i])) {
                        this.explode();
                    }
                }
            }
        }


    }
    renderMusician(musician) {
        musician.frameCounter++;
        if (musician.frameCounter >= musician.slowness / meta.deltaTime) {
            musician.frameCounter = 0;
            musician.frame++;
        }
        if (musician.frame >= musician.actionX[musician.action].length) {
            musician.frame = 0;
            musician.frameCounter = 0;
        }
        c.drawImage(
            this.sheet,
            musician.actionX[musician.action][musician.frame] * meta.tilesize,
            musician.actionY[musician.action][musician.frame] * meta.tilesize,
            musician.w * meta.tilesize,
            musician.h * meta.tilesize,
            (musician.x + map.x) * meta.tilesize * meta.ratio | 0,
            (musician.y + map.y) * meta.tilesize * meta.ratio | 0,
            musician.w * meta.tilesize * meta.ratio | 0,
            musician.h * meta.tilesize * meta.ratio | 0
        )
    }
    render() {
        this.renderMusician(this.violin);
        this.renderMusician(this.accordion);
        this.renderMusician(this.flute);
        this.renderMusician(this.drums);
        this.renderMusician(this.accordion2);
    }
}
