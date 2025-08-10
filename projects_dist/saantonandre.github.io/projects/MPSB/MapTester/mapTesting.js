// Determines if the game is in testing mode
var mapTester = false;


if (window.opener) {
    if (window.opener.levelsArray) {
        meta.loopType = 0;
        mapTester = true;
        map.currentLevel = window.opener.currentLevel;
        importLevelsArray(window.opener.levelsArray);
    }
}

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
        if (level.background) {
            map.background = level.background;
        } else {
            map.background = 0;
        }
        if (level.levelImage) {
            map.levelImage = id(level.levelImage);
            console.log("levelImage found")
        } else {
            map.levelImage = 0;
        }
        debug.log("safe eval");
    }

}
//initializes the map gotten from the map editor
function initializeMap() {
    debug.log("intializing map...");
    player.x = map.spawnPoint.x;
    player.y = map.spawnPoint.y - 1;
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
    let marginX = minW < meta.tilesWidth ? (meta.tilesWidth - minW) / 4 : 0;
    let marginY = minH < meta.tilesHeight ? (meta.tilesHeight - minH) / 4 : 0;
    map.levelX = minW - marginX;
    map.levelY = minH - marginY;
    map.levelWidth = maxW + marginX;
    map.levelHeight = maxH + marginY;
    console.log(minW, minH, maxW, maxH)

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
                map.entities.push(new Portal(map.tiles[i].x, map.tiles[i].y))
                removeList.push(i);
                break;
            case 2:
                map.entities.push(new Destructible(map.tiles[i].x, map.tiles[i].y, map.tiles[i].w, map.tiles[i].h))
                removeList.push(i);
                break;
            case 3:
                for (let j = 0; j < map.tiles[i].w; j++) {
                    for (let k = 0; k < map.tiles[i].h; k++) {
                        map.entities.push(new Spike(map.tiles[i].x + j, map.tiles[i].y + k))
                    }
                }
                removeList.push(i);
                break;
            case 4:
                for (let j = 0; j < map.tiles[i].w; j++) {
                    for (let k = 0; k < map.tiles[i].h; k++) {
                        map.entities.push(new HeavySpike(map.tiles[i].x + j, map.tiles[i].y + k))
                    }
                }
                removeList.push(i);
                break;
        }
    }
    console.log("map initialized, " + map.entities.length + " entities found");
    for (let i = 0; i < removeList.length; i++) {
        map.tiles.splice(removeList[i], 1);
    }
}
