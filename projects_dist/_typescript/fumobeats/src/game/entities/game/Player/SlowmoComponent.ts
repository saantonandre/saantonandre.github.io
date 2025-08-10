import { imagesIndex } from "assets/images";
import { Player } from "game/entities/game/Player/Player";
import { eventStream } from "game/gameEvents";
import { Controls } from "modules/Controls";
import { Entity } from "modules/Entity";
import { Behavior } from "modules/Entity/Entity";
import { Sprite, defaultSheet } from "modules/Entity/Sprite/Sprite";
import { View } from "modules/View";
import { getPointsSum } from "modules/lib/getPointsSum";
import { Point } from "modules/types/shapes";
const alternateSheet = new Image();
alternateSheet.src = imagesIndex._sheet2_cat_png;

export class SlowmoComponent extends Entity {
  declare behaviors: Behavior<SlowmoComponent>[];
  punchState = {
    punch: "idle" as "idle" | "charge" | "punch",
    duration: 0,
    maxDuration: 40,
  };
  source: Player;
  private _charge: number = 75;
  set charge(value: number) {
    this._charge = value;
    if (this._charge > this.maxCharge) {
      this._charge = this.maxCharge;
    }
    if (this._charge < 0) {
      this._charge = 0;
    }
  }
  get charge() {
    return this._charge;
  }
  maxCharge: number = 100;
  bar: Sprite;
  barH: number = 2;
  active: boolean = false;
  constructor(source: Player) {
    super();
    this.source = source;
    this.type = "slowmo";
    this.rot = 0;
    this.x = 20;
    this.y = 11;
    this.w = 2;
    this.h = 3;
    this.absolute = true;
    this.bar = new Sprite(this.x + 0.5, this.y + 1);
    this.bar.h = this.barH;
    this.bar.w = 1;
    this.bar.absolute = true;
    this.bar.fillColor = "#f0eceb";
    this.bar.setAnimation("green", { xFrames: [15], yFrames: [14] });
    this.bar.setAnimation("yellow", { xFrames: [15], yFrames: [16] });
    this.bar.setAnimation("orange", { xFrames: [15], yFrames: [18] });
    this.bar.setAnimation("red", { xFrames: [15], yFrames: [20] });
    this.setAnimation("idle", { xFrames: [16], yFrames: [14] });
    this.setAnimation("active", { xFrames: [16], yFrames: [17] });

    this.behaviors.push((e, { dt, sound, time }) => {
      eventStream.read("player-hit", ({ perfect }) => {
        if (e.active) return;
        e.charge += perfect ? 3 : 0.5;
      });
      if ((Controls.has("right") || Controls.has(" ")) && e.charge) {
        if (!e.active) {
          eventStream.post("time-slow-start");
          sound.play("_neuro_meow_mp3", { speed: 2 });
        }
        if (time.gameTimeRate !== 0.2) {
          time.gameTimeRate = 0.2;
        }
        e.source.sheet = alternateSheet;
        e.loadAnimation("active");
        e.charge -= dt;
        e.active = true;
      }
      if ((!Controls.has("right") && !Controls.has(" ")) || !e.charge) {
        if (time.gameTimeRate !== 1) {
          time.gameTimeRate = 1;
        }
        e.source.sheet = defaultSheet;
        e.loadAnimation("idle");
        e.active = false;
      }
      const barHeight = e.barH * (e.charge / e.maxCharge);
      e.bar.h = barHeight;
      e.bar.y = e.y + e.barH - barHeight;
      return true;
    });
  }
  get target() {
    return getPointsSum(
      this,
      new Point(Math.cos(this.rot) * this.w, Math.sin(this.rot) * this.w)
    );
  }
  render(view: View) {
    const animations = ["red", "orange", "yellow", "green"];
    const animIndex = ((this.charge / 101) * animations.length) | 0;
    this.bar.animation = animations[animIndex];
    this.bar.renderSprite(view);
    this.renderSprite(view);
  }
}
