
/*
    The dialogue engine requires the speaker to have the following properties:
    x:
    y:
    w:
    h:
    voices:an array of 6 audio elements

*/
class DialogueEngine {
    constructor() {
        this.wholeText = "";
        this.textProgress = "";
        this.splittedText = [];
        this.baseSlowness = 3;
        this.frameCounter = 0;
        this.savedCameraFocus = map.cameraFocus;
        this.fontSize = 10;

        this.pressButton = {
            sheet: id("pressButton"),
            baseSlowness: 5,
            frameCounter: 0,
            frame: 0,
        }

        this.speaker = player;

        this.currentAudio = 0;
        this.active = false;

        this.dialoguesQueue = [];
        this.finished = false;

        this.textbox = {
            x: this.speaker.x,
            y: this.speaker.y,
            w: 12,
            h: 1
        }
    }
    resetTextProgress() {
        this.textProgress = this.wholeText;
        for (let i = 0; i < this.textProgress.length; i++) {
            this.textProgress[i] = "";
        }
    }
    loadDialogueQueue(queue) {
        this.active = true;
        this.dialoguesQueue = queue;
        this.nextDialogue();
        /*
        Example queue:
        
        
        let dialogue={
        speaker:this,
        text:"fanculo la vita tristezza infinita"
        };
        dialogueEngine.loadDialogueQueue([dialogue]);
        
        */
    }
    nextDialogue() {
        this.wholeText = this.dialoguesQueue[0].text;
        this.speaker = this.dialoguesQueue[0].speaker;
        this.textProgress = "";
        this.splittedText = []
        this.dialoguesQueue.splice(0, 1);
    }
    nextLetter() {
        if (this.textProgress.length < this.wholeText.length) {
            this.finished = false;
            this.frameCounter += 1 * meta.deltaTime;
            if (this.frameCounter > this.baseSlowness) {
                this.frameCounter = 0;
                this.textProgress += this.wholeText[this.textProgress.length];
                // Retrieves the text with newlines, depending on thetextbox width
                this.splittedText = getLines(c, this.textProgress, this.textbox.w * meta.tilesize * meta.ratio)
            }
        } else {
            this.finished = true;
        }
        switch (this.wholeText[this.textProgress.length]) {
            case ".":
            case " ":
            case "'":
            case ":":
            case "?":
            case "!":
            case "(":
            case ")":
                this.nextLetter();
                break;

        }
    }
    compute() {
        if (!this.active) {
            return;
        }
        if(this.speaker.removed){
            this.active = false;
        }
        this.textbox.x = this.speaker.x+this.speaker.w/2 - this.textbox.w/2;
        this.textbox.y = this.speaker.y - 1.5;

        // Counts the frame to then add a single letter
        this.nextLetter();
        if (!this.finished) {
            if (this.speaker.voice[this.currentAudio].paused) {
                this.currentAudio = (Math.random() * 6) | 0;
                this.speaker.voice[this.currentAudio].playy();
            }
        } else {
            this.speaker.voice[this.currentAudio].pause();
        }
    }
    render() {
        if (!this.active) {
            return;
        }
        // Draws the text
        c.textAlign = "left";
        c.font = this.fontSize * meta.ratio + "px" + " 'VT323'";
        c.fillStyle = "#f9f5ef";

        for (let i = 0; i < this.splittedText.length; i++) {
            c.fillText(
                this.splittedText[i],
                ((this.textbox.x + map.x) * meta.tilesize * meta.ratio),
                ((this.textbox.y + map.y) * meta.tilesize * meta.ratio) + (this.fontSize * meta.ratio * (i + 1)) / 1.2
            )
        }


        if (this.finished) {
            // what to do when the dialogue ends
        }
    }
}

function getLines(ctx, text, maxWidth) {
    var words = text.split(" ");
    var lines = [];
    var currentLine = words[0];

    for (var i = 1; i < words.length; i++) {
        var word = words[i];
        var width = ctx.measureText(currentLine + " " + word).width;
        if (width < maxWidth) {
            currentLine += " " + word;
        } else {
            lines.push(currentLine);
            currentLine = word;
        }
    }
    lines.push(currentLine);
    return lines;
}
