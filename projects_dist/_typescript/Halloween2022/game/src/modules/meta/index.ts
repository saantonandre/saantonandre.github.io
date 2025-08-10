

export class Meta {
  /** The rendering's unit of measurement, expressed in pixels */
  tilesize = 16;
  baseRatio = 2;
  /** Acts on the size of each pixel */
  ratio = this.baseRatio;
  /** Frames per second */
  fps = 0;
  /** Defines whether the fps span will be initialized/displayed */
  displayFps = false;
  /** Game time multiplier */
  deltaTime = 1;
  /** Target frames per second */
  targetFrames = 60;
  /** Target frame time */
  perfectFrameTime = 1000 / this.targetFrames;
  lastTimestamp = Date.now();
  timestamp = Date.now();
  /** Defines the type of the game's loop, A.K.A. 'scene' */
  loopType = 0;
  baseTilesWidth = window.innerWidth/this.tilesize/this.ratio;
  baseTilesHeight = window.innerHeight/this.tilesize/this.ratio;
  /** Number of tiles displayed on screen (width) */
  tilesWidth = this.baseTilesWidth;
  /** Number of tiles displayed on screen (height) */
  tilesHeight = this.baseTilesHeight;
  constructor() {
    this.init();
  }
  /** Initializes the fps counter if displayFps == true */
  init = () => {
    if (this.displayFps) {
      // Creates and styles the html element where the fps will be displayed
      let fpsSpan = document.createElement("span");
      fpsSpan.style.position = "absolute";
      fpsSpan.style.color = "black";
      fpsSpan.style.left = "5px";
      fpsSpan.style.top = "5px";
      // Places it as a child of the html body
      document.body.appendChild(fpsSpan);

      // Calls the fpsCounter function once every second
      setInterval(() => {
        this.fpsCounter(fpsSpan);
      }, 1000);
    }
  };
  changeRatio=(newValue:number)=>{
    this.ratio = newValue;
    this.tilesWidth = window.innerWidth/this.tilesize/this.ratio;
    this.tilesHeight = window.innerHeight/this.tilesize/this.ratio;
  }
  changeBaseRatio=(newValue:number)=>{
    this.baseRatio = newValue;
    this.baseTilesWidth = window.innerWidth/this.tilesize/this.ratio;
    this.baseTilesHeight = window.innerHeight/this.tilesize/this.ratio;
  }
  /** Updates deltaTime and the fps counter */
  compute = () => {
    this.fps += 1;
    this.updateDeltaTime();
  };
  /** Calculates the difference (delta) of the time elapsed and supposed game speed  */
  updateDeltaTime = () => {
    this.lastTimestamp = this.timestamp;
    this.timestamp = Date.now();
    this.deltaTime =
      (this.timestamp - this.lastTimestamp) / this.perfectFrameTime;

    // Forces the time multiplication to be at max two times the norm
    if (this.deltaTime > 2) {
      this.deltaTime = 2;
    }
  };

  /** Keeps count of the fps, called in a setInterval.
   * @param {HTMLSpanElement} span The html element where to display the fps variable
   */
  fpsCounter = (span:HTMLSpanElement) => {
    span.innerHTML = String(this.fps);
    this.fps = 0;
  };
}
// export const meta = new Meta();
export default Meta;