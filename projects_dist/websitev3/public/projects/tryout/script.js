window.onload = function () {
    function id(arg) {
        return document.getElementById(arg);
    }
    var moneys = 1000;
    var text1 = id('text1');
    //var hello = "Hello! How can I help you?";
    var hello = "Hello! What are you here for?";
    var endTrigger = true;
    var specials = "?!.,;-";
    var t1 = id('t1'),
        t2 = id('t2'),
        t3 = id('t3');
    var talk = [t1, t2, t3];
    id('door').onclick = function () {
        talk[2].play();
    }
    id('door').ondblclick = function () {
        id('door').style.display = "none";
        setTimeout(function () {
            id('welcome').style.display = "block";
            id('welcome').style.animation = "options 1s forwards";
            letters(hello, text1);
        }, 1000);
    }
    var oneSentence = false;

    // Displays letters 1 by 1, with audio too
    function letters(string, div) {
        clearTimeout(oneSentence);
        div.innerHTML = "";
        endTrigger = false;
        var i = 0,
            j = 0,
            pause = 80;
        next();


        function next() {
            if (pause >= 80)
                talk[Math.floor(Math.random() * 2)].play();

            div.innerHTML += string[i];
            i++;
            if (i < string.length) {
                pause = 80;
                //checks for longer pauses
                for (j = 0; j < specials.length; j++) {
                    if (string[i - 1] === specials[j]) {
                        pause = 250;
                        break;
                    }
                }
                if (string[i - 1] === " ") {
                    pause = 40;
                }
                oneSentence = setTimeout(next, pause);
            } else {
                if (string == hello) {
                    id("options").style.display = "block";
                } else if (string == letssee) {
                    id("musicPlayer").style.display = "block";
                    playMusic();
                } else if (string == shop) {
                    openShop();
                }
            }

        }
    }

    // Options listeners

    var shop = "Ok then, this is all I can give you.",
        guessfine = "K guess its fine... have fun",
        metoo = "me too! :3",
        letssee = "Lets see what I've got",
        thanks = "thanks for checking out my stuff!";

    /*id("iframe").src = "../" + games[Math.floor(Math.random() * games.length)];*/

    id("op1").onclick = function () {
        letters(shop, text1);
    }
    id("op2").onclick = function () {
        letters(guessfine, text1);
    }
    id("op3").onclick = function () {
        letters(metoo, text1);
    }
    id("op4").onclick = function () {
        letters(letssee, text1);
    }

    // Music Player START
    var songs = ['anotherSong.wav', 'creep.wav', 'creep2.wav', 'creep3.wav', 'doggo_theme.wav', 'sillymusic.mp3', 'something.wav'];
    var songCount = Math.floor(Math.random() * songs.length);
    var song = false;
    setInterval(function () {
        var time = new Date().toLocaleTimeString();
        id("musicSpan").innerHTML = "currently playing: \"" + songs[songCount] + "\" - current time: " + time;
    }, 1000);

    function playMusic() {
        if (songCount >= songs.length) {
            songCount = 0;
        } else if (songCount < 0) {
            songCount = songs.length - 1;
        }
        if (song) {
            song.pause();
        }
        song = new Audio('music/' + songs[songCount]);
        song.loop = false;
        song.onended = function () {
            songCount++;
            playMusic();
        }
        song.play();
        id("stop").onclick = function () {
            song.pause();
            id("musicPlayer").style.display = "none";
        }
        id("prev").onclick = function () {
            songCount--;
            playMusic();
        }
        id("next").onclick = function () {
            songCount++;
            playMusic();
        }

    }
    //Music Player END
    //Games Shop
    var moneys = 1000;
    var coinsound = new Audio("sfx/coinsound.mp3");
    var Items = document.getElementsByClassName("items");

    window.buyStuff = function (elem) {
        coinsound.play();
        moneys -= 100;
        id("moneys").innerHTML = "moneys: " + moneys + " G";
        elem.parentNode.removeChild(elem);
        Items = document.getElementsByClassName("items");
        switch (Items.length) {
            case 3:
                letters("best buy, 10/10", text1);
                break;
            case 2:
                letters("thats a nice one", text1);
                break;
            case 1:
                letters("I liked that too", text1);
                break;
            case 0:
                letters("how did you get so much money?!", text1);
                break;
        }
    }

    function openShop() {
        id("options").style.display = "none";
        id("shopCont").style.display = "block";

    }
    id("exitShop").onclick = function () {
        id("options").style.display = "block";
        id("shopCont").style.display = "none";
        letters(thanks, text1);
    }
    //IFRAME CONSOLE START

    var games = ['AV.htm', 'cosmicrunner.htm', 'ShooterGuy.htm', 'TurretsDuel.html', 'gold.htm'];
    var programs = ['catgame.htm', 'codeit.htm', 'loading.htm', 'SpeedRepresentation.htm', 'wa.htm'];

}
