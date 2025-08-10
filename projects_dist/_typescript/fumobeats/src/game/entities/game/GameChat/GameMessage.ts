
import { getRandomUser } from "game/entities/game/GameChat/getRandomUser";
import { GameEmote } from "game/entities/game/GameEmote";
import { Entity } from "modules/Entity";
import { ComputeProps } from "modules/Entity/Entity";
import { GameText } from "modules/Entity/GameText";
import { View } from "modules/View";
import { sequenceColors } from "utils/sequenceColor";
import { stringToIndex } from "utils/stringToIndex";

// max ~8 chat messages?
export class GameMessage extends Entity {
  text = new GameText(0, 0);
  emote = new GameEmote(0, 0);
  badges: Record<string, Entity> = {
    vip: new Entity(0, 0),
    mod: new Entity(0, 0),
    sub: new Entity(0, 0),
    gifter: new Entity(0, 0),
  };
  constructor() {
    super();
    this.absolute = true;
    this.text.absolute = true;
    this.text.align = "left";
    this.text.baseline = "middle";
    this.text.fontSize = 6;
    this.text.stroke = true;
    this.text.strokeColor = "black";
    for (const key in this.badges) {
      this.badges[key].w = 0.45;
      this.badges[key].h = 0.45;
      this.badges[key].display = false;
      this.badges[key].absolute = true;
    }
    this.badges["mod"].setAnimation("idle", { xFrames: [1.5], yFrames: [27] });
    this.badges["vip"].setAnimation("idle", { xFrames: [1], yFrames: [27] });
    this.badges["sub"].setAnimation("idle", { xFrames: [1], yFrames: [27.5] });
    this.badges["gifter"].setAnimation("idle", {
      xFrames: [1.5],
      yFrames: [27.5],
    });

    // this.emote.animations["meow"]!.slowness = 10;
  }
  compute(props: ComputeProps) {
    this.emote.compute(props);
    // this.defaultCompute(e,d,v)
  }
  render(view: View) {
    let includedBadges = 0;
    for (const key in this.badges) {
      const badge = this.badges[key];
      if (!badge.display) continue;
      badge.x = this.x + includedBadges * 0.5;
      badge.y = this.y - badge.h / 2;
      includedBadges++;
      badge.render(view);
    }
    const badgesSpace = includedBadges * 0.5 + 0.05;
    this.text.x = this.x + badgesSpace;
    this.text.y = this.y;
    this.text.render(view);
    const { width } = view.context.measureText(String(this.text.content));
    const computedWidth = width / view.ratio / view.tilesize;
    if (computedWidth + badgesSpace > 5) {
      this.h = 2;
      this.emote.x = this.x;
      this.emote.y = this.y + this.emote.h / 5;
    } else {
      this.h = 1;
      this.emote.x = this.x + computedWidth + badgesSpace;
      this.emote.y = this.y - this.emote.h / 2;
    }
    this.emote.render(view);
  }
  reset(emote: (typeof GameEmote.emotes)[number]) {
    this.emote.animation = emote;
    const [username, color, badges] = getRandomUser();
    Object.entries(this.badges).map(
      ([badgeName, badge]) => (badge.display = badges.includes(badgeName))
    );
    // this.text.content = Math.random()>0.8?"Kelo_the_green_minstrel":username + ":";
    // this.text.content = "Kelo_the_green_minstrel++" + ":";
    this.text.content = username + ":";
    this.text.color =
      color ||
      sequenceColors[stringToIndex(this.text.content, sequenceColors.length)];
  }
}
