function id(arg) {
    return document.getElementById(arg);
}


    var keys;
    var sessions = [];
window.onload = function () {
    var canvas = id("canvas");
    var sheet = id("sheet");
    var c = canvas.getContext("2d");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    c.imageSmoothingEnabled = false;
    var map = [];
    var deaths = [];
    var hitBoxes = [];
    var camBoxes = [];
    var cellSize = 16;
    var currentLevel = 0;
    var tiles = [
        [4, 4], [5, 4], [6, 4], //grass top
        [4, 5], [5, 5], [6, 5], //grass middle
        [4, 6], [5, 6], [6, 6], //grass bottom
        [7, 4], [8, 4], [9, 4], //rock top
        [7, 5], [8, 5], //rock to grass
        [7, 6], [8, 6], [9, 6], //grass short
        [11, 4], //bouncy ball
        [10, 4], //animated grass
        [12, 5], //speeder
        [5, 7], [6, 7], [7, 7], //stone top
        [5, 8], [6, 8], [7, 8], //stone middle
        [5, 9], [6, 9], [7, 9], //stone bottom
        [5, 10], [6, 10], [7, 10], //stone 2 top
        [5, 11], [6, 11], [7, 11], //stone 2 middle
        [5, 12], [6, 12], [7, 12], //stone 2 bottom
        [8, 12], [9, 12], [10, 12], //stone 3
        [9, 8], //stone single
        [13, 5], [13, 6], [13, 7], [13, 8], //traps rock
        [14, 5], [14, 6], [14, 7], [14, 8], //traps stone
        [12, 0], //slime spawn
        [12, 8], //speeder 2
        [10, 8], [10, 9], [10, 10], [10, 11], // banner
        [8, 10], [9, 10], [8, 11], [9, 11], // chandelier
        [8, 9], // skeleton
        [9, 7], // background rock
        [8, 7], [8, 8], // throne
        [13, 12], // crystal
        [16, 6], // door
        [7, 14], // book
        [15, 5], [15, 9], // trap on/off
        [8, 13], // stone pile
        [5, 17], // dialogue
        [1, 18], // falling stone
        [0, 20], // breakable stone
        [8, 0], // clock
        [5, 17], // dialogue
        [19, 17], // 0.01
        [20, 17], // 0.05
        [21, 17], // 0.10
        [16, 21], // pizza guy
    ];
    for (let i = 0; i < maps.length; i++) {
        let btn = document.createElement('BUTTON');
        btn.id = "btn" + i;
        btn.width = 32;
        btn.height = 32;
        btn.number = i;
        btn.innerText = i;
        btn.className += " level";
        //canvas.style.position = "absolute";
        var body = document.getElementsByTagName("body")[0];
        id("levels-ui").appendChild(btn);
        id("btn" + i).onclick = function () {
            for (j = 0; j < maps.length; j++) {
                id("btn" + j).classList.remove("selected");
            }
            eval(maps[this.number]);
            currentLevel = this.number;
            resizeMap();
            drawMap();
            this.className += " selected";
        }
    }

    function drawDeaths() {
        for (let i = 0; i < deaths.length; i++) {
            if (deaths[i].lvl == currentLevel) {
                c.beginPath();
                c.arc(deaths[i].x * cellSize, deaths[i].y * cellSize, 20, 0, 2 * Math.PI, false);
                c.lineWidth = 3;
                c.strokeStyle = '#FF0000';
                c.stroke();
            }
        }
    }

    function drawMap() {
        c.clearRect(0, 0, canvas.width, canvas.height);
        for (i = 0; i < map.length; i++) {
            if (map[i].type > 51) {
                for (j = 0; j < map[i].h; j++) {
                    for (k = 0; k < map[i].w; k++) {
                        //c.fillRect((tile[i].x + k) * (ratio)+mapX, (tile[i].y + j) * (ratio), ratio, ratio);
                        c.drawImage(id("sheet"), tiles[map[i].type][0] * 16, tiles[map[i].type][1] * 16, 16, 16, (map[i].x + k) * cellSize, (map[i].y + j) * cellSize, cellSize, cellSize);
                    }
                }
            }
        }
        for (i = 0; i < map.length; i++) {
            if (map[i].type <= 51) {
                for (j = 0; j < map[i].h; j++) {
                    for (k = 0; k < map[i].w; k++) {
                        //c.fillRect((tile[i].x + k) * (ratio)+mapX, (tile[i].y + j) * (ratio), ratio, ratio);
                        c.drawImage(id("sheet"), tiles[map[i].type][0] * 16, tiles[map[i].type][1] * 16, 16, 16, (map[i].x + k) * cellSize, (map[i].y + j) * cellSize, cellSize, cellSize);
                    }
                }
            }
        }
        drawDeaths();
    }

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
        canvas.width = xMax * cellSize;
        canvas.height = yMax * cellSize;
    }


    var database = firebase.database();
    var ref = database.ref("sessions");
    ref.once("value", function (snapshot) {
            sessions = snapshot.val();
            initPlayers();
        },
        function (error) {
            console.log("Error: " + error.code);
        });

    function initPlayers() {
        keys = Object.keys(sessions);
        for (let i = 0; i < keys.length; i++) {

            let btn = document.createElement('BUTTON');
            btn.id = "btnP" + i;
            btn.width = 32;
            btn.height = 32;
            btn.number = i;
            btn.innerText = i;
            btn.className += " player";
            //canvas.style.position = "absolute";
            var body = document.getElementsByTagName("body")[0];
            id("players-ui").appendChild(btn);
            id("btnP" + i).onclick = function () {
                for (j = 0; j < keys.length; j++) {
                    id("btnP" + j).classList.remove("selected");
                }
                deaths = sessions[keys[this.number]].deaths;
                if (deaths==null){
                    deaths=[];
                }
                resizeMap();
                drawMap();
                this.className += " selected";
            }
        }
    }


}
