import { Entity } from "@modules/Entity";
import { ComputeProps, Behavior } from "@modules/Entity/Entity";
import { View } from "@modules/View";


export class Enemy extends Entity {
  constructor(x: number, y: number) {
    super(x, y);
    this.h = 1;
    this.w = 1;
  }
  compute(props: ComputeProps) {
    this.defaultCompute(props);
  }
  render(view: View) {
    this.renderRect(view);
  }
}

const flyEnemyBehavior: Behavior<FlyEnemy> = (entity, props) => {
  entity.xVel += props.dt*Math.cos(props.time.gameTime/10)*0.01;
  entity.yVel += props.dt*Math.sin(props.time.gameTime/10)*0.01;

  return true;
};

export class FlyEnemy extends Enemy {
  behaviors = [flyEnemyBehavior];
}