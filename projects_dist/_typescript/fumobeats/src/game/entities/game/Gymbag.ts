import { EntManager } from "game/entities/game/EntManager";
import { gravityBehavior } from "game/entities/gravity";
import { Entity } from "modules/Entity";
import { Behavior, ComputeProps } from "modules/Entity/Entity";
import { View } from "modules/View";
import { getAngle } from "modules/lib/physics/getAngle";

export class Gymbag extends Entity {
  declare behaviors: Behavior<Gymbag>[];
  constructor(x: number = 0, y: number = 0) {
    super(x, y, 3, 2);
    this.type = "gymbag";
    this.rot = Math.PI * 0.1;
    this.fillColor = "green";
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
  onHit({ ents }: ComputeProps, collider: Entity) {
    this.damaged = 1;
    this.loadAnimation("ded");
    const fumo = EntManager.getFumo();
    fumo.setProperties({
      ...this.center,
      xVel: this.left ? 0.08 : -0.08,
      yVel: -0.4,
      rotVel: Math.random() * 0.3,
    });
    const rot = getAngle(collider, this.center);
    const diff = rot - collider.rot;
    this.rotVelExt += diff * 0.5;
    ents.push(fumo);
    return true;
  }
  render(view: View) {
    this.renderSprite(view);
  }
}
