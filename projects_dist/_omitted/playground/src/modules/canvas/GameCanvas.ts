// Creates the canvas element and exports it

export class GameCanvas extends HTMLCanvasElement {
    context: CanvasRenderingContext2D;
    constructor(width: number = 800, height: number = 600) {
      super();
      this.width = width;
      this.height = height;
      this.context = this.getContext("2d")!;
      this.style.outline="3px inset black"
      this.initialize();
    }
    /** Moves the canvas to the center by giving it an offset to the top/left sides */
    center = () => {
      this.style.position = "absolute";
      this.style.left = (window.innerWidth - this.width) / 2 + "px";
      this.style.top = (window.innerHeight - this.height) / 2 + "px";
    };
    clear = () => {
      this.context.clearRect(0, 0, this.width, this.height);
    };
    initialize = () => {
      /* Calls the centerCanvas function every time the window size changes */
      window.addEventListener("resize", () => this.center());
      this.center();
      document.body.appendChild(this);
      // Disables anti aliasing
      this.context.imageSmoothingEnabled = false;
    };
    /** Right clicks menu are prevented from appearing on the canvas */
    oncontextmenu = (event: MouseEvent) => {
      event.preventDefault();
    };
  }

  // Mandatory define
  customElements.define('game-canvas', GameCanvas, {extends: 'canvas'});

  