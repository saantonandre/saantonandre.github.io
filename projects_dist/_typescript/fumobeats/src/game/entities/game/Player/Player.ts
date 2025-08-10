import { Entity } from "modules/Entity";
import { Behavior, ComputeProps } from "modules/Entity/Entity";
import { isLineToRect } from "modules/lib/physics/isLineToRect";
import { getRectSides } from "modules/lib/physics/getRectSides";
import { ArmComponent } from "game/entities/game/Player/ArmComponent";
import { createPunchMouseBehavior } from "game/entities/game/Player/createPunchMouseBehavior";
import { eventStream } from "game/gameEvents";
import { ShadowClone } from "game/entities/game/Player/ShadowClone";
import { View } from "modules/View";

export class Player extends Entity {
  declare behaviors: Behavior<Player>[];
  arm = new ArmComponent(this);
  shadowClones = new Array(4).fill(0).map(() => new ShadowClone());
  constructor(x: number, y: number) {
    super(x, y, 3, 5);
    this.type = "player";
    const left = 1;
    this.hitboxOffset = {
      x: 1.2,
      w: -2.4,
      y: 1,
      h: -2,
    };
    this.setAnimation("idle", { xFrames: [0], yFrames: [0] });
    this.setAnimation("idle", { xFrames: [3], yFrames: [0], left });
    // this.setAnimation("charge", { xFrames: [6, 6], yFrames: [0, 5] });
    // this.setAnimation("charge", { xFrames: [9, 9], yFrames: [0, 5], left });
    this.setAnimation("punch", { xFrames: [12], yFrames: [0] });
    this.setAnimation("punch", { xFrames: [15], yFrames: [0], left });
    // this.setAnimation("punch2", { xFrames: [12], yFrames: [5] });
    // this.setAnimation("punch2", { xFrames: [15], yFrames: [5], left });
    this.setAnimation("damaged", { xFrames: [0], yFrames: [5] });
    this.setAnimation("damaged", { xFrames: [3], yFrames: [5], left });
    this.behaviors.push(createPunchMouseBehavior(this.arm));
    this.components.push(this.arm);
    this.components.push(new ColHandlerComponent(this));
  }
  /** Initializes an available shadowClone (determined by lesser opacity) */
  initShadowClone() {
    this.shadowClones
      .reduce((prev, curr) => (curr.opacity < prev.opacity ? curr : prev))
      .init(this);
  }
  onCollision() {}
  compute(props: ComputeProps) {
    for (const shadowClone of this.shadowClones) {
      shadowClone.compute(props);
    }
    this.defaultCompute(props);
  }
  render(view: View) {
    for (const shadowClone of this.shadowClones) {
      shadowClone.render(view);
    }
    this.defaultRender(view);
  }
}
class ColHandlerComponent extends Entity {
  source: Player;
  constructor(source: Player) {
    super();
    this.source = source;
  }
  render() {}
  compute(props: ComputeProps) {
    const { dt, ents, view } = props;
    const p = this.source;
    if (p.damaged) {
      p.damaged -= dt;
    }
    if (p.damaged < 0) {
      p.damaged = 0;
      p.loadAnimation("idle");
    }
    if (p.damaged) return true;
    for (const entity of ents) {
      if (entity === p) continue;
      if (entity.damaged) continue;
      if (!entity.solid) continue;
      const sides = getRectSides(entity.hitbox, entity.rot);
      for (const side of sides) {
        if (!isLineToRect(side, p.hitbox)) continue;
        p.left = p.x > entity.x ? 1 : 0;
        // p.punchArm.state = "idle";
        entity.xVel = -entity.xVel;
        entity.rotVel *= 0.5;
        entity.solid = false;
        view.shake = 4;
        p.loadAnimation("damaged");
        
        if (!p.damaged) p.damaged = 5;
        eventStream.post("player-damaged");
        break;
      }
    }
  }
}
