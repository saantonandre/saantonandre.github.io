export type MetaLike = {
  tilesize: number;
  ratio: number;
};
export type CameraLike = {
  x: number;
  y: number;
};
export class Mouse {
  x = 0;
  y = 0;
  gui={
    x: 0,
    y:0
  }
  guiRef={
    ratio:1
  }
  canvas: HTMLCanvasElement | undefined;
  meta: MetaLike;
  camera: CameraLike;
  /** Absolute position of the mouse (doesn't take to account the camera offsets) */
  absolute = {
    x: 0,
    y: 0,
    /** Defines if the mouse is hovering an user interface element */
    hoverUI: false,
    /** Defines if the mouse is currently dragging an user interface element */
    dragging: false,
    /** A reference to whatever the mouse is currently dragging */
    slot: {},
  };
  lastMouseX = 0;
  lastMouseY = 0;
  /**
   * Creates a Mouse object
   * @param {HTMLCanvasElement} canvas The canvas HTML element
   * @param {Meta} meta  Meta informations
   * @param {Camera | any} camera Optional Camera abstraction representing an offset relative to the map (0,0) coordinates
   */
  constructor(
    canvas: HTMLCanvasElement | undefined,
    meta: MetaLike,
    camera: CameraLike
  ) {
    this.canvas = canvas;
    this.meta = meta;
    this.camera = camera;
    document.addEventListener("mousemove", this.updatePos);
    document.addEventListener("touchstart", this.updatePosMobile);
  }
  setCanvas = (canvas: HTMLCanvasElement) => {
    this.canvas = canvas;
  };
  /**
   * Translates the mouse event coordinates into canvas coordinates, relatively to the tilesize/ratio multipliers and the camera offsets
   * @param {*} evt Event object containing information about the mouse pointer position within the browser
   */
  updatePos = (
    evt: { clientX: number; clientY: number } = {
      clientX: this.lastMouseX,
      clientY: this.lastMouseY,
    }
  ) => {
    if (!this.canvas) {
      // Needs a canvas to be specified
      return;
    }
    this.lastMouseX = evt.clientX;
    this.lastMouseY = evt.clientY;
    this.absolute.x =
      (evt.clientX - this.canvas.offsetLeft) /
      this.meta.tilesize /
      this.meta.ratio;
    this.absolute.y =
      (evt.clientY - this.canvas.offsetTop) /
      this.meta.tilesize /
      this.meta.ratio;

      this.x=this.absolute.x-this.camera.x;
      this.y=this.absolute.y-this.camera.y;
      
      this.gui.x=this.absolute.x*this.meta.ratio/this.guiRef.ratio
      this.gui.y=this.absolute.y*this.meta.ratio/this.guiRef.ratio
  };
  /**
   * Translates the mouse event coordinates into canvas coordinates, relatively to the tilesize/ratio multipliers and the camera offsets
   * @param {*} evt Event object containing information about the mouse pointer position within the browser
   */
  updatePosMobile = (
    evt:TouchEvent
  ) => {
    if (!this.canvas) {
      // Needs a canvas to be specified
      return;
    }
    if(evt.touches.length===0){
      return;
    }
    
    this.lastMouseX = evt.touches[0].clientX;
    this.lastMouseY = evt.touches[0].clientY;
    this.absolute.x =
      (evt.touches[0].clientX - this.canvas.offsetLeft) /
      this.meta.tilesize /
      this.meta.ratio;
    this.absolute.y =
      (evt.touches[0].clientY - this.canvas.offsetTop) /
      this.meta.tilesize /
      this.meta.ratio;

      this.x=this.absolute.x-this.camera.x;
      this.y=this.absolute.y-this.camera.y;
      
      this.gui.x=this.absolute.x*this.meta.ratio/this.guiRef.ratio
      this.gui.y=this.absolute.y*this.meta.ratio/this.guiRef.ratio
  };
}
export default Mouse;
