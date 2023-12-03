import { canvas, c } from './modules/canvas/canvas.js';
import { Mouse } from './modules/mouse/mouse.js';
import { Meta } from './modules/meta/meta.js';
import { DrawingTable } from './modules/drawingTable/drawingTable.js';
import { NeuralNetwork } from './modules/neuralNetwork/neuralNetwork.js';
import { soundManager } from './modules/soundManager/soundManager.js';
let meta = new Meta();
let mouse = new Mouse(canvas, meta);
let drawingTable = new DrawingTable(canvas, c, 280, 280);

// Initializing the NN
let neuralNetwork = new NeuralNetwork();
fetch('./save.json')
    .then(response => response.json())
    .then(saveFile => {
        neuralNetwork.loadSettings(saveFile);
        loop();
    });

// Where the guess will be displayed
let responseDiv = document.createElement("div");
document.body.appendChild(responseDiv);
responseDiv.style.position = "absolute";
responseDiv.style.left = (window.innerWidth / 2 | 0) + "px";
responseDiv.style.top = "0px";
responseDiv.style.color = "black";
responseDiv.style.fontSize = "32px";
responseDiv.style.transform = "translate(-50%)";
responseDiv.innerHTML = "Draw a number";
responseDiv.style.textAlign = "center";

let currentGuess = 0;

function loop() {
    meta.compute();
    let drawingData = drawingTable.update(mouse, canvas, c);
    if (drawingData) {
        let guess = neuralNetwork.feedForward(drawingData);
        let numGuess = [0, 0];
        guess.forEach((g, i) => {
            if (g > numGuess[1]) {
                numGuess[0] = i;
                numGuess[1] = g;
            }
        });
        responseDiv.innerHTML = numGuess[0]
        let certainty = ["...but I'm not really sure", "maybe?", "could be", "almost sure", "totally!"]
        responseDiv.innerHTML = "" + numGuess[0] + "<br>" + certainty[numGuess[1] * certainty.length | 0];
        if (numGuess[0] !== currentGuess) {
            currentGuess = numGuess[0];
            soundManager.stopAll();
            soundManager.sounds[numGuess[0] + ''].play(1, numGuess[1] * 2);
        }
    }
    requestAnimationFrame(loop);
}