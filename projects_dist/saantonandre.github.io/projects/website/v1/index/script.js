/******  Generic functions  ******/

// Returns an html element by its ID
function id(arg) {
    return document.getElementById(arg);
}
var folders = document.getElementsByClassName("folder-icons");
var folderContent = id("folder-content");

var links = document.getElementsByClassName("links");
var specialText = document.getElementsByClassName("special-text");

var contentTitle = document.getElementsByClassName("content-title");
var activeFolder = 0;

// The JSON manifest containing info about the games
var MANIFEST;


// Maximum amount of stars
const MAX_STARS = 700;

// When the user scrolls down 50px from the top of the document, resize the header's font size
window.addEventListener("scroll", function () {
    if (document.body.scrollTop > 50 || document.documentElement.scrollTop > 50) {
        document.getElementById("logo").style.width = "112px";
        document.getElementById("logo").style.height = "10px";
        document.getElementById("logo").style.padding = "3px";
        document.getElementById("title").style.fontSize = "8px";
        document.getElementById("title").style.padding = "3px";
        document.getElementById("top-bar").style.padding = "3px";
    } else {
        document.getElementById("logo").style.width = "";
        document.getElementById("logo").style.height = "";
        document.getElementById("logo").style.padding = "";
        document.getElementById("title").style.fontSize = "";
        document.getElementById("title").style.padding = "";
        document.getElementById("top-bar").style.padding = "";
    }
})



fetch('index/games/data.JSON')
    .then(response => response.json())
    .then(obj => {
        MANIFEST = obj;
        initGameSection();
    })
// Initializes the games thumbnails
function initGameSection() {
    let gameDiv, gameTitle, gameImg, gameDesc, gameShortcut, gameImgDiv, gameSections, gameButtons, tempImgSrc;
    for (let i = 0; i < MANIFEST.games.length; i++) {
        // Background / outer DIV
        gameDiv = document.createElement("div");
        gameDiv.classList.add("game-div");
        gameDiv.id = "game-div-" + i;
        gameDiv.gameIndex = i;
        //gameDiv.style.backgroundImage = "url(\"" + MANIFEST.games[i].thumbnail + "\")";

        //preloads the games preview
        preview = document.createElement("img");
        preview.src = MANIFEST.games[i].preview;
        id("content-preload").appendChild(preview);

        // Thumbnail img
        gameShortcut = document.createElement("a");
        gameShortcut.rel = "noopener";
        gameShortcut.href = "#";

        gameImg = document.createElement("img");
        gameImg.src = MANIFEST.games[i].thumbnail;

        // Img shine effect
        gameThumbOverlap = document.createElement("img");
        gameThumbOverlap.src = "index/shine-effect.gif";
        gameThumbOverlap.classList.add("game-thumb-overlap");

        // Save a reference of the img to the game div
        gameDiv.thumb = gameImg;
        gameDiv.gameThumbOverlap = gameThumbOverlap;
        gameShortcut.appendChild(gameImg);
        gameShortcut.appendChild(gameThumbOverlap);
        gameImgDiv = document.createElement("div");
        gameImgDiv.classList.add("game-thumb");
        gameImgDiv.appendChild(gameShortcut);

        gameDiv.appendChild(gameImgDiv);

        //Link to the img to easily access to it later
        gameDiv.gameImgDiv = gameImgDiv;

        // Create "sections" div
        gameSections = document.createElement("div");
        gameSections.classList.add("game-sections");
        gameSections.classList.add("selected-content");
        // Thumbnail title
        gameTitle = document.createElement("span");
        gameTitle.classList.add("game-title");
        gameTitle.innerHTML = MANIFEST.games[i].title;
        gameSections.appendChild(gameTitle)

        // Thumbnail description
        gameDesc = document.createElement("span");
        gameDesc.classList.add("game-description");
        gameDesc.innerHTML = MANIFEST.games[i].description;
        gameSections.appendChild(gameDesc)

        gameDiv.appendChild(gameSections);
        // Thumbnail preview title
        gamePreviewTitle = document.createElement("div");
        gamePreviewTitle.classList.add("game-preview-title");
        gamePreviewTitle.classList.add("unselected-content");
        gamePreviewTitle.innerHTML = MANIFEST.games[i].title;
        gameDiv.appendChild(gamePreviewTitle)

        // Create buttons div
        gameButtons = document.createElement("div");
        gameButtons.classList.add("game-buttons");
        gameButtons.innerHTML = "<hr>PUBLISHED ON:<br>"
        gameSections.appendChild(gameButtons)
        for (let j = 0, tempLink, tempImg; j < MANIFEST.games[i].links.length; j++) {
            // Create website's link
            tempLink = document.createElement("a");
            tempLink.rel = "noopener";
            tempLink.href = MANIFEST.games[i].links[j];
            tempLink.setAttribute("target", "_blank");
            // Fetch website's favicon
            // Create an Image with the favicon
            tempImg = document.createElement("img");
            tempImgSrc = "https://www.google.com/s2/favicons?sz=64&domain=" + fetchDomain(MANIFEST.games[i].links[j]);
            tempImg.src = tempImgSrc;

            // Append the image to the link
            tempLink.appendChild(tempImg)
            // Append the link to the buttons section
            gameButtons.appendChild(tempLink)

        }


        /* iFrame
        gameFrame = document.createElement("iframe");
        gameFrame.src = MANIFEST.games[i].location;
        gameFrame.name = MANIFEST.games[i].title;
        gameFrame.width = "800";
        gameFrame.height = "600";
        gameDiv.appendChild(gameFrame)
        //*/


        // What happens on click
        gameDiv.selected = true;
        gameDiv.displayHideChildren = function (className) {
            let children = this.children;
            this.selected = !this.selected;

            if (this.selected) {
                this.style.display = "";
                this.thumb.src = MANIFEST.games[this.gameIndex].preview;
                this.gameImgDiv.classList.remove("game-expandable");
                this.gameThumbOverlap.classList.add("hidden");

            } else {
                this.style.display = "inline-block";
                this.thumb.src = MANIFEST.games[this.gameIndex].thumbnail;
                this.gameImgDiv.classList.add("game-expandable");
                this.gameThumbOverlap.classList.remove("hidden");
            }
            for (let i = 0; i < children.length; i++) {
                if (children[i].classList.contains(className)) {
                    if (this.selected) {
                        children[i].classList.remove("hidden");
                    } else {
                        children[i].classList.add("hidden");
                    }
                }
                if (children[i].classList.contains("unselected-content")) {
                    if (this.selected) {
                        children[i].classList.add("hidden");
                    } else {
                        children[i].classList.remove("hidden");
                    }
                }
            }
        };
        gameDiv.displayHideChildren("selected-content");

        // Onclick event. Moves up the clicked item and expands its description/preview
        gameDiv.select = function () {
            for (let i = 0; i < document.getElementsByClassName("game-div").length; i++) {
                let currentGameDiv = document.getElementsByClassName("game-div")[i];

                if (this.id == currentGameDiv.id) {
                    if (currentGameDiv.selected) {
                        // Deselecting
                        currentGameDiv.style.width = "";
                        currentGameDiv.style.height = "";
                    } else {
                        // Selecting
                        currentGameDiv.style.width = "100%";
                        currentGameDiv.style.height = "100%";
                        insertAfter(currentGameDiv, id("game-separator"));
                    }

                    currentGameDiv.displayHideChildren("selected-content");
                } else if (currentGameDiv.selected) {
                    currentGameDiv.style.width = "";
                    currentGameDiv.style.height = "";

                    currentGameDiv.displayHideChildren("selected-content");
                }
            }
        }
        gameDiv.onclick = gameDiv.select;

        id("games").appendChild(gameDiv);
    }
}

function insertAfter(newNode, existingNode) {
    existingNode.parentNode.insertBefore(newNode, existingNode.nextSibling);
}
// Returns the website's favicon url
function fetchDomain(url) {
    let splitArray = url.split("/");
    for (let i = 0; i < splitArray.length; i++) {
        if (splitArray[i].includes(".")) {
            return "https://" + splitArray[i];
        }
    }
}
document.addEventListener("DOMContentLoaded", function (event) {

    id("title").style.paddingTop = "50vh";
    id("bottom-bar").style.paddingBottom = "60vh";
    if (folderContent.style.maxHeight == "none") {
        folderContent.style.maxHeight = "50vh";
        id("read-more").innerHTML = "more [▼]"
    } 
    
    setTimeout(function () {
        /*
        title:padding top
        bottom bar:padding bottom
        */
        id("title").style.transition = "padding 1s";
        id("bottom-bar").style.transition = "padding 1s";
        folderContent.style.transition = "max-height 1s";

        id("title").style.paddingTop = "15px";
        id("bottom-bar").style.paddingBottom = "5px";

        folderContent.style.maxHeight = "50vh";
        changeFolder(0);
        if (!(folderContent.style.maxHeight == "none")) {
            folderContent.style.maxHeight = "none";
            folderContent.style.maxHeight = "none";
            id("read-more").innerHTML = "less [▲]"
        }

    }, 1000)
});

/* 
    Defining the folders properties
*/

//Social Folder
id("fold1").properties = {
    content: "social",
    images: ["index/fold1.png", "index/fold1_active.png"]
};

//Games Folder
id("fold3").properties = {
    content: "games",
    images: ["index/fold3.png", "index/fold3_active.png"]
};

//About Folder
id("fold2").properties = {
    content: "about",
    images: ["index/fold2.png", "index/fold2_active.png"]
};

// Adding the click events to the folder icons
for (let i = 0; i < folders.length; i++) {
    folders[i].onclick = function () {
        changeFolder(i);
    };
}

// More / Less Button
id("read-more").onclick = function () {
    moreLessSwap();
}

function moreLessSwap() {
    if (folderContent.style.maxHeight == "none") {
        folderContent.style.maxHeight = "50vh";
        id("read-more").innerHTML = "more [▼]"
    } else {
        folderContent.style.maxHeight = "none";
        folderContent.style.maxHeight = "none";
        id("read-more").innerHTML = "less [▲]"
    }
}

function changeFolder(which) {
    // Stars animation
    stars.boost();
    // If the folder is already active, do nothing
    if (activeFolder == which) {
        //return;
    }
    for (let i = 0; i < folders.length; i++) {
        if (i == which) {
            continue;
        }
        //* Turn off other folders
        id(folders[i].properties.content).style.display = "none";
        folders[i].src = folders[i].properties.images[0];
        folders[i].style.transform = "translate(0%,20%)";
        folders[i].style.zIndex = 0;
    }
    id(folders[which].properties.content).style.display = "block";
    folders[which].style.transform = "";
    activeFolder = which;
    folders[which].src = folders[which].properties.images[1];
    folders[which].style.zIndex = 5;



    if (folderContent.style.maxHeight !== "none") {
        moreLessSwap();
    }
}





















// Canvas
var canvas = id("canvas");
var c = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
canvas.style.position = "fixed";
canvas.style.top = 0;
canvas.style.left = 0;
canvas.style.zIndex = -10;
var meta = {
    ratio: 1,
    starsAmount: (canvas.width * canvas.height / 800 | 0) < MAX_STARS ? (canvas.width * canvas.height / 800 | 0) : MAX_STARS,
    paused: false,
    deltaTime: 1,
    timestamp: Date.now(),
    lastTimestamp: 0,
    perfectFrameTime: 1000 / 60,
    updateDeltaTime: function () {
        this.lastTimestamp = this.timestamp;
        this.timestamp = Date.now();
        this.deltaTime = (this.timestamp - this.lastTimestamp) / this.perfectFrameTime;

    },
    fps: 0,
    fpsCounter: 0,

}
console.log(meta.starsAmount);
setInterval(function () {
    meta.fps = meta.fpsCounter;
    meta.fpsCounter = 0;
}, 1000)


// Moving stars Constructor
class Star {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.w = 2;
        this.h = 2;
        this.speed = Math.random() * 0.1 + 0.05;
        this.xVel = this.speed;
        this.yVel = this.speed;
        this.xVelExt = 0;
        this.yVelExt = 0;
        this.friction = 0.96;
        this.neighbour;
        this.connectNeighbours();
    }
    checkBounds() {
        if (this.x < 0) {
            this.x = canvas.width;
        } else if (this.x + this.w > canvas.width / meta.ratio) {
            this.x = 0;
        }
        if (this.y < 0) {
            this.y = canvas.height;
        } else if (this.y + this.h > canvas.height / meta.ratio) {
            this.y = 0;
        }
    }
    connectNeighbours() {
        let min, updated = false;
        let square = {
            x: 0,
            y: 0,
            w: 100,
            h: 100
        }
        square.x = this.x - square.w / 2;
        square.y = this.y - square.h / 2;
        for (let i = 0; i < stars.length; i++) {
            if (stars[stars[i].neighbour] == this) {
                continue;
            }
            if (stars[i] == this) {
                continue;
            }
            if (!pointSquareCol(stars[i], square)) {
                continue;
            }
            let distance = getDistance(this.x, this.y, stars[i].x, stars[i].y);
            if (min == undefined) {
                min = distance;
                this.neighbour = i;
                updated = true;
            } else if (distance < min) {
                min = distance;
                this.neighbour = i;
                updated = true;
            }

        }
        if (!updated) {
            this.neighbour = undefined;
        }
    }
    compute() {
        if (Math.abs(this.xVelExt) > 0.01) {
            this.xVelExt *= Math.pow(this.friction, meta.deltaTime);
        }
        if (Math.abs(this.yVelExt) > 0.01) {
            this.yVelExt *= Math.pow(this.friction, meta.deltaTime);
        }


        this.x += (this.xVel+this.xVelExt) * meta.deltaTime;
        this.y += (this.yVel+this.yVelExt) * meta.deltaTime;
        this.checkBounds();
    }
    render() {
        this.connectNeighbours();
        if (this.neighbour) {
            c.moveTo(this.x, this.y);
            c.lineTo(stars[this.neighbour].x, stars[this.neighbour].y);
        }

        c.fillStyle = "#bec2cf";
        c.fillRect(
            this.x * meta.ratio,
            this.y * meta.ratio,
            this.w * meta.ratio,
            this.h * meta.ratio)
    }
}
// Stars moving in the background
var stars = [];
stars.boost = function () {
    for (let item of this) {
        item.xVelExt = (Math.random()-0.5)*item.speed * 15;
        item.yVelExt = (Math.random()-0.5)*item.speed * 15;
    }
}
for (let i = 0; i < meta.starsAmount; i++) {
    stars.push(new Star(Math.random() * canvas.width / meta.ratio, Math.random() * canvas.height / meta.ratio))
}
var topSq,
    mainSq,
    footerSq;

function updateHitboxes() {
    topSq = id("top-bar").getBoundingClientRect()
    topSq.w = topSq.width;
    topSq.h = topSq.height;
    mainSq = id("folder-content").getBoundingClientRect()
    mainSq.w = mainSq.width;
    mainSq.h = mainSq.height;

    footerSq = id("bottom-bar").getBoundingClientRect()
    footerSq.w = footerSq.width;
    footerSq.h = footerSq.height;
}

function loop() {
    meta.fpsCounter++;
    // Clears the canvas
    c.clearRect(0, 0, canvas.width, canvas.height);

    // Render stars
    meta.updateDeltaTime();
    updateHitboxes();

    // Starts the lines path
    c.strokeStyle = "#393d4e";
    c.beginPath();
    for (let i = 0; i < stars.length; i++) {
        stars[i].compute();
        if (insideSquare(stars[i], topSq) || insideSquare(stars[i], mainSq) || insideSquare(stars[i], footerSq)) {

            continue;
        }
        stars[i].render();
    }
    // Closes the lines path
    c.closePath();
    c.stroke();

    if (meta.paused) {
        return;
    }
    requestAnimationFrame(loop);
}
loop();

function getDistance(xA, yA, xB, yB) {
    var xDiff = xA - xB;
    var yDiff = yA - yB;
    return Math.sqrt(xDiff * xDiff + yDiff * yDiff);
}

function insideSquare(sq1, sq2) {
    if (sq1.x > sq2.x && sq1.x + sq1.w < sq2.x + sq2.w) {
        if (sq1.y > sq2.y && sq1.y + sq1.h < sq2.y + sq2.h) {
            return true;
        }
    }
    return false;
}

function collided(a, b) {
    var square1 = a.hitbox ? a.hitbox : a;
    var square2 = b.hitbox ? b.hitbox : b;
    if (square1.x < square2.x + square2.w) {
        if (square1.x + square1.w > square2.x) {
            if (square1.y < square2.y + square2.h) {
                if (square1.y + square1.h > square2.y) {
                    return true;
                }
            }
        }
    }
    return false;
}

function pointSquareCol(point, sq) {
    var square = sq;
    if (sq.hitbox !== undefined) {
        square = sq.hitbox;
    }
    if (point.x > square.x) {
        if (point.x < square.x + square.w) {
            if (point.y > square.y) {
                if (point.y < square.y + square.h) {
                    return true;
                }
            }

        }
    }
    return false;
}

window.addEventListener('resize', function () {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    stars.length=0;
    for (let i = 0; i < meta.starsAmount; i++) {
        stars.push(new Star(Math.random() * canvas.width / meta.ratio, Math.random() * canvas.height / meta.ratio))
    }
});