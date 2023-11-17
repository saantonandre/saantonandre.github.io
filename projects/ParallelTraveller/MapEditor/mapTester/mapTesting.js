// Determines if the game is in testing mode
var mapTester = true;


function safeEval(level) {
    if (typeof level === 'object' && level !== null) {
        level.entities ? entities = level.entities : entities = [];
        map.map = level.map;
        map.spawnPoint = level.spawnPoint;
        if (level.background) {
            map.background = level.background;
        } else {
            map.background = 0;
        }
        if (level.levelImage) {
            map.levelImage = level.levelImage;
        } else {
            map.levelImage = 0;
        }
        debug.log("safe eval");
    }
}
//initializes the map gotten from the map editor
function initializeMap() {
    player.x = map.spawnPoint.x;
    player.y = map.spawnPoint.y;
    map.tiles = map.map;
    animatedTiles = [];
    vfxs = [];
    var removeList = [];
    for (let i = map.tiles.length - 1; i >= 0; i--) {
        if (map.tiles[i].type != 0) {
            map.tiles[i].solid = false;
        } else {
            map.tiles[i].solid = true;
        }
        switch (map.tiles[i].type) {
            case 1:
                entities.push(new EventBox(map.tiles[i].x + 0.2, map.tiles[i].y + 0.4, map.tiles[i].w - 0.4, 0.2, function () {
                    player.onHit()
                }, true))
                removeList.push(i);
                break;
            case 3:
                entities.push(new TrashMan(map.tiles[i].x, map.tiles[i].y - 1))
                removeList.push(i);
                break;
            case 4:
                entities.push(new Camera(map.tiles[i].x, map.tiles[i].y))
                removeList.push(i);
                break;
            case 5:
                entities.push(new Skeleton(map.tiles[i].x, map.tiles[i].y))
                removeList.push(i);
                break;
            case 6:
                entities.push(new Interaction(map.tiles[i].x, map.tiles[i].y, map.tiles[i].event, map.tiles[i].repeatable))
                removeList.push(i);
                break;
            case 7:
                entities.push(new Jaymee(map.tiles[i].x, map.tiles[i].y))
                removeList.push(i);
                break;
            case 8:
                entities.push(new Esther(map.tiles[i].x, map.tiles[i].y))
                removeList.push(i);
                break;
            case 9:
                entities.push(new VendingMachine(map.tiles[i].x, map.tiles[i].y))
                entities.push(entities[entities.length - 1].interac)
                removeList.push(i);
                break;
            case 10: //event box
                entities.push(new EventBox(map.tiles[i].x, map.tiles[i].y, map.tiles[i].w, map.tiles[i].h, map.tiles[i].event))
                removeList.push(i);
                break;
        }
    }
    for (let i = 0; i < removeList.length; i++) {
        map.tiles.splice(removeList[i], 1);
    }
}
