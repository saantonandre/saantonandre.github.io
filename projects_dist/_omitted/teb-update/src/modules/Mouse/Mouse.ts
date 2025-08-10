interface View {
  x: number;
  y: number;
  tilesize: number;
  ratio: number;
  canvas: HTMLCanvasElement;
}

export class Mouse {
  x = 0;
  y = 0;
  gui = { x: 0, y: 0 };
  guiRef = {
    ratio: 1,
  };
  view: View;
  /** Absolute position of the mouse within the canvas (doesn't take to account the camera offsets) */
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
  constructor(view: View) {
    this.view = view;
    document.addEventListener("mousemove", (e) => this.updatePos(e));
    document.addEventListener("touchstart", (e) => this.updatePosMobile(e));
    document.addEventListener("touchmove", (e) => this.updatePosMobile(e));
  }
  updatePos(
    evt: { clientX: number; clientY: number } = {
      clientX: this.lastMouseX,
      clientY: this.lastMouseY,
    }
  ) {
    this.lastMouseX = evt.clientX;
    this.lastMouseY = evt.clientY;
    this.absolute.x =
      (evt.clientX - this.view.canvas.offsetLeft) /
      this.view.tilesize /
      this.view.ratio;
    this.absolute.y =
      (evt.clientY - this.view.canvas.offsetTop) /
      this.view.tilesize /
      this.view.ratio;

    this.x = this.absolute.x + this.view.x;
    this.y = this.absolute.y + this.view.y;

    this.gui.x = (this.absolute.x * this.view.ratio) / this.guiRef.ratio;
    this.gui.y = (this.absolute.y * this.view.ratio) / this.guiRef.ratio;
  }
  /**
   * Translates the mouse event coordinates into canvas coordinates, relatively to the tilesize/ratio multipliers and the camera offsets
   * @param {*} evt Event object containing information about the mouse pointer position within the browser
   */
  updatePosMobile(evt: TouchEvent) {
    if (evt.touches.length === 0) {
      return;
    }

    this.lastMouseX = evt.touches[0].clientX;
    this.lastMouseY = evt.touches[0].clientY;
    this.absolute.x =
      (evt.touches[0].clientX - this.view.canvas.offsetLeft) /
      this.view.tilesize /
      this.view.ratio;
    this.absolute.y =
      (evt.touches[0].clientY - this.view.canvas.offsetTop) /
      this.view.tilesize /
      this.view.ratio;

    this.x = this.absolute.x - this.view.x;
    this.y = this.absolute.y - this.view.y;

    this.gui.x = (this.absolute.x * this.view.ratio) / this.guiRef.ratio;
    this.gui.y = (this.absolute.y * this.view.ratio) / this.guiRef.ratio;
  }
}
