// DIALOGUE TESTING
/*
var optionList = [];

function validateOptions(charDialogue) {
    dialogueMode = 1;

    id("options").innerHTML = "";
    id("dialogue-ui").style.display = "block";
    optionList = [];
    //guarda tra i dialoghi quale soddisfa le condizioni
    //gli indici li pusha nell'option list

    for (var i = 0; i < charDialogue.length; i++) {
        if (eval(charDialogue[i].condition) || charDialogue[i].condition.length == 0) {
            optionList.push(i);
        }
    }
    //chiama la funzione che si occuperà di mostrare le opzioni disponibili
    generateOptions(charDialogue);
}

function generateOptions(charDialogue) {
    for (var i = 0; i < optionList.length; i++) {
        var newNode = document.createElement("BUTTON");
        newNode.number = optionList[i];
        var textNode = document.createTextNode(charDialogue[newNode.number].option);

        newNode.appendChild(textNode);
        newNode.className = "option";
        newNode.id = "option-" + i;
        id("options").appendChild(newNode);
        newNode.onclick = function () {
            letters(charDialogue[this.number].text, id("output"), true)
            id("output")
            eval(charDialogue[this.number].trigger);
            validateOptions(charDialogue);
        };
    }

}
*/
function validateOptions(charDialogue) {
    dialogueMode = 1;
    optionList = [];
    //guarda tra i dialoghi quale soddisfa le condizioni
    //gli indici li pusha nell'option list
    id("options").innerHTML = "";
    id("dialogue-ui").style.display = "inline-block";

    for (var i = 0; i < charDialogue.length; i++) {
        if (eval(charDialogue[i].condition) || charDialogue[i].condition.length == 0) {
            optionList.push(i);
        }
    }
    //chiama la funzione che si occuperà di mostrare le opzioni disponibili
    generateOptions(charDialogue);
}
var dialogueProgress = 0;
var multipleDialogue = 0;

function generateOptions(charDialogue) {
    for (var i = 0; i < optionList.length; i++) {
        var newNode = document.createElement("BUTTON");
        newNode.number = optionList[i];
        var textNode = document.createTextNode(charDialogue[newNode.number].option);

        newNode.appendChild(textNode);
        newNode.className = "option";
        newNode.id = "option-" + i;
        id("options").appendChild(newNode);
        newNode.onclick = function () {
            //the Next trigger
            var dividedDialogue = charDialogue[this.number].text.split(";");
            if (dividedDialogue.length == 1) {
                dividedDialogue = dividedDialogue[0];
            }
            //useful to determine if program has to show next or option divs
            multipleDialogue = (Array.isArray(dividedDialogue));
            if (multipleDialogue) {

                //what happens if the dialogue IS divided
                letters(dividedDialogue[dialogueProgress], id("output"), true);

                id("next").onclick = function () {
                    dialogueProgress++;
                    if (dialogueProgress < dividedDialogue.length - 1) {
                        letters(dividedDialogue[dialogueProgress], id("output"), true);
                    } else {
                        letters(dividedDialogue[dialogueProgress], id("output"), true);
                        multipleDialogue = false;
                        dialogueProgress = 0;
                    }
                }
            } else {
                //what happens if the dialogue is not divided
                letters(charDialogue[this.number].text, id("output"), true);
            }

            eval(charDialogue[this.number].trigger);

            validateOptions(charDialogue);
        };
    }

}
