function id(arg) {
    return document.getElementById(arg);
}
var characters = ["guy", "elder", "linda"];
var dialogues = [
    function () {
        letters("Obsessed with your sins, you travel looking for a distant friend, Sophie, who promised to save you.", id("storytext"), false)
            }
            ]
var fullScreen = false;
id("FS-check").onclick = function () {
    if (fullScreen) {
        fullScreen = false;
        console.log(fullScreen)
    } else {
        fullScreen = true;
        console.log(fullScreen)
    }
}
id("start").onclick = function () {
    if (fullScreen) {
        openFullscreen();
    }
    id("main-menu").style.display = "none";
    id("game-screen").style.display = "block";
}
id("closeDialogue").onclick = function () {
    id("dialogue-ui").style.display = "none";
    id("output").innerHTML = "";
    dialogueMode = false;
    requestAnimationFrame(loop);
}
var elem = document.documentElement;

/* View in fullscreen */
function openFullscreen() {
    if (elem.requestFullscreen) {
        elem.requestFullscreen();
    } else if (elem.mozRequestFullScreen) { /* Firefox */
        elem.mozRequestFullScreen();
    } else if (elem.webkitRequestFullscreen) { /* Chrome, Safari and Opera */
        elem.webkitRequestFullscreen();
    } else if (elem.msRequestFullscreen) { /* IE/Edge */
        elem.msRequestFullscreen();
    }
}
/* Close fullscreen */
function closeFullscreen() {
    if (document.exitFullscreen) {
        document.exitFullscreen();
    } else if (document.mozCancelFullScreen) { /* Firefox */
        document.mozCancelFullScreen();
    } else if (document.webkitExitFullscreen) { /* Chrome, Safari and Opera */
        document.webkitExitFullscreen();
    } else if (document.msExitFullscreen) { /* IE/Edge */
        document.msExitFullscreen();
    }
}
