export class Entity {
  x = 0;
  y = 0;
  w = 1;
  h = 1;
  xVel = 0;
  yVel = 0;
  speed = 0.2;
  inertia=0.6;
  constructor(props) {
    Object.assign(this, props);
  }
  defaultUpdate(world) {
    this.x += this.xVel;
    this.y += this.yVel;
    this.xVel *= this.inertia;
    this.yVel *= this.inertia;
  }
  update(world) {
    this.defaultUpdate(world)
  }
  render(world) {
    world.view.context.fillStyle = "#fff";
    world.view.context.fillRect(
      this.x * world.view.tilesize * world.view.ratio,
      this.y * world.view.tilesize * world.view.ratio,
      this.w * world.view.tilesize * world.view.ratio,
      this.h * world.view.tilesize * world.view.ratio
    );
  }
}
