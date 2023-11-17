// Whole-script strict mode syntax
'use strict';
/*jshint esversion: 6 */
/*jslint bitwise: true */
var madeChanges = false;
var selectedType = 0;
var importedCode = "";
var levelsArray = [];
var ctrlKeyDown = false;
Array.prototype.swapItems = function (a, b) {
    this[a] = this.splice(b, 1, this[a])[0];
    return this;
}

function id(arg) {
    return document.getElementById(arg);
}
var canvas = id("canvas");
var sheet = id("sheet");
var c = canvas.getContext("2d");
c.imageSmoothingEnabled = false;

// map JSONS will be pushed here
var levels = [];
var currentLevel = 0;

var mapObject = {
    //where the level will be pushed
    map: [],
    camBoxes: [],
    spawnPoint: {},
    levelImage: ""
};


// the current level
var map = [];
var hitBoxes = [];
var camBoxes = [];
var spawnPoint = {
    x: 30,
    y: 20
};

id("+").onclick = function () {
    addLevel();
}

function clearMap() {
    map = [];
    mapObject.map = [];
    mapObject.camBoxes = [];
    mapObject.spawnPoint = {
        x: 30,
        y: 20
    };
    hitBoxes = [];
    camBoxes = [];
    spawnPoint = {
        x: 30,
        y: 20
    };

}

function clearButtons() {
    let arr = document.getElementsByClassName("levels");
    for (let i = arr.length - 1; i >= 0; i--) {
        arr[i].parentNode.removeChild(arr[i]);
    }
}

id("saveButton").onclick = saveImage;

function saveImage() {
    canvas.toBlob(blob => navigator.clipboard.write([new ClipboardItem({
        'image/png': blob
    })]));
}
//keycode: 38
//moves the current level up (if there are levels above)
//keycode: 40
//moves the current level down (if there are levels under)
function moveLevel(up) {
    if (up && currentLevel < 1) {
        return console.log("Not possible to swap above")
    }
    if (!up && currentLevel >= levels.length - 1) {
        return console.log("Not possible to swap under")
    }
    let moveAt = up ? -1 : 1;
    levels[currentLevel] = newMapExport(currentLevel);
    levels.swapItems(currentLevel, currentLevel + moveAt);
    up ? currentLevel-- : currentLevel++;
    safeEval(JSON.parse(levels[currentLevel]));
    resizeMap();
    levelsArray = [];
    for (let i = 0; i < levels.length; i++) {
        levelsArray.push(JSON.parse(levels[i]));
    }
    highlightCurrentLevel();
}

function changeLevel(levelNumber) {
    levels[currentLevel] = newMapExport(currentLevel);
    clearMap();
    currentLevel = levelNumber;
    safeEval(JSON.parse(levels[currentLevel]));
    resizeMap();
    highlightCurrentLevel();
}

function addButton() {

    var btn = document.createElement('button');
    btn.number = levels.length;
    btn.innerHTML = levels.length;
    btn.className += " levels";
    btn.onmousedown = function (e) {
        changeLevel(this.number);
    }
    id("cont3").appendChild(btn);
    highlightCurrentLevel();
}

function addLevel() {
    madeChanges = true;
    // Adds a button in the level divs
    addButton();
    //saves the current level
    levels[currentLevel] = newMapExport(currentLevel);
    //clears the map
    clearMap();
    //pushes the cleared map to the levels queue
    levels.splice(currentLevel + 1, 0, newMapExport(currentLevel + 1))
    //takes you to the newly created blank level
    currentLevel += 1;
    safeEval(JSON.parse(levels[currentLevel]));
    resizeMap();
    highlightCurrentLevel();
}
addButton();
levels[currentLevel] = newMapExport(currentLevel);








var cellQuantityW = id("mapSizeW").value;
var cellQuantityH = id("mapSizeH").value;
var cellSize = 16;
var fileName = "mapCode";
var interactiveTile = 0;

canvas.width = cellQuantityW * cellSize;
canvas.height = cellQuantityH * cellSize;
id("mapSizeBtnW").onclick = function () {
    cellQuantityW = id("mapSizeW").value;
    changeMapSize();
}
id("mapSizeBtnH").onclick = function () {
    cellQuantityH = id("mapSizeH").value;
    changeMapSize();
}

window.onload = function () {
    for (let i = 0; i < tiles.length; i++) {
        var canv = document.createElement('canvas');
        canv.id = "canvas" + i;
        canv.width = 32;
        canv.height = 32;
        canv.number = i;
        canv.getContext("2d").imageSmoothingEnabled = false;
        if (i === 0) {
            canv.className += " selected";
        }
        canv.className += " tile";
        //canvas.style.position = "absolute";
        canv.getContext("2d").drawImage(
            sheet,
            tiles[i][0] * 16,
            tiles[i][1] * 16,
            16,
            16,
            0,
            0,
            canv.width,
            canv.height
        )
        var body = document.getElementsByTagName("body")[0];
        id("cont2").appendChild(canv);
        id("canvas" + i).onclick = function () {
            selectedType = this.number;
            for (let j = 0; j < tiles.length; j++) {
                id("canvas" + j).classList.remove("selected");
            }
            this.className += " selected";
        }
    }
    loop();
}
//LAUNCH TESTMODE
id("test").onclick = function () {
    levels[currentLevel] = newMapExport(currentLevel);
    newMapExport();
    levelsArray = [];
    for (let i = 0; i < levels.length; i++) {
        levelsArray.push(JSON.parse(levels[i]));
    }
    var mapTester = window.open("MapTester/index.html");
    //mapTester.tile=map;
}
//TOGGLES INTERACTIVE BLOCKS
id("interactive").onclick = function () {
    if (interactiveTile) {
        interactiveTile = 0;
        id("interactive").style.backgroundColor = "white";
        id("interactive").style.color = "black";
    } else {
        interactiveTile = 1;
        id("interactive").style.backgroundColor = "black";
        id("interactive").style.color = "white";
    }
}

//SWITCH BETWEEN HITBOXES AND DISPLAYED
var hitBoxToggle = false;
id("toggle").onclick = function () {
    if (hitBoxToggle == 2) {
        hitBoxToggle = 0;
        id("toggle").innerHTML = "drawing: displayed";
    } else if (hitBoxToggle == 0) {
        hitBoxToggle = 1;
        id("toggle").innerHTML = "drawing: hitboxes";
    } else if (hitBoxToggle == 1) {
        hitBoxToggle = 2;
        id("toggle").innerHTML = "drawing: camera";
    }
}

// 'square' is the square that appears whenever the mouse is dragged and moved
var square = {
    x: 0, // xPos of the actual square
    y: 0, // yPos of the actual square
    w: 0, // width of the actual square
    h: 0 // height of the actual square
};
var infoDisp = false;
// MAIN LOOP

function loop() {
    c.clearRect(0, 0, canvas.width, canvas.height);
    if (pastedImage) {
        c.drawImage(pastedImage, 0, 0, pastedImage.width, pastedImage.height)
    }
    renderGrid();
    renderMap();
    if (mouseDown && !(movingMap || definingSpawnpoint)) {
        renderSquare();
    }
    requestAnimationFrame(loop);
}

function renderSquare() {
    if (hitBoxToggle == 1)
        c.strokeStyle = "#ff0000";
    else {
        c.strokeStyle = "#ffffff";
    }
    c.beginPath()
    c.rect(square.x, square.y, square.w, square.h);
    c.closePath();
    c.stroke();
}
var camera = {
    L: false,
    R: false,
    T: false,
    B: false,
    zoomIn: false,
    zoomOut: false,
    speed: 16
}
var sX = 0;
var sY = 0;


// MAKES THE MENUS DRAGGABLE
dragElement(id("cont"));
dragElement(id("cont2"));
dragElement(id("cont3"));

function dragElement(elmnt) {
    var pos1 = 0,
        pos2 = 0,
        pos3 = 0,
        pos4 = 0;
    elmnt.onmousedown = dragMouseDown;

    function dragMouseDown(event) {
        event = event || window.event;
        // get the mouse cursor position at startup:
        pos3 = event.clientX;
        pos4 = event.clientY;
        document.onmouseup = closeDragElement;
        // call a function whenever the cursor moves:
        document.onmousemove = elementDrag;
    }

    function elementDrag(event) {
        event = event || window.event;
        event.preventDefault();
        // calculate the new cursor position:
        pos1 = pos3 - event.clientX;
        pos2 = pos4 - event.clientY;
        pos3 = event.clientX;
        pos4 = event.clientY;
        // set the element's new position:
        elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
        elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
    }

    function closeDragElement() {
        /* stop moving when mouse button is released:*/
        document.onmouseup = null;
        document.onmousemove = null;
    }
}

//GENERATES THE EXPORT CODE
var mapCode = "";
id("exportMap").onclick = function () {
    levels[currentLevel] = newMapExport(currentLevel);
    levelsArray = [];

    for (let i = 0; i < levels.length; i++) {
        levelsArray.push(JSON.parse(levels[i]));

    }
    id("exportBox").style.display = "block";
    id("exportText").innerHTML = JSON.stringify(levelsArray);
}

// Translate a level to 2d
function parseTo2d(level) {
    let array2d = create2dArray(cellQuantityW, cellQuantityH);
    for (let entity of level.map) {
        for (let w = 0; w < entity.w; w++) {
            for (let h = 0; h < entity.h; h++) {
                array2d[entity.y + h][entity.x + w] = entity.type;
            }
        }
    }
    return array2d;
}
// Translate a 2d level to normal
function parseToBasic(level2d) {
    let array = [];
    for (let y = 0; y < level2d.length; x++) {
        for (let x = 0; x < level2d[y].length; y++) {
            array.push({
                x: x,
                y: y,
                w: 1,
                h: 1,
                type: level2d[y][x]
            })
        }
    }
    return array;
}

function create2dArray(width, height) {
    let level = []
    for (let i = 0; i < height; i++) {
        level.push([]);
        for (let j = 0; j < width; j++) {
            level[i].push(0);
        }
    }
    return level;
}
// Export code for 2d arrays
id("export2d").onclick = function () {
    levels[currentLevel] = newMapExport(currentLevel);
    levelsArray = [];

    for (let i = 0; i < levels.length; i++) {
        levelsArray.push(parseTo2d(JSON.parse(levels[i])));
    }
    id("exportBox").style.display = "block";
    id("exportText").innerHTML = JSON.stringify(levelsArray);
}

function newMapExport(num) {
    mapObject = {
        map: map,
        camBoxes: camBoxes,
        spawnPoint: spawnPoint,
        levelImage: "" + num,
    };
    return JSON.stringify(mapObject);
};
id("closeBtn").onclick = function () {
    id("exportBox").style.display = "none";
}
id("downloadBtn").onclick = function () {
    download("map.json", JSON.stringify(levelsArray));
}
// LOADS AND READS THE IMPORTED CODE
id("file").onchange = fileImport;

id("file2d").onchange = function () {
    fileImport(true)
}
// Converts an array of 2d arrays to normal
function parseLevelsArray(levelsArray) {
    let array3d = [];
    // Iterate through the array of 2d arrays
    for (let i = 0; i < levelsArray.length; i++) {
        let array1d = [];
        // Iterate through the height of 2d arrays
        for (let j = 0; j < levelsArray[i].length; j++) {
            for (let k = 0; k < levelsArray[i][j].length; k++) {
                if(levelsArray[i][j][k] === 0){
                    continue;
                }
                array1d.push({
                    x:k,
                    y:j,
                    w:1,
                    h:1,
                    type:levelsArray[i][j][k]
                })
            }
        }
        array3d.push({
            map:array1d,
            camBoxes : [],
            spawnPoint :{x:-1,y:-1},
            levelImage:0
        });
    }
    return array3d;
}

function fileImport(array2d) {
    let isArray2d = array2d || 0;
    console.log("importing...")
    let data = id("file").files[0];
    fileName = id("file").files[0].name.split(".")[0];
    let reader = new FileReader();
    reader.onload = function (e) {
        let text = reader.result
        clearMap();
        clearButtons();
        levels = [];
        currentLevel = 0;
        levelsArray = JSON.parse(text);
        if (isArray2d) {
            levelsArray = parseLevelsArray(levelsArray);
        }
        for (let i = 0; i < levelsArray.length; i++) {
            addButton();
            levels[i] = (JSON.stringify(levelsArray[i]));
        }
        safeEval(levelsArray[0])
        resizeMap()
        highlightCurrentLevel();

    }
    reader.readAsText(data);
}

function safeEval(level) {
    if (typeof level === 'object' && level !== null) {
        map = level.map;
        spawnPoint = level.spawnPoint;
        camBoxes = level.camBoxes;
    }
}
var baseWidth = id("mapSizeW").value;
var baseHeight = id("mapSizeH").value;

function resizeMap() {
    let xMax = 0;
    let yMax = 0;
    for (let i = 0; i < map.length; i++) {
        if (map[i].x + map[i].w > xMax) {
            xMax = map[i].x + map[i].w;
        }
        if (map[i].y + map[i].h > yMax) {
            yMax = map[i].y + map[i].h;
        }
    }
    if (yMax < baseHeight) {
        yMax = baseHeight;
    }
    if (xMax < baseWidth) {
        xMax = baseWidth;
    }
    cellQuantityW = xMax;
    id("mapSizeW").value = xMax;
    cellQuantityH = yMax;
    id("mapSizeH").value = yMax;
    changeMapSize();

}

function highlightCurrentLevel() {
    let lvls = document.getElementsByClassName("levels");
    for (let i = 0; i < lvls.length; i++) {
        if (lvls[i].number == currentLevel) {
            if (!lvls[i].classList.contains("selected")) {
                lvls[i].classList.add("selected");
            }
        } else if (lvls[i].classList.contains("selected")) {
            lvls[i].classList.remove("selected")
        }
    }
}
// ALLOWS TO MOVE THE CAMERA IN THE EDITOR
function cameraMove() {
    if (camera.L) {
        sX -= camera.speed;
    }
    if (camera.R) {
        sX += camera.speed;
    }
    if (camera.T) {
        sY -= camera.speed;
    }
    if (camera.B) {
        sY += camera.speed;
    }
    if (sX < 0) {
        sX = 0;
    }
    if (sX > canvas.width - window.innerWidth) {
        sX = canvas.width - window.innerWidth;
    }
    if (sY < 0) {
        sY = 0;
    }
    if (sY > canvas.height - window.innerHeight) {
        sY = canvas.height - window.innerHeight;
    }
    if (camera.zoomOut) {
        id("zoomer").value--;
        zoomChange();
    } else if (camera.zoomIn) {
        id("zoomer").value++;
        zoomChange();
    }
    scroll(sX, sY);
}

function renderMap() {
    if (camera.L || camera.R || camera.T || camera.B || camera.zoomIn || camera.zoomOut) {
        cameraMove();
    }
    c.globalAlpha = 1;
    for (let i = 0; i < map.length; i++) {
        if (map[i].type > 51) {
            for (let j = 0; j < map[i].h; j++) {
                for (let k = 0; k < map[i].w; k++) {
                    //c.fillRect((tile[i].x + k) * (ratio)+mapX, (tile[i].y + j) * (ratio), ratio, ratio);
                    c.drawImage(id("sheet"), tiles[map[i].type][0] * 16, tiles[map[i].type][1] * 16, 16, 16, (map[i].x + k) * cellSize, (map[i].y + j) * cellSize, cellSize, cellSize);
                }
            }
        }
    }
    for (let i = 0; i < map.length; i++) {
        if (map[i].type <= 51) {
            for (let j = 0; j < map[i].h; j++) {
                for (let k = 0; k < map[i].w; k++) {
                    //c.fillRect((tile[i].x + k) * (ratio)+mapX, (tile[i].y + j) * (ratio), ratio, ratio);
                    c.drawImage(id("sheet"), tiles[map[i].type][0] * 16, tiles[map[i].type][1] * 16, 16, 16, (map[i].x + k) * cellSize, (map[i].y + j) * cellSize, cellSize, cellSize);
                }
            }
        }
    }
    // these will get shown above visual boxes

    for (let i = 0; i < hitBoxes.length; i++) {
        c.fillStyle = "#000000";
        c.fillRect(hitBoxes[i].x * cellSize, hitBoxes[i].y * cellSize, hitBoxes[i].w * cellSize, hitBoxes[i].h * cellSize);
    }
    c.globalAlpha = 1;
    for (let i = 0; i < camBoxes.length; i++) {
        c.strokeStyle = "#002200";
        c.beginPath();
        c.rect(camBoxes[i].x * cellSize, camBoxes[i].y * cellSize, camBoxes[i].w * cellSize, camBoxes[i].h * cellSize);
        c.closePath();
        c.stroke();
    }

    //draws spawnpoint
    c.fillStyle = "#5b6ee1";
    c.fillRect(spawnPoint.x * cellSize, spawnPoint.y * cellSize, 1 * cellSize, 1 * cellSize);
}

function renderGrid() {
    c.lineWidth = 0.1;
    c.strokeStyle = "#ffffff";
    for (let i = 0; i < canvas.width; i += cellSize) {
        c.beginPath()
        c.moveTo(i, 0);
        c.lineTo(i, canvas.height);
        c.closePath();
        c.stroke();
    }
    for (let i = 0; i < canvas.height; i += cellSize) {
        c.beginPath()
        c.moveTo(0, i);
        c.lineTo(canvas.width, i);
        c.closePath();
        c.stroke();
    }
    c.lineWidth = 1;
}


var definingSpawnpoint = false;
id("spawn").onclick = function () {
    if (definingSpawnpoint) {
        definingSpawnpoint = false;
        id("spawn").style.color = "#000000";
        id("canvas").style.cursor = "crosshair";
        canvas.onclick = null;
        return;
    }
    definingSpawnpoint = true;
    id("spawn").style.color = "#0000cc";
    id("canvas").style.cursor = "pointer";
    canvas.onclick = () => {
        spawnPoint.x = square.x;
        spawnPoint.y = square.y;
        id("spawn").style.color = "#000000";
        id("canvas").style.cursor = "crosshair";
        canvas.onclick = null;
    }
}

var movingMap = false;
var movingVariables = {
    // already applied movements
    xRDiff: 0,
    yRDiff: 0,
}
id("moveMap").onclick = function () {
    if (movingMap) {
        movingMap = false;
        id("moveMap").style.color = "#000000";
        id("canvas").style.cursor = "crosshair";
        return;
    }
    movingMap = true;
    id("moveMap").style.color = "#0000cc";
    id("canvas").style.cursor = "all-scroll";
    canvas.addEventListener("mousemove", function () {
        if (!movingMap || !mouseDown) {
            return;
        }

        let xDifference = square.w / cellSize - movingVariables.xRDiff;
        let yDifference = square.h / cellSize - movingVariables.yRDiff;
        if (xDifference !== 0 || yDifference !== 0) {
            moveEverything(xDifference, yDifference);
            movingVariables.xRDiff += xDifference;
            movingVariables.yRDiff += yDifference;

        }
    })
    canvas.addEventListener("mouseup", function () {
        if (!movingMap) {
            return;
        }
        movingVariables.xRDiff = 0;
        movingVariables.yRDiff = 0;
    })
}

function moveEverything(xDiff, yDiff) {
    if (xDiff == 0 && yDiff == 0) {
        return;
    }
    for (let i = 0; i < map.length; i++) {
        map[i].x += xDiff;
        map[i].y += yDiff;
    }
    for (let i = 0; i < hitBoxes.length; i++) {
        hitBoxes[i].x += xDiff;
        hitBoxes[i].y += yDiff;

    }
    for (let i = 0; i < camBoxes.length; i++) {
        camBoxes[i].x += xDiff;
        camBoxes[i].y += yDiff;

    }

    spawnPoint.x += xDiff;
    spawnPoint.y += yDiff;
}

id("applyMargin").onclick = function () {
    let
        fixW = 32,
        fixH = 20,
        margin = 4,
        mx = margin,
        my = margin,
        moveX = 0,
        moveY = 0;

    let minW = map[0].x;
    let minH = map[0].y;
    let maxW = 0;
    let maxH = 0;
    for (let i = 0; i < map.length; i++) {
        if (map[i].x + map[i].w > maxW) {
            maxW = map[i].x + map[i].w;
        }
        if (map[i].y + map[i].h > maxH) {
            maxH = map[i].y + map[i].h;
        }
        if (map[i].x < minW) {
            minW = map[i].x;
        }
        if (map[i].y < minH) {
            minH = map[i].y;
        }
    }
    if (maxW - minW < fixW) {
        mx = (fixW - (maxW - minW)) / 2 + (fixW - (maxW - minW)) % 2 / 2 + margin;
    }
    if (maxH - minH < fixH) {
        my = (fixH - (maxH - minH)) / 2 + (fixH - (maxH - minH)) % 2 / 2 + margin;
    }
    moveX = -minW + mx;
    moveY = -minH + my;
    moveEverything(moveX, moveY);
}
//SHOWS THE LITTLE WINDOW OF THE SQUARES PROPERTIES
function infoText() {
    var sqx = square.x / cellSize;
    var sqy = square.y / cellSize;
    if (sqx > -1 && sqx < 1) {
        sqx = 0;
    }
    if (sqy > -1 && sqy < 1) {
        sqy = 0;
    }
    id("info").innerHTML = "x: " + sqx + ", y: " + sqy + "<br> w: " + square.w / cellSize + ", h: " + square.h / cellSize;
}


// the square you're making on click (hold)
var mouseDown = false;
canvas.addEventListener("mousedown", function (event) {
    mouseDown = true;
    var xx = window.pageXOffset - canvas.offsetLeft;
    var yy = window.pageYOffset - canvas.offsetTop;

    // info div
    id("info").style.display = "block";
    id("info").style.left = event.clientX + 30 + "px";
    id("info").style.top = event.clientY - 30 + "px";

    square.x = round(event.clientX + xx) * cellSize;
    square.y = round(event.clientY + yy) * cellSize;
    square.w = 0;
    square.h = 0;
    infoText();
})

canvas.addEventListener("mousemove", function (event) {
    var xx = window.pageXOffset - canvas.offsetLeft;
    var yy = window.pageYOffset - canvas.offsetTop;
    if (mouseDown) {
        id("info").style.display = "block";
        id("info").style.left = event.clientX + 30 + "px";
        id("info").style.top = event.clientY - 30 + "px";
        infoText();
    }

    if (mouseDown) {
        square.w = round(event.clientX + xx - square.x) * cellSize;
        square.h = round(event.clientY + yy - square.y) * cellSize;
    }
});


canvas.addEventListener("mouseup", function (evt) {
    id("info").style.display = "none";
    mouseDown = false;
    floorSquare();
    if (movingMap) {
        return;
    }
    if (definingSpawnpoint) {
        definingSpawnpoint = false;
        return;
    }
    if (!square.w && !square.h && evt.which === 1) {
        square.w = 1;
        square.h = 1;
    }
    if (square.w && square.h) {
        madeChanges = true;
        if (square.w < 0) {
            square.w *= -1;
            square.x -= square.w;
        }
        if (square.h < 0) {
            square.h *= -1;
            square.y -= square.h;
        }
        if (hitBoxToggle == 1) {
            hitBoxes.push({
                x: square.x,
                y: square.y,
                w: square.w,
                h: square.h
            });
            if (interactiveTile) {
                //Inserted text
                var text = prompt("Insert the text for this interactive tile", "");
                hitBoxes[hitBoxes.length - 1].text = text;
            }
        } else if (hitBoxToggle == 0) {
            map.push({
                x: square.x,
                y: square.y,
                w: square.w,
                h: square.h,
                type: selectedType,
            });
            if (interactiveTile) {
                //Inserted text
                var text = prompt("Insert the text for this interactive tile", "");
                map[map.length - 1].text = text;
            }
        } else if (hitBoxToggle == 2) {
            var typeOfCam = parseInt(prompt("type of camera", ""));
            camBoxes.push({
                x: square.x,
                y: square.y,
                w: square.w,
                h: square.h,
                type: typeOfCam,
            });
        }
    }
})

id("zoomer").addEventListener("change", zoomChange);

id("deleteLvl").addEventListener("click", deleteLevel);

function deleteLevel() {
    madeChanges = true;
    if (levels.length == 1) {
        clearMap();
        return;
    }
    // Adds a button in the level divs
    removeButton();
    //saves the current level
    levels.splice(currentLevel, 1);
    //clears the map
    clearMap();
    //takes you to the newly created blank level
    currentLevel = levels.length - 1;
    safeEval(JSON.parse(levels[currentLevel]));
    resizeMap();
    highlightCurrentLevel();
}

function removeButton() {
    let max = {
        number: 0,
    };
    let lvlButtons = document.getElementsByClassName("levels");
    for (let i = 0; i < lvlButtons.length; i++) {
        if (lvlButtons[i].number >= max.number) {
            max = lvlButtons[i];
        }
    }
    max.parentNode.removeChild(max);
}

function zoomChange() {
    cellSize = parseInt(id("zoomer").value);
    changeMapSize();
}

function changeMapSize() {
    canvas.width = cellQuantityW * cellSize;
    canvas.height = cellQuantityH * cellSize;
}

function roundSquare() {
    square.x = round(square.x);
    square.y = round(square.y);
    square.w = round(square.w);
    square.h = round(square.h);

}

function floorSquare() {
    square.x = (square.x / cellSize) | 0;
    square.y = (square.y / cellSize) | 0;
    square.w = (square.w / cellSize) | 0;
    square.h = (square.h / cellSize) | 0;
}

function round(arg) {
    var rounded = parseInt(arg);
    var remainder = rounded % cellSize;
    if (remainder !== 0) {
        if (remainder > cellSize / 2)
            rounded = rounded - remainder + cellSize;
        else
            rounded = rounded - remainder;
    }
    if (rounded / cellSize > 0 && rounded / cellSize < 1) {
        return 0;
    } else {
        return rounded / cellSize;
    }
}

function enableBeforeUnload() {
    window.onbeforeunload = function (e) {
        if (madeChanges) {
            return "Discard changes?";
        }
    };
}

function disableBeforeUnload() {
    window.onbeforeunload = null;
}
enableBeforeUnload();
document.addEventListener("contextmenu", function (event) {
    madeChanges = true;
    var xx = window.pageXOffset - canvas.offsetLeft;
    var yy = window.pageYOffset - canvas.offsetTop;
    event.preventDefault();
    var x = event.clientX + xx;
    var y = event.clientY + yy;
    removeElements(map, x, y);
    removeElements(hitBoxes, x, y);
    removeElements(camBoxes, x, y);
});

function removeElements(arg, x, y) {
    var removeList = [];
    for (let i = 0; i < arg.length; i++) {
        if (x > arg[i].x * cellSize && x < arg[i].x * cellSize + arg[i].w * cellSize) {
            if (y > arg[i].y * cellSize && y < arg[i].y * cellSize + arg[i].h * cellSize) {
                removeList.push(i);
            }
        }
    }
    removeList.sort(function (a, b) {
        return b - a;
    });
    for (let i = 0; i < removeList.length; i++) {
        arg.splice(removeList[i], 1);
    }
}


function download(filename, data) {
    madeChanges = false;
    var blob = new Blob([data], {
        type: 'text/csv'
    });
    if (window.navigator.msSaveOrOpenBlob) {
        window.navigator.msSaveBlob(blob, filename);
    } else {
        var elem = window.document.createElement('a');
        elem.href = window.URL.createObjectURL(blob);
        elem.download = filename;
        document.body.appendChild(elem);
        elem.click();
        document.body.removeChild(elem);
    }
}

window.addEventListener("keydown", function (event) {
    var key = event.keyCode;
    switch (key) {
        //up arrow down
        case 38:
            event.preventDefault();
            moveLevel(true)
            break;
            //down arrow down
        case 40:
            event.preventDefault();
            moveLevel(false)
            break;
            //ctrl key down
        case 17:
            ctrlKeyDown = true;
            break;
        case 65: //left key down
            camera.L = true;
            break;
        case 68: //right key down
            camera.R = true;
            break;
        case 87: //top key down
            camera.T = true;
            break;
        case 83: //bot key down
            camera.B = true;
            break;
        case 69: //bot key up
            camera.zoomIn = true;
            break;
        case 81: //bot key up
            camera.zoomOut = true;
            break;
        case 90: //z key up
            if (currentLevel > 0) {
                changeLevel(currentLevel - 1);
            } else {
                console.log("No levels above")
            }
            break;
        case 88: //x key up
            if (currentLevel < levels.length - 1) {
                changeLevel(currentLevel + 1);
            } else {
                console.log("No levels under")
            }
            break;
    }
});
window.addEventListener("keyup", function (event) {
    var key = event.keyCode;
    switch (key) {
        //ctrl key down
        case 17:
            ctrlKeyDown = false;
            break;
        case 65: //left key up
            camera.L = false;
            break;
        case 68: //right key up
            camera.R = false;
            break;
        case 87: //top key up
            camera.T = false;
            break;
        case 83: //bot key up
            camera.B = false;
            break;
        case 69: //bot key up
            camera.zoomIn = false;
            break;
        case 81: //bot key up
            camera.zoomOut = false;
            break;
        case 82:
            toggleBoxes();
            break;
    }
});
/**
 * This handler retrieves the images from the clipboard as a blob and returns it in a callback.
 * 
 * @param pasteEvent 
 * @param callback 
 */
var pastedImage;

function retrieveImageFromClipboardAsBlob(pasteEvent, callback) {
    if (pasteEvent.clipboardData == false) {
        if (typeof (callback) == "function") {
            callback(undefined);
        }
    };

    var items = pasteEvent.clipboardData.items;

    if (items == undefined) {
        if (typeof (callback) == "function") {
            callback(undefined);
        }
    };

    for (var i = 0; i < items.length; i++) {
        // Skip content if not image
        if (items[i].type.indexOf("image") == -1) continue;
        // Retrieve image on clipboard as blob
        var blob = items[i].getAsFile();

        if (typeof (callback) == "function") {
            callback(blob);
        }
    }
}
window.addEventListener("paste", function (e) {

    // Handle the event
    retrieveImageFromClipboardAsBlob(e, function (imageBlob) {
        // If there's an image, display it in the canvas
        if (imageBlob) {

            // Create an image to render the blob on the canvas
            var img = new Image();

            // Once the image loads, render the img on the canvas
            img.onload = function () {
                // Update dimensions of the canvas with the dimensions of the image

                pastedImage = img;
                id("mapSizeW").value = pastedImage.width / cellSize;
                cellQuantityW = pastedImage.width / cellSize;
                id("mapSizeH").value = pastedImage.height / cellSize;
                cellQuantityH = pastedImage.height / cellSize;
                changeMapSize();
                // Draw the image
                //c.drawImage(img, 0, 0);
            };

            // Crossbrowser support for URL
            var URLObj = window.URL || window.webkitURL;

            // Creates a DOMString containing a URL representing the object given in the parameter
            // namely the original Blob
            img.src = URLObj.createObjectURL(imageBlob);
        }
    });
}, false);