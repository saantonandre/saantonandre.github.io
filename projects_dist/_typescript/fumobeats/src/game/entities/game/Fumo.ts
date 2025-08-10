import { EntManager } from "game/entities/game/EntManager";
import { gravityBehavior } from "../gravity";
import { Entity } from "modules/Entity";
import { Behavior, ComputeProps } from "modules/Entity/Entity";
import { View } from "modules/View";
import { Point } from "modules/types/shapes";
import { getDistance } from "modules/lib/physics/getDistance";

export class Fumo extends Entity {
  declare behaviors: Behavior<Fumo>[];
  type = "fumo";
  constructor(x: number, y: number) {
    super(x, y, 1.8, 2);
    this.rot = Math.PI * 0.1;
    this.fillColor = "green";
    this.setAnimation("idle", { xFrames: [8], yFrames: [14] });
    this.setAnimation("idle", { xFrames: [10], yFrames: [14], left: 1 });
    this.setAnimation("ded", { xFrames: [8], yFrames: [16] });
    this.setAnimation("ded", { xFrames: [10], yFrames: [16], left: 1 });
    this.hitboxOffset.w -= 0.5;
    this.hitboxOffset.x += 0.1;
    this.hitboxOffset.h -= 0.2;
    this.behaviors.push(gravityBehavior);
  }
  onHit({ ents, sound, view }: ComputeProps, collider: Entity) {
    this.damaged = 1;
    cottonVfxs(this.center, ents, (2 + Math.random() * 4) | 0);
    this.loadAnimation("ded");
    const audio = sound.playRandom([
      "_evill_woo_dance_mp3",
      "_evil_ahahaha_mp3",
      "_evil_ayoo_mp3",
      "_evil_dont_leave_mp3",
      "_evil_doot_doot_mp3",
      "_evil_heart_mp3",
      "_evil_kekwa_mp3",
      "_evil_scream_mp3",
      "_evil_well_thats_stupid_mp3",
      "_evil_what_mp3",
      "_evil_will_eat_mp3",
      "_evil_wink_mp3",
      "_evil_youre_filth_mp3",
    ]);
    audio.volume = 1;
    this.behaviors.push((e) => {
      let dist = 1 - getDistance(collider, e) / 20;
      dist < 0 ? (dist = 0) : dist > 2 && (dist = 2);
      audio.volume = 1 - dist < 0 ? 0 : dist;
      audio.pan = view.getPan(e.x + e.w / 2);
      if(this.removed){
        audio.destroy()
      }
      if (audio.original.paused) return false;
      return true;
    });
  }
  render(view: View) {
    this.renderSprite(view);
  }
  onOutOfBounds({ ents, view }: ComputeProps) {
    ents.push(smashVfx({ x: this.x - view.x + this.w / 2, y: view.h }));
  }
}

function cottonVfxs(colPoint: Point, entities: Entity[], amount: number) {
  for (let i = 0; i < amount; i++) {
    entities.push(cottonVfx(colPoint));
  }
}

function cottonVfx(colPoint: Point) {
  const vfx = EntManager.getCotton();
  const rand = (Math.random() * 4) | 0;
  const size = [14, 15, 16, 17][rand];
  vfx.setProperties({
    x: colPoint.x - 0.5 + Math.random() * 0.5 - 0.25,
    y: colPoint.y - 0.5 + Math.random() * 0.5 - 0.25,
    solid: false,
    yVel: -0.06 - (rand / 4) * 0.2,
    rotVel: Math.random() * 0.4,
    xVel: Math.random() * 0.1 - 0.05,
  });
  vfx.setAnimation("idle", { xFrames: [7], yFrames: [size] });
  return vfx;
}

function smashVfx(colPoint: Point) {
  const vfx = new Entity();
  const w = 2;
  const h = 3;
  const x = colPoint.x - w / 2;
  const y = colPoint.y - h;
  vfx.setProperties({
    x,
    y,
    w,
    h,
    solid: false,
    absolute: true,
  });
  const idle = vfx.setAnimation("idle", {
    xFrames: [0, 2, 4, 6, 8, 10],
    yFrames: [10, 10, 10, 10, 10, 10],
  });
  idle.slowness = 4;
  vfx.onAnimationEnd = function (this: Entity) {
    if (this.animation === "idle") {
      this.removed = true;
    }
  };
  return vfx;
}
