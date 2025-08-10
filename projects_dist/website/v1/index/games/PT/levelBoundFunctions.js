// Variables related to the events
// IMPORTANT!!! remember to update the saveCode/loadCode functions when adding properties!

class EventVariables {
    constructor() {
        this.tookPhotos = false;
        this.interactedWithBed = false;
        this.backHome = false;
        this.satelliteAppears = false;
        this.fellDown = false;
        this.aliquamSpawned = false;
        this.graffiti = false;
        this.aliquamSpeaks = false;
        this.comeForth = false;
        this.swordCollected = false;
        this.aliquamExplained = false;
    }
}
var eventsVariables = new EventVariables();

var currentPoint = {
    x: 0,
    y: 0,
    stage: 0,
    level: 0
}
var checkPoint = {
    stage: 0,
    level: 0,
    eventsVariables: new EventVariables(),
};
/* The saveCode is structured as follows:
    s + "(number)"
    l + "(number)"
    e + "(booleans)"
    
    example: "s0l3e11110"

*/
var saveCode = "";

function loadSaveCode(arg) {
    //saves a copy
    if (!arg) {
        //saveCode = getCookie("savecode");
        saveCode = window.localStorage['savecode'];
    } else {
        saveCode = arg;
    }
    let stage = "",
        s = false;
    let level = "",
        l = false;
    let events = "",
        e = false;

    for (let i = 0; i < saveCode.length; i++) {
        switch (saveCode[i]) {
            case "s":
                s = true;
                l = false;
                e = false;
                break;
            case "l":
                s = false;
                l = true;
                e = false;
                break;
            case "e":
                s = false;
                l = false;
                e = true;
                break;

            default:
                if (s) {
                    stage += saveCode[i];
                }
                if (l) {
                    level += saveCode[i];
                }
                if (e) {
                    events += saveCode[i];
                }
        }
    }
    checkPoint.stage = parseInt(stage);
    checkPoint.level = parseInt(level);

    checkPoint.eventsVariables.tookPhotos = parseInt(events[0]);
    checkPoint.eventsVariables.interactedWithBed = parseInt(events[1]);
    checkPoint.eventsVariables.backHome = parseInt(events[2]);
    checkPoint.eventsVariables.satelliteAppears = parseInt(events[3]);
    checkPoint.eventsVariables.fellDown = parseInt(events[4]);
    checkPoint.eventsVariables.aliquamSpawned = parseInt(events[5]);
    checkPoint.eventsVariables.graffiti = parseInt(events[6]);
    checkPoint.eventsVariables.aliquamSpeaks = parseInt(events[7]);
    checkPoint.eventsVariables.comeForth = parseInt(events[8]);
    checkPoint.eventsVariables.swordCollected = parseInt(events[9]);
    checkPoint.eventsVariables.aliquamExplained = parseInt(events[10]);
    console.log("loaded cookie:\n stage= " + stage, "level= " + level, "events= " + events)
    backToCheckPoint()
}

function updateSaveCode() {
    saveCode = "";
    saveCode += "s" + currentPoint.stage + "l" + currentPoint.level + "e";

    saveCode += eventsVariables.tookPhotos | 0;
    saveCode += eventsVariables.interactedWithBed | 0;
    saveCode += eventsVariables.backHome | 0;
    saveCode += eventsVariables.satelliteAppears | 0;
    saveCode += eventsVariables.fellDown | 0;
    saveCode += eventsVariables.aliquamSpawned | 0;
    saveCode += eventsVariables.graffiti | 0;
    saveCode += eventsVariables.aliquamSpeaks | 0;
    saveCode += eventsVariables.comeForth | 0;
    saveCode += eventsVariables.swordCollected | 0;
    saveCode += eventsVariables.aliquamExplained | 0;
    //setCookie("savecode", saveCode, 365);
    window.localStorage['savecode'] = saveCode;
    console.log(window.localStorage['savecode'])
    saveIcon.active = 2;
}

function backToCheckPoint() {
    currentPoint.stage = checkPoint.stage;
    currentPoint.level = checkPoint.level;
    Object.assign(eventsVariables, checkPoint.eventsVariables)
}

function updateCheckPoint() {
    checkPoint.stage = currentPoint.stage;
    checkPoint.level = currentPoint.level;
    Object.assign(checkPoint.eventsVariables, eventsVariables)
    updateSaveCode();
}
// All the level bound functions(events) will be stored here
var levelBoundFunctions = [];
var stage_0 = []
var stage_1 = []
var stage_2 = []
// level 0 (bedroom)
var level_0 = [];

let backHome = {
    removed: false,
    compute: function () {
        if (eventsVariables.tookPhotos) {
            for (let i = 0; i < levelBoundFunctions[0][1].length - 2; i++) {
                levelBoundFunctions[0][1][i].removed = true;
            }
            if (!eventsVariables.interactedWithBed) {
                dialogueEngine.loadDialogueQueue([{
                    speaker: 0,
                    emotion: 0,
                    cameraFocus: player,
                    text: "(Damn, I'm not even tired...I would have played a bit more if it wasn't for Jay)."
                        }])
            }
            this.removed = true;
            eventsVariables.interactedWithBed = false;
            eventsVariables.backHome = true;

            function goToSleep() {
                screenShake.duration = 10;
                dialogueEngine.loadDialogueQueue([{
                    speaker: 0,
                    emotion: 0,
                    cameraFocus: player,
                    text: "What was that?!"
                        }])
                eventsVariables.interactedWithBed = true;
            }
            entities.push(new Interaction(15, 10, goToSleep, false));
        }
    }
}
let earthquake = {
    removed: false,
    compute: function () {
        if (eventsVariables.interactedWithBed) {
            setTimeout(function () {
                screenShake.duration = 10
            }, 500)
            setTimeout(function () {
                screenShake.duration = 20
            }, 1500)
            setTimeout(function () {
                screenShake.duration = 30
            }, 3000)
            this.removed = true;
        }
    }
}
level_0.push(backHome, earthquake)
stage_0.push(level_0);
// level 1 (street)
var level_1 = [];
//Jaymee scolds you for being out that late at night
let jaymeeAsksWhatYouDoing = {
    removed: false,
    compute: function () {
        if (collided(officer, player)) {
            dialogueEngine.loadDialogueQueue([{
                speaker: 2,
                emotion: 1,
                cameraFocus: officer,
                text: "Beck. Not again. Where you think you're going?"
                        }, {
                speaker: 0,
                emotion: 1,
                text: "O- officer Jaymee"
                        }, {
                speaker: 0,
                emotion: 0,
                text: "I gotta get back the skateboard I lent to Esther, he's waiting just ahead..."
                        }, {
                speaker: 2,
                emotion: 0,
                cameraFocus: officer,
                text: "...fine. I'll see you there within two minutes, or you'll be in trouble this time."
                        }])
            this.removed = true;
        }
    }
}
let meetEsther = {
    removed: false,
    compute: function () {
        function getYourSkate() {
            dialogueEngine.loadDialogueQueue([{
                speaker: 1,
                emotion: 0,
                cameraFocus: esther,
                text: "Hey Beck, here's your skate"
                        }, {
                speaker: 0,
                emotion: 0,
                cameraFocus: player,
                text: "Yo Esther, how's going"
                        }, {
                speaker: 1,
                emotion: 2,
                cameraFocus: esther,
                text: "Been doing some SIIIIICK kickflips. My knees feels so weak now."
                        }, {
                speaker: 1,
                emotion: 1,
                cameraFocus: esther,
                text: "Oh! I've almost forgot... I've got a new camera!!!"
                        }, {
                speaker: 0,
                emotion: 3,
                cameraFocus: player,
                text: "Wooow! that looks so professional!"
                        }, {
                speaker: 1,
                emotion: 0,
                cameraFocus: esther,
                text: "Heh. I've spent all my savings. I'd want to try it now, wanna make some photoshoots? "
                }, {
                speaker: 0,
                emotion: 3,
                cameraFocus: player,
                text: "YEAH!!!"
                        }, {
                speaker: 1,
                emotion: 0,
                cameraFocus: esther,
                text: "Ok then, go ahead. I'll be right behind you, make sure to land your craaaziest tricks!"
                }, ])
            player.onSkate = true;
            player.xVel = 0;

            function goOn() {
                if (eventsVariables.tookPhotos) {
                    dialogueEngine.loadDialogueQueue([{
                        speaker: 0,
                        emotion: 3,
                        cameraFocus: esther,
                        text: "Can I take a look at the photos?",
                        }, {
                        speaker: 1,
                        emotion: 1,
                        cameraFocus: esther,
                        text: "Yeah, aren't those the most EPIC pics?",
                        }, {
                        speaker: 0,
                        emotion: 1,
                        cameraFocus: esther,
                        text: "(They look way too pixelated)",
                        }, ])
                    this.removed = true;
                } else {
                    dialogueEngine.loadDialogueQueue([{
                        speaker: 1,
                        emotion: 0,
                        cameraFocus: esther,
                        text: "Go on, this camera roll can hold a lot of pics!",
                        }])
                }
            }
            entities.push(new Interaction(esther.x, esther.y - 1, goOn, true));

        }
        entities.push(new Interaction(esther.x, esther.y - 1, getYourSkate, false));
        this.removed = true;

    }

}
let afterPhotoshoot = {
    removed: false,
    compute: function () {
        if (eventsVariables.tookPhotos) {
            dialogueEngine.loadDialogueQueue([{
                speaker: 1,
                emotion: 0,
                cameraFocus: esther,
                text: "That's enough Beck! my camera's internal storage is full"
                        }])
            this.removed = true;
            slowMoFrames = 0;
            officer.x = esther.x + 2;
        }
    }
}
let jaymeeScoldsYou = {
    removed: false,
    compute: function () {
        if (eventsVariables.tookPhotos && collided(officer, player)) {
            dialogueEngine.loadDialogueQueue([{
                speaker: 2,
                emotion: 1,
                cameraFocus: officer,
                text: "Ok little punks. I can't watch after you the whole night, go back home right now."
                        }, {
                speaker: 1,
                emotion: 1,
                cameraFocus: esther,
                text: "Sure officer!"
                        }, {
                speaker: 0,
                emotion: 0,
                cameraFocus: player,
                text: "...sure"
                        }])
            this.removed = true;
            player.onSkate = false;
        }
    }
}
let afterBackHome = {
    removed: false,
    compute: function () {
        if (eventsVariables.backHome) {
            officer.x = -100;
            esther.x = -100;
            this.removed = true;
        }
    }
}
let shouldBackHome = {
    removed: false,
    compute: function () {
        if (eventsVariables.backHome && player.x > 10) {
            dialogueEngine.loadDialogueQueue([{
                speaker: 0,
                emotion: 0,
                cameraFocus: player,
                text: "(I should go back home and try to sleep)"
                        }, ])
            this.removed = true;
        }
    }
}
let interactWithGraffiti = {
    removed: false,
    compute: function () {
        if (eventsVariables.graffiti) {
            this.removed = true;
            return;
        }

        function spray() {
            dialogueEngine.loadDialogueQueue([{
                speaker: 0,
                emotion: 2,
                cameraFocus: player,
                text: "Grrr.. how dare these bullies-",
                        }, {
                speaker: 0,
                emotion: 0,
                cameraFocus: player,
                text: "Fine, I'll figure out a clever comeback.",
                        }, ])
            this.removed = true;
            eventsVariables.graffiti = true;
        }
        entities.push(new Interaction(93, 11, spray, true));
        this.removed = true;
    }
}
let graffiti = {
    removed: false,
    compute: function () {
        if (eventsVariables.graffiti && !dialogueEngine.active) {
            vfxs.push({
                solid: false,
                sheet: id("sheet"),
                compute: function () {},
                render: function () {
                    c.drawImage(
                        this.sheet,
                        1 * GLOBAL.tilesize,
                        21 * GLOBAL.tilesize,
                        1 * GLOBAL.tilesize,
                        1 * GLOBAL.tilesize,
                        ((94 + map.x) * GLOBAL.tilesize * GLOBAL.ratio),
                        ((11 + map.y) * GLOBAL.tilesize * GLOBAL.ratio),
                        (1 * GLOBAL.tilesize * GLOBAL.ratio),
                        (1 * GLOBAL.tilesize * GLOBAL.ratio)
                    )
                },
            })
            this.removed = true;
        }
    }
}
level_1.push(jaymeeAsksWhatYouDoing, meetEsther, afterPhotoshoot, jaymeeScoldsYou, afterBackHome, shouldBackHome, graffiti, interactWithGraffiti)
stage_0.push(level_1);


// level 2 (destroyed street)
var level_2 = [];
let satelliteAppears = {
    removed: false,
    compute: function () {
        if (eventsVariables.satelliteAppears && !dialogueEngine.active) {
            entities.push(new Boss_1(-21, -3));
            player.onSkate = true;
            this.removed = true;
        }
    }
}
let checkDisaster = {
    removed: false,
    compute: function () {
        if (eventsVariables.interactedWithBed) {
            for (let i = 0; i < entities.length; i++) {
                if (entities[i].type == "interaction") {
                    entities[i].removed = true;
                }
            }
            dialogueEngine.loadDialogueQueue([{
                speaker: 0,
                emotion: 4,
                cameraFocus: player,
                text: "W-what in hell is happening..."
                        }, ])
            screenShake.duration = 10;
            eventsVariables.satelliteAppears = true;
            this.removed = true;
        }
    }
}

let graffiti2 = {
    removed: false,
    compute: function () {
        if (eventsVariables.graffiti) {
            vfxs.push({
                solid: false,
                sheet: id("sheet"),
                compute: function () {},
                render: function () {
                    c.drawImage(
                        this.sheet,
                        1 * GLOBAL.tilesize,
                        21 * GLOBAL.tilesize,
                        1 * GLOBAL.tilesize,
                        1 * GLOBAL.tilesize,
                        ((110 + map.x) * GLOBAL.tilesize * GLOBAL.ratio),
                        ((13 + map.y) * GLOBAL.tilesize * GLOBAL.ratio),
                        (1 * GLOBAL.tilesize * GLOBAL.ratio),
                        (1 * GLOBAL.tilesize * GLOBAL.ratio)
                    )
                },
            })
            this.removed = true;

        }
    }
}
level_2.push(checkDisaster, satelliteAppears, graffiti2)
stage_0.push(level_2);

// level 3 (grotto entrance)

var level_3 = [];

let fellDown = {
    removed: false,
    compute: function () {
        if (!eventsVariables.fellDown) {
            blackScreen.current = 200;
            blackScreen.initial = 100;
            player.onSkate = false;
            setTimeout(function () {
                dialogueEngine.loadDialogueQueue([{
                    speaker: 0,
                    emotion: 1,
                    text: "(I managed to run away from.. what even wAS THAT)",
                }, {
                    speaker: 0,
                    emotion: 2,
                    text: "(Now I need to find a way out there... Esther... Jay better have took him to safety!)",
                }])
            }, 2000)
            eventsVariables.fellDown = true;
            this.removed = true;
        }
    }
}

level_3.push(fellDown)
stage_0.push(level_3);

// level 4 (grotto 1)
var level_4 = [];
let darkness = {
    removed: false,
    compute: function () {
        //blackScreen.current = 200;
        //blackScreen.initial = 100;
        player.onSkate = false;
        player.armed = true;
        this.removed = true;
        entities.push(new Bat(19, 12))
        entities.push(new Bat(49, 10))
    }
}


level_4.push(darkness)

stage_0.push(level_4);


// level 5 (grotto Aliquam)
var level_5 = [];
/*
{
                    x: 48,
                    y: 4,
                    w: 1,
                    h: 11,
                    type: 0
            }, 

*/
let wallBlock = {
    removed: false,
    hitbox: {
        x: 48,
        y: 4,
        w: 1,
        h: 11
    },
    compute: function () {
        if (eventsVariables.swordCollected) {
            this.removed = true;
        }
        if (collided(this.hitbox, player)) {
            player.x -= player.xVel;
            if (eventsVariables.comeForth) {
                dialogueEngine.loadDialogueQueue([{
                    speaker: 0,
                    emotion: 0,
                    cameraFocus: player,
                    text: "(I should probably take that sword with me)"
                        }, ])
            }
        }
    }
}
let aliquamSpawns = {
    removed: false,
    compute: function () {
        if (!eventsVariables.aliquamSpawned) {
            entities.push(new Aliquam(0, 14 + 2));
            aliquam = entities[entities.length - 1];
            dialogueEngine.loadDialogueQueue([{
                speaker: 5,
                emotion: 0,
                cameraFocus: aliquam,
                text: "....ghrrr..."
                        }, {
                speaker: 0,
                emotion: 4,
                cameraFocus: player,
                text: "(First that giant robot, now a dragon... I'll need to let that sink in and stay collected)"
                        }, {
                speaker: 0,
                emotion: 2,
                cameraFocus: player,
                text: "(I've already fought many lizard and geckos with Esther anyway)"
                        }, {
                speaker: 5,
                emotion: 2,
                cameraFocus: aliquam,
                text: "GGGRUUUUAAHHHAGHHHHHHHHHH"
                        }, ])
            screenShake.duration = 50;
            this.removed = true;
            player.armed = true;
            player.x = 15;
        }
    }
}

let aliquamSpeaks = {
    removed: false,
    compute: function () {
        if (eventsVariables.aliquamSpeaks && !eventsVariables.comeForth) {
            screenShake.duration = 50;
            eventsVariables.comeForth = true;
            entities.push(new InteractiveSword(aliquam.x + aliquam.jaw.x, aliquam.y + aliquam.jaw.x));
            dialogueEngine.loadDialogueQueue([{
                speaker: 5,
                emotion: 1,
                cameraFocus: entities[entities.length - 1],
                text: "*cough*...*cough*"
                        }, {
                speaker: 0,
                emotion: 3,
                cameraFocus: player,
                text: "(Woah did I actually... beat that down?!)"
                        }, {
                speaker: 0,
                emotion: 2,
                cameraFocus: player,
                text: "so... Do you need more, DUMMY-snake?"
                        }, {
                speaker: 5,
                emotion: 0,
                cameraFocus: aliquam,
                text: "No, bawbling creature. I have to expresseth many thanks, for that I can now breath freely."
                        }, {
                speaker: 0,
                emotion: 1,
                cameraFocus: player,
                text: "(is it... speaking?)"
                        }, {
                speaker: 5,
                emotion: 1,
                cameraFocus: aliquam,
                text: "You seeth, I've eaten some magic sword by mistaketh, and I'm indigest of such."
                        }, {
                speaker: 0,
                emotion: 0,
                cameraFocus: player,
                text: "Magic swords. Random giant treaths spawning around my neighbourhood. That's nonsense."
                        }, {
                speaker: 0,
                emotion: 2,
                cameraFocus: player,
                text: "Now just restore everything as it was! I want to wake up from this weird nightmare!!"
                        }, {
                speaker: 5,
                emotion: 1,
                cameraFocus: aliquam,
                text: "I'm very astonished myself. You seeth, I'd liketh to restore mine world too."
                        }, {
                speaker: 5,
                emotion: 0,
                cameraFocus: aliquam,
                text: "Thy weaponry is ridiculous. That sword'll make for better equipment, take it and come forth."
            }, ])
            this.removed = true;
            aliquam.moveBack = true;
        }
    }
}
level_5.push(aliquamSpawns, aliquamSpeaks, wallBlock)
stage_0.push(level_5);

// level 6 (grotto Aliquam 2)
var level_6 = [];



let aliquamExplains = {
    removed: false,
    compute: function () {
        if (eventsVariables.aliquamExplained) {
            this.removed = true;
        }
        eventsVariables.aliquamExplained = true;
        entities.push(new Aliquam(0, 14 + 2));
        aliquam = entities[entities.length - 1];
        aliquam.aggro = false;
        dialogueEngine.loadDialogueQueue([{
            speaker: 0,
            emotion: 1,
            cameraFocus: player,
            text: "(what is that flashy thing?)"
                        }, {
            speaker: 5,
            emotion: 1,
            cameraFocus: aliquam,
            text: "Let me introduce myself. Mine name is ALIQUAM, I cometh from the reign of the flying lands."
                        }, {
            speaker: 0,
            emotion: 0,
            cameraFocus: player,
            text: "I see, you're not from this city and you speak weird. I guess you're like... australian?"
                        }, {
            speaker: 5,
            emotion: 0,
            cameraFocus: aliquam,
            text: "Thy world may describe me as such, yet mine folks call me 'dragon'"
                        }, {
            speaker: 0,
            emotion: 2,
            cameraFocus: player,
            text: "Enough talking Alalaq, just tell what do I have to do to.. fix this situation?"
                        }, {
            speaker: 5,
            emotion: 0,
            cameraFocus: aliquam,
            text: "I bethink thee did get t wrong. I'm not responsible of all of this, and I don't even knoweth much."
                        }, {
            speaker: 5,
            emotion: 0,
            cameraFocus: aliquam,
            text: "I was just flying 'round and somehow this same portal hath appeared in front of me."
                        }, {
            speaker: 5,
            emotion: 1,
            cameraFocus: aliquam,
            text: "As thee can seeth it kind of shrunk, so I can't fiteth in anymore. But thee, bawbling thing..."
                        }, {
            speaker: 0,
            emotion: 2,
            cameraFocus: player,
            text: "You want me to go to your place and do what exactly? can't you see the situation -I'm- in?"
                        }, {
            speaker: 5,
            emotion: 1,
            cameraFocus: aliquam,
            text: "Tell mine own mate I'm fine. She shal holp thee towards thy objective."
                        }, {
            speaker: 5,
            emotion: 0,
            cameraFocus: aliquam,
            text: "I sense that someone's responsible of all yond's happening, thee wilt find those folk."
                        }, {
            speaker: 5,
            emotion: 0,
            cameraFocus: aliquam,
            text: "If it be true there's a way out of thy situation, this might be thy besteth bet."
                        }, ])
        this.removed = true;
        player.armed = true;
        sword.currentSword = 1;
        sword.switchSword();
    }
}



level_6.push(aliquamExplains)
stage_0.push(level_6);

levelBoundFunctions.push(stage_0)
levelBoundFunctions.push(stage_1)
levelBoundFunctions.push(stage_2)

function resetEvents() {
    // iterates stages
    for (let i = 0; i < levelBoundFunctions.length; i++) {
        // iterates levels
        for (let j = 0; j < levelBoundFunctions[i].length; j++) {
            // iterates events
            for (let k = 0; k < levelBoundFunctions[i][j].length; k++) {
                levelBoundFunctions[i][j][k].removed = false;
            }
        }
    }
}
