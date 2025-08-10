var stages = [];
class GameBlueprint {
    constructor() {
        this.stages = [];
        this.stage_0 = [];
        // S0 L0 (bedroom)
        this.stage_0.push({
            map: [{
                x: 8,
                y: 11,
                w: 14,
                h: 2,
                type: 0
    }, {
                x: 22,
                y: 6,
                w: 3,
                h: 8,
                type: 0
    }, {
                x: 6,
                y: 5,
                w: 2,
                h: 9,
                type: 0
    }, {
                x: 4,
                y: 4,
                w: 21,
                h: 2,
                type: 0
    }, {
                x: 12,
                y: 9,
                w: 1,
                h: 1,
                type: 6,
                event: function () {
                    /**/
                    if (!eventsVariables.tookPhotos) {
                        dialogueEngine.loadDialogueQueue([{
                            speaker: 0,
                            emotion: 0,
                            text: "(No need to turn off the pc, it'll be just few minutes until I'll be back.)",
            }])
                    } else {
                        dialogueEngine.loadDialogueQueue([{
                            speaker: 0,
                            emotion: 0,
                            text: "(It's not the right moment to play videogames!)",
            }])
                    }
                    /**/
                },
                repeatable: true,
    }, {
                x: 21,
                y: 9,
                w: 1,
                h: 1,
                type: 6,
                repeatable: true,
                event: function () {
                    sounds.door.playy();
                    unload();
                    // Sets the level where you're going to
                    if (eventsVariables.interactedWithBed) {
                        currentPoint.level = 2;
                    } else {
                        currentPoint.level = 1;

                    }
                    // Calls the load function at the end of the loop
                    load()
                },
    }, ],
            spawnPoint: {
                x: 16,
                y: 10
            },
            camBoxes: [],
            levelImage: id("level-0"),
            background: 0,
            entities: [],
            id: "bedroom",
        })

        /// S0 L1 (street)
        this.stage_0.push({
            map: [{
                x: 0,
                y: 14,
                w: 100,
                h: 4,
                type: 0
    }, {
                x: 27,
                y: 13,
                w: 1,
                h: 1,
                type: 0
    }, {
                x: -1,
                y: 0,
                w: 1,
                h: 30,
                type: 0
    }, {
                x: 29,
                y: 13,
                w: 71,
                h: 1,
                type: 0
    }, {
                x: 0,
                y: 10,
                w: 1,
                h: 4,
                type: 0
    }, {
                x: 1,
                y: 11,
                w: 1,
                h: 3,
                type: 0
    }, {
                x: 2,
                y: 13,
                w: 1,
                h: 1,
                type: 0
    }, {
                x: 42,
                y: 12,
                w: 4,
                h: 1,
                type: 0
    }, {
                x: 41,
                y: 9,
                w: 6,
                h: 1,
                type: 0
    }, {
                x: 57,
                y: 11,
                w: 2,
                h: 2,
                type: 0
    }, {
                x: 29,
                y: 12,
                w: 5,
                h: 1,
                type: 0
    }, {
                x: 13,
                y: 13,
                w: 1,
                h: 1,
                type: 0
    }, {
                x: 18,
                y: 12,
                w: 1,
                h: 1,
                type: 7
    }, {
                x: 39,
                y: 12,
                w: 1,
                h: 1,
                type: 8
    }, {
                x: 6,
                y: 12,
                w: 1,
                h: 1,
                type: 6,
                repeatable: true,
                event: function () {
                    sounds.door.playy();
                    currentPoint.level = 0;
                    load();
                    updateCheckPoint();
                },
    }, {
                x: 1,
                y: 12,
                w: 1,
                h: 1,
                type: 6,
                event: function () {
                    dialogueEngine.loadDialogueQueue([{
                        speaker: 0,
                        emotion: 0,
                        text: "What a mess... the sidewalk is blocked because of all those boxes",
            }])
                },
    }, {
                x: 23,
                y: 13,
                w: 4,
                h: 1,
                type: 0
    }, {
                x: 24,
                y: 12,
                w: 2,
                h: 1,
                type: 0
    }, {
                x: 51,
                y: 11,
                w: 1,
                h: 1,
                type: 9
    }, {
                x: 99,
                y: 0,
                w: 1,
                h: 20,
                type: 0
    }, {
                x: 45,
                y: 13,
                w: 54,
                h: 7,
                type: 0
    }, {
                x: 84,
                y: 11,
                w: 1,
                h: 2,
                type: 0
    }, {
                x: 85,
                y: 10,
                w: 1,
                h: 3,
                type: 0
    }, {
                x: 87,
                y: 12,
                w: 4,
                h: 1,
                type: 0
    }, {
                x: 86,
                y: 9,
                w: 6,
                h: 1,
                type: 0
    }, {
                x: 97,
                y: 10,
                w: 2,
                h: 3,
                type: 0
    }, {
                x: 98,
                y: 9,
                w: 1,
                h: 1,
                type: 0
    }, {
                x: 64,
                y: 12,
                w: 4,
                h: 1,
                type: 0
    }, {
                x: 59,
                y: 12,
                w: 1,
                h: 1,
                type: 3
    }, {
                x: 68,
                y: 12,
                w: 1,
                h: 1,
                type: 3
    }, {
                x: 78,
                y: 12,
                w: 1,
                h: 1,
                type: 3
    }, {
                x: 79,
                y: 12,
                w: 1,
                h: 1,
                type: 3
    }, {
                x: 95,
                y: 12,
                w: 1,
                h: 1,
                type: 3
    }, {
                x: 59,
                y: 11,
                w: 1,
                h: 1,
                type: 4
    }, {
                x: 64,
                y: 11,
                w: 1,
                h: 1,
                type: 4
    }, {
                x: 73,
                y: 9,
                w: 1,
                h: 1,
                type: 4
    }, {
                x: 78,
                y: 7,
                w: 1,
                h: 1,
                type: 4
    }, {
                x: 79,
                y: 11,
                w: 1,
                h: 1,
                type: 4
    }, {
                x: 88,
                y: 11,
                w: 1,
                h: 1,
                type: 4
    }, {
                x: 89,
                y: 6,
                w: 1,
                h: 1,
                type: 4
    }, {
                x: 96,
                y: 8,
                w: 1,
                h: 1,
                type: 4
    }, {
                x: 75,
                y: 6,
                w: 1,
                h: 1,
                type: 4
    }, {
                x: 85,
                y: 5,
                w: 1,
                h: 1,
                type: 4
    }, {
                x: 91,
                y: 5,
                w: 1,
                h: 1,
                type: 4
    }, ],
            spawnPoint: {
                x: 6,
                y: 13
            },
            camBoxes: [],
            levelImage: id("level-1"),
            background: id("city-bg"),
            entities: [],
            id: "street",
        })

        /// S0 L2 (street ruins)
        this.stage_0.push({
            map: [{
                x: 6,
                y: 14,
                w: 18,
                h: 11,
                type: 0
            }, {
                x: 11,
                y: 10,
                w: 1,
                h: 4,
                type: 0
            }, {
                x: 12,
                y: 11,
                w: 1,
                h: 3,
                type: 0
            }, {
                x: 13,
                y: 13,
                w: 1,
                h: 1,
                type: 0
            }, {
                x: 23,
                y: 13,
                w: 1,
                h: 1,
                type: 0
            }, {
                x: 25,
                y: 14,
                w: 14,
                h: 11,
                type: 0
            }, {
                x: 42,
                y: 16,
                w: 29,
                h: 9,
                type: 0
            }, {
                x: 43,
                y: 15,
                w: 28,
                h: 1,
                type: 0
            }, {
                x: 45,
                y: 14,
                w: 4,
                h: 1,
                type: 0
            }, {
                x: 56,
                y: 11,
                w: 6,
                h: 1,
                type: 0
            }, {
                x: 57,
                y: 14,
                w: 4,
                h: 1,
                type: 0
            }, {
                x: 36,
                y: 12,
                w: 3,
                h: 2,
                type: 0
            }, {
                x: 35,
                y: 13,
                w: 1,
                h: 1,
                type: 0
            }, {
                x: 73,
                y: 14,
                w: 2,
                h: 2,
                type: 0
            }, {
                x: 73,
                y: 16,
                w: 54,
                h: 9,
                type: 0
            }, {
                x: 99,
                y: 15,
                w: 28,
                h: 1,
                type: 0
            }, {
                x: 125,
                y: 14,
                w: 2,
                h: 1,
                type: 0
            }, {
                x: 113,
                y: 12,
                w: 2,
                h: 3,
                type: 0
            }, {
                x: 114,
                y: 11,
                w: 1,
                h: 1,
                type: 0
            }, {
                x: 102,
                y: 11,
                w: 6,
                h: 1,
                type: 0
            }, {
                x: 103,
                y: 14,
                w: 4,
                h: 1,
                type: 0
            }, {
                x: 101,
                y: 12,
                w: 1,
                h: 3,
                type: 0
            }, {
                x: 100,
                y: 13,
                w: 1,
                h: 2,
                type: 0
            }, {
                x: 128,
                y: 10,
                w: 2,
                h: 15,
                type: 0
            }, {
                x: 132,
                y: 13,
                w: 3,
                h: 12,
                type: 0
            }, {
                x: 136,
                y: 14,
                w: 6,
                h: 11,
                type: 0
            }, {
                x: 143,
                y: 15,
                w: 4,
                h: 10,
                type: 0
            }, {
                x: 149,
                y: 13,
                w: 6,
                h: 1,
                type: 0
            }, {
                x: 150,
                y: 16,
                w: 4,
                h: 1,
                type: 0
            }, {
                x: 149,
                y: 17,
                w: 9,
                h: 8,
                type: 0
            }, {
                x: 160,
                y: 17,
                w: 4,
                h: 8,
                type: 0
            }, {
                x: 165,
                y: 14,
                w: 12,
                h: 11,
                type: 0
            }, {
                x: 177,
                y: 16,
                w: 3,
                h: 9,
                type: 0
            }, {
                x: 186,
                y: 15,
                w: 13,
                h: 10,
                type: 0
            }, {
                x: 189,
                y: 13,
                w: 10,
                h: 2,
                type: 0
            }, {
                x: 189,
                y: 12,
                w: 4,
                h: 1,
                type: 0
            }, {
                x: 190,
                y: 11,
                w: 2,
                h: 1,
                type: 0
            }, {
                x: 191,
                y: 10,
                w: 1,
                h: 1,
                type: 0
            }, {
                x: 177,
                y: 14,
                w: 2,
                h: 2,
                type: 0
            }, {
                x: 80,
                y: 15,
                w: 4,
                h: 1,
                type: 0
            }, {
                x: 75,
                y: 15,
                w: 1,
                h: 1,
                type: 3
            }, {
                x: 85,
                y: 15,
                w: 1,
                h: 1,
                type: 3
            }, {
                x: 97,
                y: 15,
                w: 1,
                h: 1,
                type: 3
            }, {
                x: 98,
                y: 15,
                w: 1,
                h: 1,
                type: 3
            }, {
                x: 111,
                y: 14,
                w: 1,
                h: 1,
                type: 3
            }, {
                x: 112,
                y: 14,
                w: 1,
                h: 1,
                type: 3
            }, {
                x: 125,
                y: 13,
                w: 1,
                h: 1,
                type: 3
            }, {
                x: 126,
                y: 13,
                w: 1,
                h: 1,
                type: 3
            }, {
                x: 162,
                y: 16,
                w: 1,
                h: 1,
                type: 3
            }, {
                x: 163,
                y: 16,
                w: 1,
                h: 1,
                type: 3
            }, {
                x: 163,
                y: 16,
                w: 1,
                h: 1,
                type: 3
            }, {
                x: 0,
                y: 20,
                w: 165,
                h: 4,
                type: 10,
                event: function () {
                    slowMoFrames = 60;
                    player.explode();
                },
    }, {
                x: 180,
                y: 18,
                w: 6,
                h: 4,
                type: 10,
                event: function () {
                    slowMoFrames = 30;
                    setTimeout(function () {
                        currentPoint.level = 3;
                        updateCheckPoint();
                        load();
                    }, 5000)
                },
                repeatable: false
    }, ],
            spawnPoint: {
                x: 17,
                y: 13
            },
            biome: 1,
            camBoxes: [],
            levelImage: id("level-2"),
            background: id("city-bg-2"),
            id: "streetRuins",
        })

        // S0 L3 (grotto-0)
        this.stage_0.push({
            map: [{
                x: 15,
                y: 12,
                w: 1,
                h: 1,
                type: 6,
                event: function () {
                    /**/
                    dialogueEngine.loadDialogueQueue([{
                        speaker: 0,
                        emotion: 0,
                        text: "(It looks like my skateboard is broken. Might as well use it to break through there)",
                    }])
                    /**/
                },
                repeatable: false,
    }, {
                x: 0,
                y: 14,
                w: 30,
                h: 5,
                type: 0
            }, {
                x: 20,
                y: 13,
                w: 10,
                h: 1,
                type: 0
            }, {
                x: 24,
                y: 12,
                w: 6,
                h: 1,
                type: 0
            }, {
                x: 12,
                y: 0,
                w: 18,
                h: 9,
                type: 0
            }, {
                x: 13,
                y: 9,
                w: 17,
                h: 1,
                type: 0
            }, {
                x: 14,
                y: 10,
                w: 4,
                h: 2,
                type: 0
            }, {
                x: 18,
                y: 10,
                w: 1,
                h: 1,
                type: 0
            }, {
                x: 0,
                y: 0,
                w: 4,
                h: 14,
                type: 0
            }, {
                x: 4,
                y: 0,
                w: 1,
                h: 10,
                type: 0
            }, {
                x: 5,
                y: 0,
                w: 1,
                h: 9,
                type: 0
            }, {
                x: 15,
                y: 12,
                w: 1,
                h: 1,
                type: 11
            }, {
                x: 15,
                y: 13,
                w: 1,
                h: 1,
                type: 11
            }, {
                x: 16,
                y: 12,
                w: 1,
                h: 1,
                type: 11
            }, {
                x: 16,
                y: 13,
                w: 1,
                h: 1,
                type: 11
            }, {
                x: 5,
                y: 13,
                w: 1,
                h: 1,
                type: 12
            }, {
                x: 30,
                y: 10,
                w: 1,
                h: 2,
                type: 10,
                event: function () {
                    unload();
                    currentPoint.level = 4;
                    updateCheckPoint();
                    load();
                },
                repeatable: true
            }, ],
            spawnPoint: {
                x: 9,
                y: 13
            },
            biome: 1,
            camBoxes: [],
            levelImage: id("level-3"),
            background: id("grotto-bg"),
            id: "grottoEntrance",
        })
        // S0 L4 (grotto-1)
        this.stage_0.push({
            map: [{
                x: 60,
                y: 5,
                w: 1,
                h: 1,
                type: 9
            }, {
                x: 56,
                y: 11,
                w: 1,
                h: 1,
                type: 0
            }, {
                x: 0,
                y: 14,
                w: 28,
                h: 5,
                type: 0
            }, {
                x: 28,
                y: 16,
                w: 5,
                h: 3,
                type: 0
            }, {
                x: 33,
                y: 14,
                w: 15,
                h: 5,
                type: 0
            }, {
                x: 21,
                y: 13,
                w: 1,
                h: 1,
                type: 0
            }, {
                x: 30,
                y: 14,
                w: 2,
                h: 1,
                type: 0
            }, {
                x: 36,
                y: 12,
                w: 2,
                h: 1,
                type: 0
            }, {
                x: 39,
                y: 13,
                w: 1,
                h: 1,
                type: 0
            }, {
                x: 40,
                y: 11,
                w: 2,
                h: 1,
                type: 0
            }, {
                x: 45,
                y: 12,
                w: 1,
                h: 1,
                type: 0
            }, {
                x: 50,
                y: 13,
                w: 1,
                h: 2,
                type: 0
            }, {
                x: 48,
                y: 15,
                w: 16,
                h: 4,
                type: 0
            }, {
                x: 55,
                y: 13,
                w: 9,
                h: 2,
                type: 0
            }, {
                x: 57,
                y: 11,
                w: 7,
                h: 2,
                type: 0
            }, {
                x: 58,
                y: 10,
                w: 6,
                h: 1,
                type: 0
            }, {
                x: 53,
                y: 12,
                w: 3,
                h: 1,
                type: 0
            }, {
                x: 55,
                y: 11,
                w: 1,
                h: 1,
                type: 0
            }, {
                x: 56,
                y: 9,
                w: 1,
                h: 1,
                type: 0
            }, {
                x: 54,
                y: 8,
                w: 1,
                h: 1,
                type: 0
            }, {
                x: 56,
                y: 7,
                w: 1,
                h: 1,
                type: 0
            }, {
                x: 58,
                y: 7,
                w: 4,
                h: 1,
                type: 0
            }, {
                x: 62,
                y: 0,
                w: 2,
                h: 8,
                type: 0
            }, {
                x: 0,
                y: 0,
                w: 44,
                h: 4,
                type: 0
            }, {
                x: 44,
                y: 0,
                w: 18,
                h: 4,
                type: 0
            }, {
                x: 0,
                y: 4,
                w: 16,
                h: 5,
                type: 0
            }, {
                x: 16,
                y: 4,
                w: 4,
                h: 1,
                type: 0
            }, {
                x: 0,
                y: 9,
                w: 4,
                h: 3,
                type: 0
            }, {
                x: 4,
                y: 9,
                w: 1,
                h: 1,
                type: 0
            }, {
                x: 23,
                y: 13,
                w: 1,
                h: 1,
                type: 1
            }, {
                x: 14,
                y: 13,
                w: 1,
                h: 1,
                type: 1
            }, {
                x: 26,
                y: 13,
                w: 1,
                h: 1,
                type: 1
            }, {
                x: 28,
                y: 15,
                w: 5,
                h: 1,
                type: 1
            }, {
                x: 40,
                y: 13,
                w: 7,
                h: 1,
                type: 1
            }, {
                x: 48,
                y: 14,
                w: 2,
                h: 1,
                type: 1
            }, {
                x: 51,
                y: 14,
                w: 4,
                h: 1,
                type: 1
            }, {
                x: 56,
                y: 12,
                w: 1,
                h: 1,
                type: 1
            }, {
                x: 54,
                y: 11,
                w: 1,
                h: 1,
                type: 1
            }, {
                x: 4,
                y: 0,
                w: 1,
                h: 1,
                type: 0
            }, {
                x: 44,
                y: 12,
                w: 1,
                h: 1,
                type: 0
            }, {
                x: -1,
                y: 12,
                w: 1,
                h: 2,
                type: 10,
                event: function () {
                    unload();
                    currentPoint.level = 3;
                    updateCheckPoint();
                    load();
                },
                repeatable: true
    }, {
                x: 11,
                y: 12,
                w: 1,
                h: 1,
                type: 6,
                event: function () {
                    dialogueEngine.loadDialogueQueue([{
                        speaker: 0,
                        emotion: 0,
                        text: "This grotto is so dark that I can just barely see... there are spikes on the floor, and... ",
            }, {
                        speaker: 0,
                        emotion: 4,
                        text: "...bats",
            }, ])
                },
    }, {
                x: 64,
                y: 8,
                w: 1,
                h: 2,
                type: 10,
                event: function () {
                    unload();
                    currentPoint.level = 5;
                    updateCheckPoint();
                    load();
                },
                repeatable: true
            }, ],
            spawnPoint: {
                x: 1,
                y: 13
            },
            biome: 1,
            camBoxes: [],
            levelImage: id("level-4"),
            background: id("grotto-bg"),
            id: "grotto",
        })

        // S0 L5 (grotto-2)
        this.stage_0.push({
            map: [{
                    x: 14,
                    y: 13,
                    w: 1,
                    h: 1,
                    type: 0
                }, {
                    x: 16,
                    y: 12,
                    w: 1,
                    h: 1,
                    type: 0
                }, {
                    x: 18,
                    y: 11,
                    w: 1,
                    h: 1,
                    type: 0
                }, {
                    x: 20,
                    y: 10,
                    w: 1,
                    h: 1,
                    type: 0
                }, {
                    x: 22,
                    y: 13,
                    w: 1,
                    h: 1,
                    type: 0
                }, {
                    x: 24,
                    y: 12,
                    w: 1,
                    h: 1,
                    type: 0
                }, {
                    x: 26,
                    y: 11,
                    w: 1,
                    h: 1,
                    type: 0
                }, {
                    x: 28,
                    y: 10,
                    w: 1,
                    h: 1,
                    type: 0
                }, {
                    x: 30,
                    y: 9,
                    w: 1,
                    h: 1,
                    type: 0
                }, {
                    x: 32,
                    y: 8,
                    w: 1,
                    h: 1,
                    type: 0
                }, {
                    x: 29,
                    y: 12,
                    w: 1,
                    h: 1,
                    type: 0
                }, {
                    x: 32,
                    y: 12,
                    w: 1,
                    h: 1,
                    type: 0
                }, {
                    x: 34,
                    y: 11,
                    w: 1,
                    h: 1,
                    type: 0
                }, {
                    x: 36,
                    y: 10,
                    w: 1,
                    h: 1,
                    type: 0
                }, //added single blocks end here
                {
                    x: 0,
                    y: 14,
                    w: 29,
                    h: 5,
                    type: 0
            }, {
                    x: 29,
                    y: 15,
                    w: 20,
                    h: 4,
                    type: 0
            }, {
                    x: 13,
                    y: 0,
                    w: 36,
                    h: 4,
                    type: 0
            }, {
                    x: 6,
                    y: 0,
                    w: 7,
                    h: 3,
                    type: 0
            }, {
                    x: 0,
                    y: 0,
                    w: 6,
                    h: 9,
                    type: 0
            }, {
                    x: 0,
                    y: 9,
                    w: 5,
                    h: 1,
                    type: 0
            }, {
                    x: 0,
                    y: 10,
                    w: 4,
                    h: 1,
                    type: 0
            }, {
                    x: 0,
                    y: 11,
                    w: 2,
                    h: 1,
                    type: 0
            }, {
                    x: -1,
                    y: 12,
                    w: 1,
                    h: 2,
                    type: 10,
                    event: function () {
                        unload();
                        currentPoint.level = 4;
                        updateCheckPoint();
                        load();
                    },
                    repeatable: true
    }, {
                    x: 49,
                    y: 4,
                    w: 1,
                    h: 11,
                    type: 10,
                    event: function () {
                        unload();
                        currentPoint.level = 6;
                        updateCheckPoint();
                        load();
                    },
                    repeatable: true
    }, ],
            spawnPoint: {
                x: 0,
                y: 13
            },
            biome: 1,
            camBoxes: [],
            levelImage: id("level-5"),
            background: id("grotto-bg"),
            id: "aliquam",
        })
        // S0 L6 (grotto-3)
        this.stage_0.push({
            map: [{
                x: 0,
                y: 0,
                w: 30,
                h: 3,
                type: 0
            }, {
                x: 0,
                y: 14,
                w: 30,
                h: 4,
                type: 0
            },{
                x: 15,
                y: 11,
                w: 1,
                h: 1,
                type: 13
            }, {
                x: 29,
                y: 3,
                w: 1,
                h: 11,
                type: 0
            }, {
                x: -1,
                y: 0,
                w: 1,
                h: 20,
                type: 10,
                event: function () {
                    unload();
                    currentPoint.level = 5;
                    updateCheckPoint();
                    load();
                },
                repeatable: true
    }, ],
            spawnPoint: {
                x: 1,
                y: 13
            },
            biome: 1,
            camBoxes: [],
            levelImage: id("level-6"),
            background: id("grotto-bg"),
            id: "aliquam2",
        })
        this.stages.push(this.stage_0);
    }
}
stages = new GameBlueprint().stages;
