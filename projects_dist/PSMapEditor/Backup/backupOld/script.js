var selectedType = 0;

function id(arg) {
    return document.getElementById(arg);
}
var canvas = id("canvas");
var sheet = id("sheet");
var c = canvas.getContext("2d");
var map = [];
var hitBoxes = [];
var cellQuantityW = id("mapSizeW").value;
var cellQuantityH = id("mapSizeH").value;
var cellSize = 15;
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

var tiles = [
        [4, 4], [5, 4], [6, 4], //grass top
        [4, 5], [5, 5], [6, 5], //grass middle
        [4, 6], [5, 6], [6, 6], //grass bottom
        [7, 4], [8, 4], [9, 4], //rock top
        [7, 5], [8, 5], //rock to grass
        [7, 6], [8, 6], [9, 6], //grass short
        [11, 4], //bouncy ball
        [10, 4], //animated grass
    ]
var spawnPoint = {
    x: 3,
    y: 2
};
for (i = 0; i < tiles.length; i++) {
    var canv = document.createElement('canvas');
    canv.id = "canvas" + i;
    canv.width = 32;
    canv.height = 32;
    canv.number = i;
    if (i === 0) {
        canv.className += " selected";
    }
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
        for (j = 0; j < tiles.length; j++) {
            id("canvas" + j).classList.remove("selected");
        }
        this.className += " selected";
    }
}

//LAUNCH TESTMODE
id("test").onclick = function () {
    mapExport(false);
    var mapTester = window.open("mapTester/index.html");
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
    if (hitBoxToggle) {
        hitBoxToggle = false;
        id("toggle").innerHTML = "drawing: displayed";
    } else {
        hitBoxToggle = true;
        id("toggle").innerHTML = "drawing: hitboxes";
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
requestAnimationFrame(loop);

function loop() {
    c.clearRect(0, 0, canvas.width, canvas.height);
    renderGrid();
    renderMap();
    if (mouseDown) {
        renderSquare();
    }
    requestAnimationFrame(loop);
}

function renderSquare() {
    if (hitBoxToggle)
        c.strokeStyle = "#ff0000";
    else {
        c.strokeStyle = "#000000";
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
    speed: 4
}
var sX = 0;
var sY = 0;


// MAKES THE MENU DRAGGABLE
dragElement(id("cont"));
dragElement(id("cont2"));

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
    mapExport(true);
}

function mapExport(downloadTxt) {
    mapCode = "";
    mapCode += 'map = [';
    for (i = 0; i < map.length; i++) {
        mapCode += '{x : ' + map[i].x + ',';
        mapCode += 'y : ' + map[i].y + ',';
        mapCode += 'w : ' + map[i].w + ',';
        mapCode += 'h : ' + map[i].h + ',';
        mapCode += 'type : ' + map[i].type;
        if (map[i].text !== undefined) {
            mapCode += ",text : \'" + map[i].text + "\'";
        }
        mapCode += '},';
    }
    mapCode += ']; ';
    mapCode += "spawnPoint = {x : " + spawnPoint.x + ",y : " + spawnPoint.y + "};";
    console.log(mapCode);
    if (downloadTxt) {
        download('mapCode.txt', mapCode);
    }
};
// LOADS AND READS THE IMPORTED CODE
id("file").onchange = function () {
    let data = id("file").files[0];
    let reader = new FileReader();
    reader.onload = function (e) {
        let text = reader.result
        eval(text);
        resizeMap()

    }
    reader.readAsText(data);
}

function resizeMap() {
    let xMax = 0;
    let yMax = 0;
    for (i = 0; i < map.length; i++) {
        if (map[i].x + map[i].w > xMax) {
            xMax = map[i].x + map[i].w;
        }
        if (map[i].y + map[i].h > yMax) {
            yMax = map[i].y + map[i].h;
        }
    }
    console.log(xMax+"  "+yMax)
    cellQuantityW = xMax;
    id("mapSizeW").value = xMax;
    cellQuantityH = yMax;
    id("mapSizeH").value = yMax;
    changeMapSize();

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
    for (i = 0; i < map.length; i++) {
        for (j = 0; j < map[i].h; j++) {
            for (k = 0; k < map[i].w; k++) {
                //c.fillRect((tile[i].x + k) * (ratio)+mapX, (tile[i].y + j) * (ratio), ratio, ratio);
                c.drawImage(id("sheet"), tiles[map[i].type][0] * 16, tiles[map[i].type][1] * 16, 16, 16, (map[i].x + k) * cellSize, (map[i].y + j) * cellSize, cellSize, cellSize);
            }
        }
    }
    // these will get shown above visual boxes

    for (var i = 0; i < hitBoxes.length; i++) {
        c.fillStyle = "#000000";
        c.beginPath()
        c.fillRect(hitBoxes[i].x * cellSize, hitBoxes[i].y * cellSize, hitBoxes[i].w * cellSize, hitBoxes[i].h * cellSize);
        c.closePath();
        c.stroke();
    }

    c.globalAlpha = 1;
    //draws spawnpoint
    c.fillStyle = "#0000cc";
    c.beginPath()
    c.fillRect(spawnPoint.x * cellSize, spawnPoint.y * cellSize, 1 * cellSize, 1 * cellSize);
    c.closePath();
    c.stroke();
}

function renderGrid() {
    c.strokeStyle = "#888888";
    for (var i = 0; i < canvas.width; i += cellSize) {
        c.beginPath()
        c.moveTo(i, 0);
        c.lineTo(i, canvas.height);
        c.closePath();
        c.stroke();
    }
    for (var i = 0; i < canvas.height; i += cellSize) {
        c.beginPath()
        c.moveTo(0, i);
        c.lineTo(canvas.width, i);
        c.closePath();
        c.stroke();
    }
}



id("spawn").onclick = function () {
    id("spawn").style.color = "#0000cc";
    id("canvas").style.cursor = "pointer";
    canvas.onclick = function hey() {
        spawnPoint.x = square.x;
        spawnPoint.y = square.y;
        id("spawn").style.color = "#000000";
        id("canvas").style.cursor = "crosshair";
        canvas.onclick = null;
    }
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
    var xx = window.pageXOffset - canvas.offsetLeft;
    var yy = window.pageYOffset - canvas.offsetTop;

    // info div
    id("info").style.display = "block";
    id("info").style.left = event.clientX + 30 + "px";
    id("info").style.top = event.clientY - 30 + "px";
    infoText();

    if (!mouseDown) {
        square.x = round(event.clientX + xx) * cellSize;
        square.y = round(event.clientY + yy) * cellSize;
        square.w = 0;
        square.h = 0;
        mouseDown = true;
    }
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


canvas.addEventListener("mouseup", function () {

    id("info").style.display = "none";
    mouseDown = false;
    roundSquare();
    if (square.w && square.h) {
        if (square.w < 0) {
            square.w *= -1;
            square.x -= square.w;
        }
        if (square.h < 0) {
            square.h *= -1;
            square.y -= square.h;
        }
        if (hitBoxToggle) {
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
        } else {
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
        }
    }
})

id("zoomer").addEventListener("change", zoomChange);

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

document.addEventListener("contextmenu", function (event) {

    var xx = window.pageXOffset - canvas.offsetLeft;
    var yy = window.pageYOffset - canvas.offsetTop;
    event.preventDefault();
    var x = event.clientX + xx;
    var y = event.clientY + yy;
    removeElements(map, x, y);
    removeElements(hitBoxes, x, y);
});

function removeElements(arg, x, y) {
    var removeList = [];
    for (i = 0; i < arg.length; i++) {
        if (x > arg[i].x * cellSize && x < arg[i].x * cellSize + arg[i].w * cellSize) {
            if (y > arg[i].y * cellSize && y < arg[i].y * cellSize + arg[i].h * cellSize) {
                removeList.push(i);
            }
        }
    }
    removeList.sort(function (a, b) {
        return b - a;
    });
    for (i = 0; i < removeList.length; i++) {
        arg.splice(removeList[i], 1);
    }
}


function download(filename, data) {
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
    }
});
window.addEventListener("keyup", function (event) {
    var key = event.keyCode;
    switch (key) {
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
