// Determines if the game is in testing mode
var mapTester = false;

function checkIfWindowOpener() {
    if (window.opener) {
        console.log("Opened through the editor")
        if (window.opener.levelsArray) {
            // What happens if the game is loaded via the map editor
            meta.loopType = 0;
            mapTester = true;
            map.currentLevel = window.opener.currentLevel;
            importLevelsArray(window.opener.levelsArray);
        }
    }
}

// Loads the levels (generated via the map editor) to the map.levels
function importLevelsArray(levelsArray) {
    map.levels = JSON.parse(JSON.stringify(levelsArray));
    safeEval(levelsArray[map.currentLevel]);
    initializeMap()
}

function safeEval(lvl) {
    var level = JSON.parse(JSON.stringify(lvl));
    if (typeof level === 'object' && level !== null) {
        level.entities ? map.entities = level.entities : map.entities = [];
        level.vfxs ? map.vfxs = level.vfxs : map.vfxs = [];
        map.map = level.map;
        map.spawnPoint = level.spawnPoint;
        /*
        if (level.background) {
            map.background = level.background;
        } else {
            map.background = 0;
        }
        if (level.levelImage && !mapTester) {
            level.levelImage += meta.onBertha?"b":"";
            map.levelImage = id(level.levelImage);
            debug.log("levelImage found")
        } else {
            map.levelImage = false;
        }
        if (level.frontImage && !mapTester) {
            map.frontImage = id(level.frontImage);
            debug.log("frontImage found")
        } else {
            map.frontImage = false;
        }
        */
        debug.log("safe eval");
    }

}
//initializes the map gotten from the map editor
function initializeMap() {
    debug.log("intializing map...");

    player.x = map.spawnPoint.x;
    player.y = map.spawnPoint.y - 1 + 0.2;
    /*
    player.hitbox.x = map.spawnPoint.x;
    player.hitbox.y = map.spawnPoint.y;
    */
    map.tiles = map.map;

    let minW = map.tiles[0].x;
    let minH = map.tiles[0].y;
    let maxW = 0;
    let maxH = 0;
    for (let i = 0; i < map.tiles.length; i++) {
        if (map.tiles[i].x + map.tiles[i].w > maxW) {
            maxW = map.tiles[i].x + map.tiles[i].w;
        }
        if (map.tiles[i].y + map.tiles[i].h > maxH) {
            maxH = map.tiles[i].y + map.tiles[i].h;
        }
        if (map.tiles[i].x < minW) {
            minW = map.tiles[i].x;
        }
        if (map.tiles[i].y < minH) {
            minH = map.tiles[i].y;
        }
    }
    let margin = 6;
    let marginX, marginY;
    if (maxW - minW < meta.tilesWidth) {
        marginX = (meta.tilesWidth - (maxW - minW)) / 2 + (meta.tilesWidth - (maxW - minW)) % 2 / 2 + margin;
    } else {
        marginX = 4;
    }
    if (maxH - minH < meta.tilesHeight) {
        marginY = (meta.tilesHeight - (maxH - minH)) / 2 + (meta.tilesHeight - (maxH - minH)) % 2 / 2 + margin;
    } else {
        marginY = 4;
    }

    map.levelX = minW - marginX;
    map.levelY = minH - marginY;
    map.levelWidth = maxW + marginX;
    map.levelHeight = maxH + marginY;
    map.entities = [];
    map.vfxs = [];
    var removeList = [];
    for (let i = map.tiles.length - 1; i >= 0; i--) {
        if (map.tiles[i].type != 0) {
            map.tiles[i].solid = false;
        } else {
            map.tiles[i].solid = true;
        }
        switch (map.tiles[i].type) {
            case 1:
                /* Example usage
                map.entities.push(new Portal(map.tiles[i].x, map.tiles[i].y))
                removeList.push(i);
                */
                map.entities.push(new TaskArea(map.tiles[i].x, map.tiles[i].y, map.tiles[i].w, map.tiles[i].h))
                removeList.push(i);
                break;

            case 2:
                break;

            case 3:
                break;

            case 4:
                break;

            case 5:
                break;

            case 6:
                break;

            case 7:
                break;

            case 8:
                break;

            case 9:
                break;

            case 10:
                break;

            case 11:
                break;

            case 12:
                break;

            case 13:
                break;

            case 14:
                break;
        }
    }
    debug.log("map initialized, " + map.entities.length + " entities found");
    for (let i = 0; i < removeList.length; i++) {
        map.tiles.splice(removeList[i], 1);
    }
}