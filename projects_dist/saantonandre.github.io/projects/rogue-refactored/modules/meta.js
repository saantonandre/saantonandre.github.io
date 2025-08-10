/**
 *  Holders of necessary game variables
 */
class Meta {
    constructor() {
        this.fps = 0; // Current frames per second
        this.loopType = 0; // Current game loop (eg: Game, Menu, Transition)
        this.baseRatio = 2;
        this.ratio = this.baseRatio; // Width and height of each pixel
        this.deltaTime = 1; // The ratio at which the game is getting computed (changes every frame)
        this.targetFrames = 60; // The game speed/expected frames per second
        this.tileSize = 16; // Size of each single cell
        this.baseTilesWidth = 25;
        this.baseTilesHeight = 19;
        this.tilesWidth = this.baseTilesWidth; // Number of tiles displayed on screen (width)
        this.tilesHeight = this.baseTilesHeight; // Number of tiles displayed on screen (height)

        this.font = 'Consolas, monaco, monospace';
        // Delta Time Computing
        this.perfectFrameTime = 1000 / this.targetFrames;
        this.lastTimestamp = Date.now();
        this.timestamp = Date.now();
        //this.bulletTime = false;

        this.fpsCounter.bind(this);
        setInterval(this.fpsCounter, 1000);
    }
    updateDeltaTime() {
        this.lastTimestamp = this.timestamp;
        this.timestamp = Date.now();
        this.deltaTime =
            (this.timestamp - this.lastTimestamp) / this.perfectFrameTime;

        // Forces the max slowness as half the fps target
        if (this.deltaTime > 2) {
            this.deltaTime = 2;
        }
    }
    fpsCounter() {
        // Keeps count of the fps, called in a setInterval.
        //console.log(this.fps);
        this.fps = 0;
    }
}

export const meta = new Meta();