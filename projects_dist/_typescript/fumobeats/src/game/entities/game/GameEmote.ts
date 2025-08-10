import { Entity } from "modules/Entity";

export class GameEmote extends Entity {
  type = "emote";
  absolute = true;
  constructor(x = 0, y = 0) {
    super(x, y);
    this.setAnimation("clap", { xFrames: [0, 1], yFrames: [26, 26] }); // song end
    this.setAnimation("pause", { xFrames: [3], yFrames: [25] }); // spree
    this.setAnimation("noooo", { xFrames: [2, 3], yFrames: [23, 23] }); // failed high combo
    this.setAnimation("kekw", { xFrames: [2], yFrames: [26] }); // got hit
    this.setAnimation("omega", { xFrames: [2], yFrames: [24] }); // got hit
    this.setAnimation("ok", { xFrames: [2], yFrames: [25] }); // ok hit
    this.setAnimation("pog", { xFrames: [3], yFrames: [24] }); // perfect hit
    this.setAnimation("fumo", { xFrames: [3], yFrames: [26] }); // idk
    this.setAnimation("cog", { xFrames: [3], yFrames: [22] }); // options
    this.setAnimation("wrench", { xFrames: [2], yFrames: [22] }); // edit
    this.setAnimation("cheer", {
      xFrames: [1, 2, 3, 4],
      yFrames: [30, 30, 30, 30],
    }); // idk
    const meow = this.setAnimation("meow", {
      xFrames: [2, 2, 3, 4, 4, 3, 3, 3],
      yFrames: [27, 27, 27, 27, 27, 27, 27, 27],
    }); // slowmo
    meow.slowness = 8;
    this.setAnimation("edm", {
      xFrames: [1, 2, 3, 4],
      yFrames: [31, 31, 31, 31],
    }); // unset}
  }
  static emotes = [
    "pause",
    "noooo",
    "kekw",
    "omega",
    "ok",
    "pog",
    "meow",
    "edm",
    "fumo",
    "cheer",
    "cog",
    "wrench",
    "clap"
  ] as const;
}
