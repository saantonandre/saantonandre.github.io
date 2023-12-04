// Mess: will refactor and iterate over
import { canvas, c } from './canvas/canvas.js';
import { Meta } from './meta/meta.js';

import { Mouse } from './mouse/mouse.js';
import { Game } from './game.js';
import { TitleScreen } from './titleScreen.js';

import { Controls } from './controls/controls.js';

let controls = new Controls();
let meta = new Meta();
let mouse = new Mouse(canvas, meta, { x: 0, y: 0 });
let game = new Game(meta, mouse, controls);
let titleScreen = new TitleScreen(meta, mouse, controls);
meta.setScreenTiles(canvas.width, canvas.height);
console.log(meta.tilesWidth)



export function loop() {
    meta.compute()
    c.clear();
    // Render background
    c.fillStyle = "white";
    c.fillRect(0, 0, canvas.width, canvas.height);

    switch (meta.loopType) {
        case 0: // Title screen
            titleScreen.compute(meta);
            titleScreen.render(c, meta.tilesize, meta.ratio);
            break;
        case 1: // Game loop
            game.compute(meta);
            game.render(c, meta.tilesize, meta.ratio);
            break;
    }
    requestAnimationFrame(loop);
}