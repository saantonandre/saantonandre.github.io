import { View } from "modules/View";
import { Entity } from "modules/entity";

export class Creature extends Entity {
  x: number = 0;
  y: number = 0;
  xVel: number = 0;
  yVel: number = 0;
  xVelExt: number = 0;
  yVelExt: number = 0;
  speed: number = 0.1;
  friction: number = 0;
  constructor(x: number, y: number) {
    super(x, y);
    this.x = x;
    this.y = y;
    // console.log(`Created entity ${this.id}`);
  }
  compute(environment: Creature[] = [], deltaTime: number) {
    this.behaviours.forEach((behaviour) =>
      behaviour(this, environment, deltaTime)
    );
    this.updateVelocities(deltaTime);
    this.updatePosition(deltaTime);
    this.updateHitbox();
  }
  render(view: View) {
    //this.renderSprite(context, tilesize, ratio, camera);
    view.context.fillStyle = "white";
    this.renderSquare(view);
  }
  updateVelocities(deltaTime: number) {
    this.xVelExt = applyFriction(this.xVelExt, this.friction, deltaTime);
    this.yVelExt = applyFriction(this.yVelExt, this.friction, deltaTime);
  }
}

const applyFriction = (
  velocity: number,
  friction: number,
  deltaTime: number
) => {
  if (!velocity) return velocity;
  const min = 0.001;
  const updated = (velocity *= Math.pow(friction, deltaTime));
  return Math.abs(updated) < min ? 0 : updated;
};
