import { SoundStream } from './modules/sound.js';
import { canvas, c } from './modules/canvas/canvas.js';
import { Meta } from './modules/meta/meta.js';
import { Entity } from './modules/entity/entity.js'
const meta = new Meta();
const soundStream = new SoundStream();
soundStream.initialize().then(loop);

class Player extends Entity {
    constructor(x, y) {
        super(x, y)
        this.x = x;
        this.y = y;
        this.w = 30;
        this.h = 30;
        this.gForce = 0.1;
        this.controls = {
            left: false,
            right: false,
            jump: false
        }
    }
    applyGravity(deltaTime) {
        if (!this.grounded) {
            this.yVel += this.gForce * deltaTime;
        }
    }
    computeInput(deltaTime, soundID) {
        switch (soundID) {
            case 6:
                this.xVelExt += 0.5 *deltaTime;
                break;
            case 4:
                this.xVelExt -= 0.5 *deltaTime;
                break;
                case 16:
                    case 17:
            case 18:
                this.jump(deltaTime);
                break;

        }
    }
    jump(deltaTime){
        if(this.grounded){
            console.log("Jumping")
            this.grounded = false;
            this.yVel -= 3*deltaTime;
        }
    }
    compute(deltaTime, environment = [], soundID) {
        this.computeInput(deltaTime, soundID);
        this.applyGravity(deltaTime);
        this.updateVelocities(deltaTime);
        this.checkCollisions(this, environment, deltaTime);
        this.updatePosition(deltaTime);
        this.updateHitbox();
    }
    render(context, tilesize, ratio, camera = { x: 0, y: 0 }) {
        this.renderHitbox(context, tilesize, ratio, camera)
    }
}

let player = new Player(canvas.width / 2, 0);
window.player  = player;
let map = [];
let floor = new Entity(0, canvas.height / 2);
floor.w = canvas.width;
floor.h = 10;
floor.immovable = true;
map.push(floor)

function loop() {
    meta.compute();
    soundStream.update();
    c.clearRect(0, 0, canvas.width, canvas.height)
    let maxID = soundStream.maxIndex();
    document.getElementById("log").innerHTML = maxID;

    player.compute(meta.deltaTime, map, maxID);
    player.render(c, meta.tilesize, meta.ratio);

    map.map(entity => {
        entity.compute();
        entity.renderHitbox(c, meta.tilesize, meta.ratio);
    })


    requestAnimationFrame(loop)
}