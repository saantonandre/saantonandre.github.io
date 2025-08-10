import { Text } from './text/text.js';
export class Counter {
    constructor() {
        this.x = 25 / 2;
        this.y = 1.5;
        this.count = 60;
        this.text = new Text(this.x, this.y);
        this.text.shadow = true;
        this.text.color = '#eb6c82';
        this.text.fontSize = 16;
        this.brickCount = 0;
        this.brickText = new Text(24.5, this.y);
        this.brickText.shadow = true;
        this.brickText.align = 'right';
        this.brickText.shadowColor = '#511e43';
        this.brickText.color = '#e93841';
        this.brickText.fontSize = 16;
    }
    reset() {
        this.count = 60;
        this.brickCount = 0;
    }
    compute(deltaTime) {
        this.count -= (15 / 1000) * deltaTime;
        this.text.content = '' + (this.count | 0);
        if (this.count <= 0) {
            if ((this.count | 0) % 3) {
                this.text.content = "didnt code the rest";
            } else {
                this.text.content = "sorry 'T^T";
            }
            this.text.y = 4;
        }
        this.brickText.content = 'BRICKS: ' + this.brickCount;
    }
    render(context, tilesize, ratio) {
        this.text.render(context, tilesize, ratio);
        this.brickText.render(context, tilesize, ratio);
    }
}