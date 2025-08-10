export class Player {
  x = 0;
  y = 0;
  w = 2;
  h = 1;
  xVel = 0;
  yVel = 0;
  speed = 0.2;
  maxSpeed = 2;
  inertia = 0.82;
  constructor(props: Partial<Player>={}) {
    Object.assign(this, props);
  }

  compute() {
    this.x += this.xVel;
    this.y += this.yVel;

    this.xVel *= this.inertia;
    this.xVel *= this.inertia;
  }
  render(context: CanvasRenderingContext2D) {
    const tilesize = 16;
    context.fillStyle = "white";
    context.fillRect(
      this.x * tilesize,
      this.y * tilesize,
      this.w * tilesize,
      this.h * tilesize
    );
  }
}
