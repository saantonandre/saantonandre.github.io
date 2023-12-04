import { Entity } from './entities/entity.js';
import { soundManager } from './soundManager/soundManager.js';
let sounds = soundManager.sounds;
export class TitleScreen {
    constructor(meta, mouse, controls) {
        this.playButton = new PlayButton();
        this.background = new Background(meta);
        this.mouse = mouse;
        this.controls = controls
    }
    compute(meta) {
        this.playButton.compute(meta, this.mouse, this.controls);
    }
    render(context, tilesize, ratio) {
        this.background.render(context, tilesize, ratio);
        this.playButton.render(context, tilesize, ratio);
    }
}
class PlayButton extends Entity {
    constructor() {
        super(11, 10);
        this.w = 3;
        this.h = 1;
        this.setAnimation('idle', [0], [17])
        this.setAnimation('hover', [3], [17])
    }
    compute(meta, mouse, controls) {
        if (this.physics.pointSquareCol(mouse, this)) {
            this.animation = 'hover';
            if (controls.lClickDown) {
                //Clicked Play
                meta.loopType = 1;
                controls.reset();
                sounds['theme'].play(0.4);
            }
        } else {
            this.animation = 'idle';
        }
    }
    render(context, tilesize, ratio) {
        this.renderSprite(context, tilesize, ratio);
    }
}
import { title } from './resourceManager.js';
class Background extends Entity {
    constructor(meta) {
        super();
        this.x = 0;
        this.y = 0;
        this.w = meta.tilesWidth;
        this.h = meta.tilesHeight;
        this.sheet = title;
        this.setAnimation('idle', [0], [0]);
    }
    render(context, tilesize, ratio) {
        this.renderSprite(context, tilesize, ratio);
    }
}