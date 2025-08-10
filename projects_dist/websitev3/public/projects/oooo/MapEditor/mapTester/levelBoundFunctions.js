// Variables related to the events
var eventsVariables = {
    // If you took all the photos with Esther
    tookPhotos: false,
    interactedWithBed: false,
    backHome: false
}

var currentPoint = {
    x: 0,
    y: 0,
    stage: 0,
    level: 0
}
var checkPoint = {
    stage: 0,
    level: 0,
    eventsVariables: {
        // If you took all the photos with Esther
        tookPhotos: false,
        interactedWithBed: false,
        backHome: false
    }
};
updateCheckPoint();

function backToCheckPoint() {
    currentPoint.stage = checkPoint.stage;
    currentPoint.level = checkPoint.level;
    Object.assign(eventsVariables, checkPoint.eventsVariables)
}

function updateCheckPoint() {
    checkPoint.stage = currentPoint.stage;
    checkPoint.level = currentPoint.level;
    Object.assign(checkPoint.eventsVariables, eventsVariables)
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
            dialogueEngine.loadDialogueQueue([{
                speaker: 0,
                emotion: 0,
                cameraFocus: player,
                text: "(Damn, I'm not even tired...I would have played a bit more if it wasn't for Jay)."
                        }])
            this.removed = true;
            eventsVariables.interactedWithBed = false;
            eventsVariables.backHome = true;

            function goToSleep() {
                screenShake.duration = 10;
                dialogueEngine.loadDialogueQueue([{
                    speaker: 0,
                    emotion: 1,
                    cameraFocus: player,
                    text: "W-what was that?!"
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
                emotion: 0,
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
                emotion: 0,
                cameraFocus: esther,
                text: "Been doing some SIIIIICK kickflips. My knees feels so weak now."
                        }, {
                speaker: 1,
                emotion: 0,
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
                        emotion: 0,
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
                emotion: 0,
                cameraFocus: officer,
                text: "Ok little punks. I can't watch after you the whole night, go back home right now."
                        }, {
                speaker: 1,
                emotion: 0,
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
            console.log("officer.x " + officer.x)
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
level_1.push(jaymeeAsksWhatYouDoing, meetEsther, afterPhotoshoot, jaymeeScoldsYou, afterBackHome, shouldBackHome)
stage_0.push(level_1);


// level 2 (destroyed street)
var level_2 = [];
let satelliteAppears = {
    removed: false,
    compute: function () {
        if (eventsVariables.interactedWithBed) {
            entities.push(new Boss_1(-19, -3));
            for (let i = 0; i < entities.length; i++) {
                if (entities[i].type == "interaction") {
                    entities[i].removed = true;
                }
            }
            player.onSkate = true;
            this.removed = true;
        }
    }
}

level_2.push(satelliteAppears)
stage_0.push(level_2);

// level 3 (grotto)

var level_3 = [];
// grotto events here
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
let endTest = {
    removed: false,
    compute: function () {
        if (player.x > 63) {
            alert("Finished")
            this.removed = true;
        }
    }
}


level_3.push(darkness, endTest)
stage_0.push(level_3);




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
