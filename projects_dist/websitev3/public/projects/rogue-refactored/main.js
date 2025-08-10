import { c, canvas } from './modules/drawingContext.js';
import { meta } from './modules/meta.js';
import { map } from './modules/map/mapObject.js';
import { player } from './modules/entities/player/player.js';
import { screenShake } from './modules/vfxs/screenShake.js';
import { vfxsManager } from './modules/vfxs/vfxsManager.js';
import { UserInterface } from './modules/userInterface.js';


/**
 * Iterates every frame
 */
const userInterface = new UserInterface(player)

function loop() {
    meta.updateDeltaTime();
    meta.fps++;
    c.clearRect(0, 0, canvas.width, canvas.height);

    switch (meta.loopType) {
        case 0:
            gameLoop();
            break;
        default:
            throw new Error(`The specified type of loop "${meta.loopType}" does not exists`);
    }

    requestAnimationFrame(loop);
}

function gameLoop() {

    c.fillStyle = '#14182e';
    c.fillRect(0, 0, canvas.width, canvas.height);



    map.computeCamera();
    screenShake.compute();
    map.computeEntities();
    map.sortEntities();
    map.render();
    map.renderShadows();
    map.renderEntities();
    vfxsManager.compute();
    vfxsManager.render();


    map.renderMinimap();
    userInterface.compute();
    userInterface.render();

    // Debugging tool
    //debugToolTip.compute();


}


window.onload = loop;