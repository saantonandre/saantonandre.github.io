/**
 * The Controls class initializes the input listeners and tracks changes.
 */
export class Controls {
  up: boolean;
  down: boolean;
  left: boolean;
  right: boolean;
  upR: boolean;
  downR: boolean;
  leftR: boolean;
  rightR: boolean;
  spacebar: boolean;
  e: boolean;
  lClickDown: boolean;
  mClickDown: boolean;
  rClickDown: boolean;
  test: string;
  currentPos: number;
  lastDir: number;
  mouseX: number;
  mouseY: number;
  constructor() {
    this.up = false;
    this.down = false;
    this.left = false;
    this.right = false;
    this.upR = false;
    this.downR = false;
    this.leftR = false;
    this.rightR = false;
    this.spacebar = false;
    this.e = false;
    this.lClickDown = false;
    this.mClickDown = false;
    this.rClickDown = false;
    this.test = "test";
    this.currentPos = 0;
    this.lastDir = 0;
    this.mouseX = 0;
    this.mouseY = 0;
    this.initListeners();
  }
  initListeners() {
    document.addEventListener("mousedown", handleMouseEvt);
    document.addEventListener("mouseup", handleMouseEvt);
    document.addEventListener("touchstart", handleTouchEvt);
    document.addEventListener("touchend", handleTouchEvt);
    document.addEventListener("keydown", handleKeyboardEvt);
    document.addEventListener("keyup", handleKeyboardEvt);
    const that = this;
    function handleKeyboardEvt(evt: KeyboardEvent) {
      const isDown = evt.type === "keydown";
      switch (evt.key) {
        case "w": //up
          that.up = isDown;
          break;
        case "s": //down
          that.down = isDown;
          break;
        case "a": //left
          that.left = isDown;
          break;
        case "d": //right
          that.right = isDown;
          break;
        case "ArrowUp": //down
          that.upR = isDown;
          break;
        case "ArrowDown": //down
          that.downR = isDown;
          break;
        case "ArrowLeft": //left
          that.leftR = isDown;
          break;
        case "ArrowRight": //right
          that.rightR = isDown;
          break;
        case " ":
          that.spacebar = isDown;
          break;
        case "e": //e
          that.e = isDown;
          break;
        case "Escape": // Escape
          break;
        case "y": //y
          //toggleFullScreen();
          break;
        //debug
        default:
          console.log(`Pressed "${evt.key}" key`);
          break;
      }
    }
    function handleTouchEvt(evt: TouchEvent) {
      console.log(evt)
      const isDown = evt.type === "touchstart";
      that.lClickDown = isDown;
      if(!isDown){
        return;
      }
      that.mouseX = evt.touches[0].clientX;
      that.mouseY = evt.touches[0].clientY;
    }
    function handleMouseEvt(evt: MouseEvent) {
      const isDown = evt.type === "mousedown";
      switch (evt.button) {
        case 0:
          that.lClickDown = isDown;
          break;
        case 1:
          that.mClickDown = isDown;
          break;
        case 2:
          that.rClickDown = isDown;
          break;
      }
      that.mouseX = evt.clientX;
      that.mouseY = evt.clientY;
    }
  }
}
