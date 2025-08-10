/*
dialogueEngine.loadDialogueQueue([{
            speaker: 0,
            emotion: 1,
            text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit."
        }, {
            speaker: 3,
            emotion: 2,
            text: "madonna zoccolaaaaaa"
        }])

*/


class DialogueEngine {
    constructor() {
        this.template = id("template");
        this.templateX = (canvas.width - this.template.width * GLOBAL.ratio) / 2;
        this.templateY = canvas.height - this.template.height;
        this.wholeText = "";
        this.textProgress = "";
        this.splittedText = [];
        this.baseSlowness = 2;
        this.frameCounter = 0;
        this.savedCameraFocus = map.cameraFocus;
        this.fontSize = 24;

        this.pressButton = {
            sheet: id("pressButton"),
            baseSlowness: 5,
            frameCounter: 0,
            frame: 0,
        }

        this.portraitsSheet = id("portraits");
        this.speaker = 0;
        this.portraits = [0, 80, 160, 240, 320];
        this.emotion = 3;

        this.active = false;

        this.dialoguesQueue = [];
        this.finished = false;

        this.textbox = {
            x: this.templateX,
            y: this.templateY,
            w: 0,
            h: 0
        }

        this.portraitBox = {
            x: this.templateX,
            y: this.templateY,
            w: 0,
            h: 0
        }
        this.buttonPressed = true;
    }
    resetTextProgress() {
        this.textProgress = this.wholeText;
        for (let i = 0; i < this.textProgress.length; i++) {
            this.textProgress[i] = "";
        }
    }
    loadDialogueQueue(queue) {
        this.savedCameraFocus = map.cameraFocus;
        this.active = true;
        this.dialoguesQueue = queue;
        this.nextDialogue();
        /*
        Example queue:
        
        
        var dialogue={
        speaker:0,
        emotion:1,
        text:"fanculo la vita tristezza infinita",
        cameraFocus:map.tiles[0]
        };
        dialogueEngine.loadDialogueQueue([dialogue]);
        
        */
    }
    nextDialogue() {
        this.speaker = this.dialoguesQueue[0].speaker;
        this.emotion = this.dialoguesQueue[0].emotion;
        this.wholeText = this.dialoguesQueue[0].text;
        this.textProgress = "";
        this.splittedText = []
        if (this.dialoguesQueue[0].cameraFocus) {
            map.cameraFocus = this.dialoguesQueue[0].cameraFocus;
        }
        this.dialoguesQueue.splice(0, 1);
    }
    nextLetter() {
        if (this.textProgress.length < this.wholeText.length) {
            this.finished = false;
            this.frameCounter += 1 * dT;
            if (this.frameCounter > this.baseSlowness) {
                this.frameCounter = 0;
                this.textProgress += this.wholeText[this.textProgress.length];
                // Retrieves the text with newlines, depending on thetextbox width
                this.splittedText = getLines(c, this.textProgress, this.textbox.w)
            }
        } else {
            this.finished = true;
        }
    }
    areThereImputs() {
        // Checks if an input has been submitted, and decides what to do
        if ((!controls.down && !controls.e) && this.buttonPressed) {
            this.buttonPressed = false;
        }
        if ((controls.down || controls.e) && !this.buttonPressed) {
            this.buttonPressed = true;
            if (!this.finished) {
                this.textProgress = this.wholeText;
                this.splittedText = getLines(c, this.textProgress, this.textbox.w);
            } else {
                if (this.dialoguesQueue.length > 0) {
                    this.nextDialogue();
                } else {
                    this.active = false;
                    map.cameraFocus = this.savedCameraFocus;
                }
            }
        }
    }
    compute() {
            player.uncontrollable=true;
        if (!this.active) {
            player.uncontrollable=false;
            return;
        }
        this.areThereImputs();
        this.templateX = (canvas.width - this.template.width * GLOBAL.ratio) / 2;
        this.templateY = canvas.height - this.template.height * GLOBAL.ratio;
        this.textbox.x = this.templateX + 96 * GLOBAL.ratio;
        this.textbox.y = this.templateY + 18 * GLOBAL.ratio;
        this.textbox.w = 304 * GLOBAL.ratio;
        this.textbox.h = 64 * GLOBAL.ratio;

        this.portraitBox.x = this.templateX + 8 * GLOBAL.ratio;
        this.portraitBox.y = this.templateY + 8 * GLOBAL.ratio;
        this.portraitBox.w = 80 * GLOBAL.ratio;
        this.portraitBox.h = 80 * GLOBAL.ratio;

        // Counts the frame to then add a single letter
        this.nextLetter();
    }
    render() {
        if (!this.active) {
            return;
        }
        // Renders the template
        c.drawImage(
            this.template,
            this.templateX,
            this.templateY,
            this.template.width * GLOBAL.ratio,
            this.template.height * GLOBAL.ratio
        )
        // Renders the portrait
        c.drawImage(
            this.portraitsSheet,
            80 * this.emotion,
            this.portraits[this.speaker],
            80,
            80,
            this.portraitBox.x,
            this.portraitBox.y,
            this.portraitBox.w,
            this.portraitBox.h
        )
        /*
        c.fillStyle = "white";
        c.fillRect(
            this.textbox.x,
            this.textbox.y,
            this.textbox.w,
            this.textbox.h)
        */

        // Draws the text
        c.textAlign = "left";
        c.font = this.fontSize * GLOBAL.ratio + "px" + " 'VT323'";
        c.fillStyle = "#f9f5ef";

        /* color gradient
        let gradient = c.createLinearGradient(canvas.offsetLeft, canvas.offsetTop + canvas.height, canvas.offsetLeft + canvas.width, canvas.offsetTop);
        gradient.addColorStop(0, "#9a407e");
        gradient.addColorStop(0.5, "#f9f5ef");
        gradient.addColorStop(1, "#d88038");
        c.fillStyle = gradient;
*/

        for (let i = 0; i < this.splittedText.length; i++) {
            c.fillText(
                this.splittedText[i],
                this.textbox.x,
                this.textbox.y + (this.fontSize * GLOBAL.ratio * (i + 1)) / 1.2
            )
        }
        if (this.finished) {

            c.fillStyle = "white";
            this.pressButton.frameCounter += 1 * dT;
            if (this.pressButton.frameCounter > this.pressButton.baseSlowness) {
                this.pressButton.frameCounter = 0;
                this.pressButton.frame++;
                if (this.pressButton.frame > 3) {
                    this.pressButton.frame = 0;
                }
            }

            c.drawImage(
                this.pressButton.sheet,
                0,
                16 * this.pressButton.frame,
                16,
                16,
                this.templateX + 394 * GLOBAL.ratio,
                this.templateY + 78 * GLOBAL.ratio,
                16 * GLOBAL.ratio,
                16 * GLOBAL.ratio)



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
