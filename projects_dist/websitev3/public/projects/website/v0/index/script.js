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



fetch('index/games/manifest.JSON')
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
        gameShortcut.href = "#games";

        gameImg = document.createElement("img");
        gameImg.src = MANIFEST.games[i].thumbnail;

        // Save a reference of the img to the game div
        gameDiv.thumb = gameImg;

        gameShortcut.appendChild(gameImg);
        gameImgDiv = document.createElement("div");
        gameImgDiv.classList.add("game-thumb");
        gameImgDiv.appendChild(gameShortcut);

        gameDiv.appendChild(gameImgDiv);

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
        gameSections.appendChild(gameButtons)
        for (let j = 0, tempLink, tempImg; j < MANIFEST.games[i].links.length; j++) {
            // Create website's link
            tempLink = document.createElement("a");
            tempLink.href = MANIFEST.games[i].links[j];
            tempLink.setAttribute("target", "_blank");
            // Fetch website's favicon
            // Create an Image with the favicon
            tempImg = document.createElement("img");
            tempImgSrc = "http://www.google.com/s2/favicons?sz=64&domain=" + fetchDomain(MANIFEST.games[i].links[j]);
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


        // What happens on click (TODO: game player)
        gameDiv.selected = true;
        gameDiv.displayHideChildren = function (className) {
            let children = this.children;
            this.selected = !this.selected;

            if (this.selected) {
                this.style.display = "";
                this.thumb.src = MANIFEST.games[this.gameIndex].preview;

            } else {
                this.style.display = "inline-block";
                this.thumb.src = MANIFEST.games[this.gameIndex].thumbnail;
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
                        currentGameDiv.parentElement.insertBefore(currentGameDiv, currentGameDiv.parentElement.firstChild.nextSibling.nextSibling);
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

// Returns the website's favicon url
function fetchDomain(url) {
    let splitArray = url.split("/");
    for (let i = 0; i < splitArray.length; i++) {
        if (splitArray[i].includes(".")) {
            return "http://" + splitArray[i];
        }
    }
}
// Opening effect on site load
id("title").style.paddingTop = "50vh";
id("bottom-bar").style.paddingBottom = "60vh";
window.onload = setTimeout(function () {
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
    changeFolder(2);

}, 1000)

/* 
    Defining the folders properties
*/

//Social Folder
id("fold1").properties = {
    content: "social",
    bgColor: "#007899",
    bgColor2: "#234975",
    txtColor: "#68aed4",
    images: ["index/fold1.png", "index/fold1_active.png"],
    logo: "index/logo/logo1.png"
};

//Games Folder
id("fold3").properties = {
    content: "games",
    bgColor: "#d62411",
    bgColor2: "#7f0622",
    txtColor: "#ff8426",
    images: ["index/fold3.png", "index/fold3_active.png"],
    logo: "index/logo/logo3.png"
};

//About Folder
id("fold2").properties = {
    content: "about",
    bgColor: "#94216a",
    bgColor2: "#430067",
    txtColor: "#ff80a4",
    images: ["index/fold2.png", "index/fold2_active.png"],
    logo: "index/logo/logo2.png"
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
    // If the folder is already active, do nothing
    if (activeFolder == which) {
        return;
    }
    for (let i = 0; i < folders.length; i++) {
        if (i == which) {
            continue;
        }
        //* Turn off other folders
        id(folders[i].properties.content).style.display = "none";
        folders[i].src = folders[i].properties.images[0];
        folders[i].style.zIndex = 0;
        //*/
    }
    id(folders[which].properties.content).style.display = "block";
    activeFolder = which;
    folders[which].src = folders[which].properties.images[1];
    folders[which].style.zIndex = 1;


    /*
    folderContent.style.backgroundColor = folders[which].properties.bgColor;
    //*/
    folderContent.style.backgroundColor = folders[which].properties.bgColor;




    document.body.style.backgroundColor = folders[which].properties.bgColor2;
    id("logo").src = folders[which].properties.logo;

    for (let i = 0; i < contentTitle.length; i++) {
        /*
        contentTitle[i].style.backgroundColor = folders[which].properties.txtColor;
        //*/
        contentTitle[i].style.borderBottom = "5px solid " + folders[which].properties.txtColor;
    }

    for (let i = 0; i < links.length; i++) {
        links[i].style.color = folders[which].properties.bgColor;
    }

    for (let i = 0; i < specialText.length; i++) {
        specialText[i].style.color = folders[which].properties.txtColor;
    }
    if (folderContent.style.maxHeight !== "none") {
        moreLessSwap();
    }
}