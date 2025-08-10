export class View {
  tilesize = 16;
  width = 24;
  height = 16;
  ratio = 2;
  mouseX = 0;
  mouseY = 0;
  x = 0;
  y = 0;
  canvas: HTMLCanvasElement;
  context: CanvasRenderingContext2D;
  compute(deltaTime: number) {
    const deltaX = this.mouseX - this.x;
    this.x += deltaX*0.5 * deltaTime;
    const deltaY = this.mouseY - this.y;
    this.y += deltaY*0.5 * deltaTime;
  }
  clear() {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }
  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.canvas.oncontextmenu=(e)=>e.preventDefault()
    this.canvas.style.cursor="none"
    this.context = this.canvas.getContext("2d", { alpha: false })!;
    this.context.imageSmoothingEnabled=false;
    this.canvas.width = this.width * this.ratio * this.tilesize;
    this.canvas.height = this.height * this.ratio * this.tilesize;
    addEventListener("mousemove", (e) => {
      const x = e.clientX - this.canvas.offsetLeft;
      const y = e.clientY - this.canvas.offsetTop;
      this.mouseX = x / this.ratio / this.tilesize;
      this.mouseY = y / this.ratio / this.tilesize;
    });
  }
}
