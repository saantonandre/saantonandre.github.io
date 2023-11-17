/*
1. Have a grid-like system
2. inhabit a room in the center
3. Pick a random inhabited room (Parent)
4. Pick a neighbor of Parent(←,↑,→,↓):
is it free? 
-y: (*) new Child, n: do nothing
5. rooms amount reached? 
-y: end, n: back to 3

(*)Child and Parent will have a connection
*/



function id(arg) {
    return document.getElementById(arg);
}
var btn = id("btn"),
    input = id("input"),
    canvas = id("canvas"),
    c = canvas.getContext("2d");
canvas.width = 500;
canvas.height = 500;
var map = [];
var size = 10;
var mapSize = canvas.width / size | 0;
console.log(mapSize)
var options = [-1, +mapSize, +1, -mapSize];
var roomAmount = id("roomAmount").value;
id("roomAmount").onchange = function () {
    roomAmount = id("roomAmount").value;
}

function initializeMap() {
    map.length = 0;
    for (let i = 0; i < mapSize * mapSize; i++) {
        map.push(0);
    }
}


btn.onclick = function () {
    mapGenerator();
}

function clear() {
    c.clearRect(0, 0, canvas.width, canvas.height);
    map.length = 0;
    rooms.length = 0;
}

class Room {
    constructor(pos, tied, type) {
        this.pos = pos;
        this.tied = tied;
        this.type = type;
        this.colors = ["black", "blue", "purple", "red"];
        this.texts = ["N", "S", "T", "B"];
        this.gap = size * 0.2;
    }
    draw1() {
        //fill
        c.fillStyle = this.colors[this.type];
        c.fillRect(
            this.pos % mapSize * size + this.gap,
            (this.pos / mapSize | 0) * size + this.gap,
            size - this.gap,
            size - this.gap)
    }
    draw2() {
        //borders
        c.lineWidth = 1;
        c.strokeStyle = "white";
        c.rect(
            this.pos % mapSize * size,
            (this.pos / mapSize | 0) * size,
            size,
            size)
        c.stroke();

    }
    draw3() {
        //ties
        if (this.tied >= 0) {
            c.lineWidth = size * 0.3;
            c.strokeStyle = "black";
            c.beginPath();
            c.moveTo(
                this.pos % mapSize * size + size / 2,
                (this.pos / mapSize | 0) * size + size / 2);

            c.lineTo(rooms[this.tied].pos % mapSize * size + size / 2,
                (rooms[this.tied].pos / mapSize | 0) * size + size / 2);
            c.stroke();
        }
    }
    draw4() {
        //text
        c.font = size / 4 + "pt Calibri";
        c.fillStyle = "white";
        c.textAlign = "center";
        c.fillText(
            this.texts[this.type],
            this.pos % mapSize * size + size / 1.6,
            (this.pos / mapSize | 0) * size + size / 1.6,
            size * 2,
            size * 2)

    }

}

var rooms = [];

function mapGenerator() {
    clear();
    initializeMap();
    let rand;
    if (mapSize % 2 == 0) {
        rand = (mapSize / 2) * (mapSize / 2) * 2 + mapSize / 2 | 0;
    } else {
        rand = (mapSize / 2) * (mapSize / 2) * 2 | 0;
    }

    let rand2;
    let tries = 0;
    rooms.push(new Room(rand, -1, 1));
    map[rand] = 1;
    while (rooms.length < roomAmount) {
        rand = Math.random() * rooms.length | 0; //rand room 
        rand2 = options[Math.random() * 4 | 0] //rand direction 
        let flag = true;
        //picking a correct direction
        while (flag) {
            if ((rooms[rand].pos % mapSize == 0 && rand2 == -1) || ((rooms[rand].pos + 1) % mapSize == 0 && rand2 == +1)) {
                rand2 = options[Math.random() * 4 | 0]
            } else {
                flag = false;
            }
        }
        //left down right up

        //picking a correct direction vertically
        if (rooms[rand].pos + rand2 >= 0 && rooms[rand].pos + rand2 < mapSize * mapSize) {

            //checking if slot is empty
            if (map[rooms[rand].pos + rand2] === 0) {

                map[rooms[rand].pos + rand2] = 1;
                rooms.push(new Room(rooms[rand].pos + rand2, rand, 0));
            }
        }

        tries++;
        if (tries > 10000) {
            break;
        }
    }
    let boss, treasure, max = 0,
        start = rooms[0].pos,
        x1 = start % mapSize,
        y1 = (start / mapSize | 0),
        x2,
        y2;
    for (let i = 0; i < rooms.length; i++) {
        x2 = rooms[i].pos % mapSize;
        y2 = (rooms[i].pos / mapSize | 0);

        if (Math.abs(x2 - x1) + Math.abs(y2 - y1) > max) {
            max = Math.abs(x2 - x1) + Math.abs(y2 - y1);
            boss = i;
        }
    }
    rooms[boss].type = 3;
    let x3 = rooms[boss].pos % mapSize,
        y3 = (rooms[boss].pos / mapSize | 0);
    max = 0;
    for (let i = 0; i < rooms.length; i++) {
        if (i == boss || i == start) {
            continue;
        }
        x2 = rooms[i].pos % mapSize;
        y2 = (rooms[i].pos / mapSize | 0);
        if (Math.abs(x2 - x1) + Math.abs(y2 - y1) + Math.abs(x2 - x3) + Math.abs(y2 - y3) > max) {
            max = Math.abs(x2 - x1) + Math.abs(y2 - y1) + Math.abs(x2 - x3) + Math.abs(y2 - y3);
            treasure = i;
        }
    }
    if (rooms[treasure].type !== 1) {
        rooms[treasure].type = 2;
    }
    for (let i = 0; i < rooms.length; i++) {
        rooms[i].draw3();
    }
    for (let i = 0; i < rooms.length; i++) {
        rooms[i].draw1();
    }
    for (let i = 0; i < rooms.length; i++) {
        rooms[i].draw4();
    }



}
