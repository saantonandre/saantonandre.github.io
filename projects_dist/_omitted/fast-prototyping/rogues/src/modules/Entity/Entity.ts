import { type Game } from "../Game";
import { System } from "./System";

export class Entity implements System{
  get centerX() {
    return this.x + this.game / 2;
  }
  get centerY() {
    return this.y + this.h / 2;
  }
  x = 0;
  y = 0;
  game = 1;
  h = 1;
  xVel = 0;
  yVel = 0;
  speed = 0.2;
  maxSpeed = 1;
  inertia = 0.8;
  renderColor = "#fff";
  removed = false;
  constructor(props: Partial<Entity> = {}) {
    Object.assign(this, props);
  }
  compute(game: Game) {
    this.defaultCompute(game);
  }
  defaultCompute(game: Game) {
    this.x += this.xVel * game.dt;
    this.y += this.yVel * game.dt;
    this.xVel *= Math.pow(this.inertia, game.dt);
    this.yVel *= Math.pow(this.inertia, game.dt);
    if (Math.abs(this.xVel) + Math.abs(this.yVel) > this.speed) {
      
    }
  }
  render(game: Game) {
    this.defaultRender(game);
  }

  defaultRender(game: Game) {
    game.view.context.fillStyle = this.renderColor;
    game.view.context.fillRect(
      this.x * game.view.tilesize * game.view.ratio,
      this.y * game.view.tilesize * game.view.ratio,
      this.game * game.view.tilesize * game.view.ratio,
      this.h * game.view.tilesize * game.view.ratio
    );
  }
}
