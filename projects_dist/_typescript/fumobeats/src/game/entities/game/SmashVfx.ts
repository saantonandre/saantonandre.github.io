import { gravityBehavior } from "game/entities/gravity";
import { Entity } from "modules/Entity";
import { Behavior } from "modules/Entity/Entity";
import { View } from "modules/View";

export class Gymbag extends Entity {
  declare behaviors: Behavior<Gymbag>[];
  constructor(x: number, y: number) {
    super(x, y, 3, 2);
    this.rot = Math.PI * 0.1;
    this.fillColor = "green";
    this.type = "gymbag";
    this.setAnimation("idle", { xFrames: [7], yFrames: [20] });
    this.setAnimation("idle", { xFrames: [10], yFrames: [20], left: 1 });
    this.setAnimation("ded", { xFrames: [7], yFrames: [22] });
    this.setAnimation("ded", { xFrames: [10], yFrames: [22], left: 1 });
    this.hitboxOffset.w -= 0.3;
    this.hitboxOffset.x += 0.3;
    this.hitboxOffset.y += 0.3;
    this.hitboxOffset.h -= 0.3;
    this.behaviors.push(gravityBehavior);
  }
  render(view: View) {
    this.renderSprite(view);
  }
}
