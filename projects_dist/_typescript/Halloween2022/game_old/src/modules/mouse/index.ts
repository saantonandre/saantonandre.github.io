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
  canvas: HTMLCanvasElement;
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
  constructor(canvas: HTMLCanvasElement, meta: MetaLike, camera: CameraLike) {
    this.canvas = canvas;
    this.meta = meta;
    this.camera = camera;
    document.addEventListener("mousemove", this.updatePos);
  }
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
    this.lastMouseX = evt.clientX;
    this.lastMouseY = evt.clientY;
    this.x =
      -this.camera.x +
      (evt.clientX - this.canvas.offsetLeft) /
        this.meta.tilesize /
        this.meta.ratio;
    this.y =
      -this.camera.y +
      (evt.clientY - this.canvas.offsetTop) /
        this.meta.tilesize /
        this.meta.ratio;

    this.absolute.x =
      (evt.clientX - this.canvas.offsetLeft) /
      this.meta.tilesize /
      this.meta.ratio;
    this.absolute.y =
      (evt.clientY - this.canvas.offsetTop) /
      this.meta.tilesize /
      this.meta.ratio;
  };
}
export default Mouse;