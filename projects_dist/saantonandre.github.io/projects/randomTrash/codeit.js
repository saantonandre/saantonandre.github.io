window.onload = function () {
    var play = document.getElementById("play");
}
setTimeout(playit, 3000);
setTimeout(stop, 11000);

function playit() {
    play.width = "100";
    play.height = "166";
    play.scrolling = "no";
    play.frameborder = "no";
    play.allow = "autoplay";
    play.src = "dropit.mp3";
}

function stop() {
    play.src = "";
}
