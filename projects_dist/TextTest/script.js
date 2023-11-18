class SpriteFont {
    constructor() {
        this.sheet = document.getElementById("sheet");
        this.actionArr = [];
        this.x = 0;
        this.y = 0;
        this.currentLetter = 1;
        this.lettersX = [
            0, 0, 0, 0, 0,
            0, 0, 0, 0, 0,
            0, 0, 0, 0, 0,
            0, 0, 0, 0, 0,
            0, 0, 0, 0, 0,
            0, 1, 1, 1, 1,
            1, 1, 1, 1, 1,
            1, 1, 1, 1, 1,
            1
        ]
        this.lettersY = [
            0, 1, 2, 3, 4,
            5, 6, 7, 8, 9,
            10, 11, 12, 13,
            14, 15, 16, 17,
            18, 19, 20, 21,
            22, 23, 24, 25,
            0, 1, 2, 3, 4,
            5, 6, 7, 8, 9,
            10, 11, 12, 13,
            14
        ]
        this.tileSize = 8;

    }
    printLine(string, x, y) {
        this.x = x;
        this.y = y;
        for (let char of string) {
            this.printCharacter(char, this.x, this.y);
        }
    }
    printCharacter(char) {
        this.space = false;
        switch (char) {
            case 'a':
            case 'A':
                this.currentLetter = 0;
                break;
            case 'b':
            case 'B':
                this.currentLetter = 1;
                break;
            case 'c':
            case 'C':
                this.currentLetter = 2;
                break;
            case 'd':
            case 'D':
                this.currentLetter = 3;
                break;
            case 'e':
            case 'E':
                this.currentLetter = 4;
                break;
            case 'f':
            case 'F':
                this.currentLetter = 5;
                break;
            case 'g':
            case 'G':
                this.currentLetter = 6;
                break;
            case 'h':
            case 'H':
                this.currentLetter = 7;
                break;
            case 'i':
            case 'I':
                this.currentLetter = 8;
                break;
            case 'j':
            case 'J':
                this.currentLetter = 9;
                break;
            case 'k':
            case 'K':
                this.currentLetter = 10;
                break;
            case 'l':
            case 'L':
                this.currentLetter = 11;
                break;
            case 'm':
            case 'M':
                this.currentLetter = 12;
                break;
            case 'n':
            case 'N':
                this.currentLetter = 13;
                break;
            case 'o':
            case 'O':
                this.currentLetter = 14;
                break;
            case 'p':
            case 'P':
                this.currentLetter = 15;
                break;
            case 'q':
            case 'Q':
                this.currentLetter = 16;
                break;
            case 'r':
            case 'R':
                this.currentLetter = 17;
                break;
            case 's':
            case 'S':
                this.currentLetter = 18;
                break;
            case 't':
            case 'T':
                this.currentLetter = 19;
                break;
            case 'u':
            case 'U':
                this.currentLetter = 20;
                break;
            case 'v':
            case 'V':
                this.currentLetter = 21;
                break;
            case 'w':
            case 'W':
                this.currentLetter = 22;
                break;
            case 'x':
            case 'X':
                this.currentLetter = 23;
                break;
            case 'y':
            case 'Y':
                this.currentLetter = 24;
                break;
            case 'z':
            case 'Z':
                this.currentLetter = 25;
                break;
            case '1':
                this.currentLetter = 26;
                break;
            case '2':
                this.currentLetter = 27;
                break;
            case '3':
                this.currentLetter = 28;
                break;
            case '4':
                this.currentLetter = 29;
                break;
            case '5':
                this.currentLetter = 30;
                break;
            case '6':
                this.currentLetter = 31;
                break;
            case '7':
                this.currentLetter = 32;
                break;
            case '8':
                this.currentLetter = 33;
                break;
            case '9':
                this.currentLetter = 34;
                break;
            case '0':
                this.currentLetter = 35;
                break;
            case '.':
                this.currentLetter = 36;
                break;
            case ',':
                this.currentLetter = 37;
                break;
            case '!':
                this.currentLetter = 38;
                break;
            case '?':
                this.currentLetter = 39;
                break;
            case ' ':
                this.space = true;
                break;
            default:
                this.currentLetter = 40;

        }
        if (!this.space) {
            c.drawImage(
                this.sheet,
                this.lettersX[this.currentLetter] * this.tileSize,
                this.lettersY[this.currentLetter] * this.tileSize,
                this.tileSize,
                this.tileSize,
                this.x,
                this.y,
                this.tileSize,
                this.tileSize
            )
        }
        this.x += this.tileSize;
    }
}
var canvas = document.getElementById("canvas");
var testAmount = 1;
canvas.width = window.innerWidth;
var offsetY = 2;
canvas.height = testAmount * offsetY + 180;
console.log(canvas.height)
var c = canvas.getContext("2d");
var spriteFont = new SpriteFont();
c.imageSmoothingEnabled = false;
var fps = 0;
loop();
var amountInput = document.getElementById("amount");
amountInput.oninput = () => {
    testAmount = parseInt(amountInput.value, 10)
    canvas.height = testAmount * offsetY + 180;
};

var drawImageRendering = true;

var drawButton = document.getElementById("drawImage");
drawButton.onclick = () => {drawImageRendering = true}
var fillButton = document.getElementById("fillText");
fillButton.onclick = () => {drawImageRendering = false}


function loop() {
    fps++;
    c.clearRect(0, 0, canvas.width, canvas.height)

    if (drawImageRendering) {
        renderSpriteFont(testAmount);
    } else {
        renderCanvasFont(testAmount);
    }
    requestAnimationFrame(loop);
}

// Render using the context font
function renderCanvasFont(amount) {
    for (let i = 0; i < amount; i++) {
        c.font = "14px Consolas";
        c.fillText("Testing fillText performance. Set the rendering amount in the left input", 80, 80 + offsetY * i);
    }

}

// Render using the sprite sheet font
function renderSpriteFont(amount) {
    for (let i = 0; i < amount; i++) {
        spriteFont.printLine("Testing drawImage performance. Set the rendering amount in the left input", 80, 80 + offsetY * i);
    }
}

// FPS counter
setInterval(function () {
    document.getElementById("fps").innerHTML = "FPS: " + fps;
    fps = 0;
}, 1000)