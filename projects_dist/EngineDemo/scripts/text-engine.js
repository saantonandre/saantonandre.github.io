var oneSentence = false;
var specials = "?!.,;-";
var sentence = 0;

var sentence = 0;

var t1 = new Audio("resources/sfx/talk1.wav"),
    t2 = new Audio("resources/sfx/talk2.wav"),
    t3 = new Audio("resources/sfx/talk3.wav");
var talk = [t3, t2, t3];

function letters(string, div, audio) {
    div.innerHTML = "";
    id("options").style.display = "none";
    id("next").style.display = "none";
    var length = 0;
    endTrigger = false;
    var i = 0,
        j = 0,
        pause = 60;
    next();


    function next() {

        length++;
        if (length == string.length) {
            if (multipleDialogue) {
                id("options").style.display = "none";
                id("next").style.display = "inline-block";
            } else {
                id("options").style.display = "inline-block";
                id("next").style.display = "none";
            }
        }
        if (pause >= 60) {
            if (audio) {
                var rand = Math.floor(Math.random() * 3);
                talk[rand].play();
            }
        }

        div.innerHTML += string[i];
        i++;
        if (i < string.length) {
            pause = 60;
            //checks for longer pauses
            for (j = 0; j < specials.length; j++) {
                if (string[i - 1] === specials[j]) {
                    pause = 200;
                    break;
                }
            }
            if (string[i - 1] === " ") {
                pause = 30;
            }
            if (dialogueMode)
                oneSentence = setTimeout(next, pause);
            else
                clearTimeout(next, pause);
        }

    }
}
