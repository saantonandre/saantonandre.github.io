import { canvas, c, centerCanvas } from './modules/canvas.js';
import { MapGenerator } from './modules/mapGen/mapGen.js';
import { MapParser } from './modules/mapParser/mapParser.js';
import { Mouse } from './modules/mouse.js';

function id(arg) {
    return document.getElementById(arg);
}
let roomsAmount = id("roomsAmount")
let mapW = id("mapW");
let mapH = id("mapH");
let cellSize = id("cellSize");
let roomJoints = id("roomJoints");
let roomSquares = id("roomSquares");

let mapGen = new MapGenerator();
let mapParser = new MapParser();
let mouse = new Mouse(canvas, cellSize.value);
canvas.onclick = function() {
    for (let i = 0; i < mapGen.roomsMap.length; i++) {
        for (let cell of mapGen.roomsMap[i]) {
            let cellBox = { x: cell.x, y: cell.y, w: 1, h: 1 };
            if (pointSquareCol(mouse.absolute, cellBox)) {
                console.log('Size(bites): ' + roughSizeOfObject(cell), cell);
            }
        }
    }
}

function roughSizeOfObject(object) {

    var objectList = [];
    var stack = [object];
    var bytes = 0;

    while (stack.length) {
        var value = stack.pop();

        if (typeof value === 'boolean') {
            bytes += 4;
        } else if (typeof value === 'string') {
            bytes += value.length * 2;
        } else if (typeof value === 'number') {
            bytes += 8;
        } else if (
            typeof value === 'object' &&
            objectList.indexOf(value) === -1
        ) {
            objectList.push(value);

            for (var i in value) {
                stack.push(value[i]);
            }
        }
    }
    return bytes;
}
let generate = () => {
    console.clear();
    if (mapW.value < 1) {
        mapW.value = 1;
    }
    if (mapH.value < 1) {
        mapH.value = 1;

    }
    console.time("Generator Time")
    mapGen.generate(
        parseInt(mapW.value),
        parseInt(mapH.value),
        parseInt(roomsAmount.value),
        roomJoints.checked,
        roomSquares.checked
    );
    console.timeEnd("Generator Time")
    console.time("Render Time")
    mapGen.render(canvas, c, parseInt(cellSize.value));
    console.timeEnd("Render Time")
    centerCanvas();
}
let parse = () => {
    if (mapGen.jointedChunks.length == 0) {
        mapGen.jointedChunks = mapGen.getJointedChunks(false);
    }
    console.time("Parser Time")
    mapParser.parseChunks(mapGen.jointedChunks)
    console.timeEnd("Parser Time")
    console.time("Parser render")
    mapParser.render(canvas, c, parseInt(cellSize.value))
    console.timeEnd("Parser render")
    centerCanvas();
}

/** Handles inputs */
id("btn").onclick = generate;
id("btn2").onclick = parse;
roomsAmount.onchange = generate;
mapW.onchange = generate;
mapH.onchange = generate;
cellSize.onchange = () => {
    mapGen.render(canvas, c, cellSize.value);
    centerCanvas();
}
roomJoints.onchange = () => {
    if (roomJoints.checked) {
        id('roomSquaresLabel').style.opacity = 1;
        roomSquares.style.opacity = 1;
    } else {
        id('roomSquaresLabel').style.opacity = 0.3;
        roomSquares.style.opacity = 0.3;
    }
}
/** Generates a map on window load */
window.onload = generate;



export function pointSquareCol(point, rectangle, forceSpriteBox = false) {
    let rect = rectangle.hitbox && !forceSpriteBox ? rectangle.hitbox : rectangle;
    if (point.x >= rect.x) {
        if (point.x <= rect.x + rect.w) {
            if (point.y >= rect.y) {
                if (point.y <= rect.y + rect.h) {
                    return true;
                }
            }

        }
    }
    return false;
}