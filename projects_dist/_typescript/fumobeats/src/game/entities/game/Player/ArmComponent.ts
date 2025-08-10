import { Player } from "game/entities/game/Player/Player";
import { ShadowClone } from "game/entities/game/Player/ShadowClone";
import { eventStream } from "game/gameEvents";
import { gameDebug } from "modules/Debug";
import { Entity } from "modules/Entity";
import { Behavior } from "modules/Entity/Entity";
import { View } from "modules/View";
import { getPointsSum } from "modules/lib/getPointsSum";
import { getDistance } from "modules/lib/physics/getDistance";
import { isLineToRect } from "modules/lib/physics/isLineToRect";
import { Point } from "modules/types/shapes";

export class ArmComponent extends Entity {
  declare behaviors: Behavior<ArmComponent>[];
  punchState = {
    punch: "idle" as "idle" | "punch",
    duration: 0,
    maxDuration: 40,
  };
  source: Player;
  constructor(source: Player) {
    super();
    this.source = source;
    this.type = "arm";
    this.rot = 0;
    this.x = 5;
    this.y = 5;
    this.w = 2;
    this.h = 1;
    const left = 1;
    const offset = { ...new Point(0, -this.h / 2), rot: 0 };

    this.setAnimation("idle", { xFrames: [0], yFrames: [13] });
    this.setAnimation("idle", { xFrames: [2], yFrames: [13], left });
    this.animations["idle"]!.offset = offset;
    this.behaviors.push(punchBehavior);
  }
  get target() {
    return getPointsSum(
      this,
      new Point(Math.cos(this.rot) * this.w, Math.sin(this.rot) * this.w)
    );
  }
  render(view: View) {
    gameDebug.drawPoint(this);
    this.renderSprite(view, new Point(0, this.h / 2));
  }
}

const punchBehavior: Behavior<ArmComponent> = (arm, props) => {
  const { ents } = props;
  const isPunch = arm.punchState.punch === "punch" && arm.display;
  if (!isPunch) return true;
  const intersections: [Entity, Point][] = [];
  for (const entity of ents) {
    if (entity.type === "player") continue;
    if (entity.damaged) continue;
    if (!entity.solid) continue;
    const intersec = isLineToRect([arm, arm.target], entity.hitbox, entity.rot);
    if (intersec) {
      intersections.push([entity, intersec]);
    }
  }
  if (!intersections.length) return true;
  let closest: Entity | null = null;
  let intersec: Point | null = null;
  let min: number = Infinity;
  for (const [entity, intersecCol] of intersections) {
    const dist = getDistance(arm, intersecCol);
    if (dist < min) {
      closest = entity;
      min = dist;
      intersec = intersecCol;
    }
  }
  if (!closest || !intersec) return true;
  closest.onHit(props, arm);
  const isPerfect = arm.punchState.duration === arm.punchState.maxDuration;
  eventStream.post("player-hit", { perfect: isPerfect });
  arm.punchState.duration = 0;
  let force = isPerfect ? 0.8 : 0.3;
  if (closest.type === "gymbag") {
    force /= 2;
  }
  closest.xVel = Math.cos(arm.rot) * force;
  closest.yVel = Math.sin(arm.rot) * force;
  if (isPerfect) {
    ents.push(circlesVfx(intersec, arm.rot));
    // player.loadAnimation("punch2");
  }
  props.sound.play(arm.left ? "_punch_1_mp3" : "_punch_2_mp3", {
    volume: isPerfect ? 0.5 : 0.2,
  });
  if (isPerfect) {
    arm.source.initShadowClone();
  }
  return true;
};

function circlesVfx(colPoint: Point, rot: number) {
  const x = colPoint.x - 0.5 + Math.random() * 0.5 - 0.25;
  const y = colPoint.y - 0.5 + Math.random() * 0.5 - 0.25;
  const vfx = new Entity(x, y);
  vfx.solid = false;
  vfx.w = 2;
  vfx.h = 2;
  vfx.rot = rot + Math.PI / 2;
  vfx.compute = (props) => {
    vfx.defaultCompute(props);
  };
  vfx.onAnimationEnd = () => (vfx.removed = true);
  vfx.render = (view) => {
    vfx.defaultRender(view);
    if (vfx.y > view.h) vfx.removed = true;
  };
  vfx.setAnimation("idle", {
    xFrames: [0, 0, 0, 0],
    yFrames: [18, 20, 22, 24],
  });
  vfx.animations["idle"]!.slowness = 3;
  return vfx;
}
