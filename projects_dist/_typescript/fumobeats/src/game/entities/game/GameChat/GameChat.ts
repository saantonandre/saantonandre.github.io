import { GameMessage } from "game/entities/game/GameChat/GameMessage";
import { GameEmote } from "game/entities/game/GameEmote";
import { InterfaceEntity } from "game/entities/interface/InterfaceEntity";
import { eventStream } from "game/gameEvents";
import { ComputeProps } from "modules/Entity/Entity";
import { View } from "modules/View";

export class GameChat extends InterfaceEntity {
  messages: GameMessage[] = new Array(6).fill(0).map(() => new GameMessage());
  type = "chat";
  constructor(x: number, y: number) {
    super(x, y);
    this.w = 6;
    this.h = 7;
    this.setAnimation("idle", { xFrames: [5], yFrames: [25] });
    this.behaviors.push(() => {
      eventStream.read("player-hit", ({ perfect }) => {
        this.sendMessage(perfect ? "pog" : "ok");
      });
      eventStream.read("time-slow-start", () => {
        this.sendMessage("meow");
      });
      eventStream.read("fumobeat-end", () => {
        for (let i = 0; i < 6; i++) {
          setTimeout(() => this.sendMessage("clap"), Math.random() * 2000);
        }
      });
      eventStream.read("fumo-streak-start", () => {
        this.sendMessage("pause");
      });
      eventStream.read("fumo-spawn", () => {
        const rand = Math.random();
        if (rand > 0.5) {
          this.sendMessage(rand > 0.75 ? "cheer" : "edm");
        }
      });
      eventStream.read("combo-break", ({ combo }) => {
        if (combo === 0) return this.sendMessage("omega");
        if (combo < 10) return this.sendMessage("kekw");
        for (let i = combo; i >= 10; i -= 10) {
          this.sendMessage("noooo");
        }
      });
      return true;
    });
  }

  compute(props: ComputeProps) {
    for (let i = 0; i < this.messages.length; i++) {
      this.messages[i].compute(props);
    }
    this.defaultCompute(props);
  }
  render(view: View) {
    this.defaultRender(view);
    let totalHeight = this.messages.length - 1;
    // if (view.shakeOffset) {
    // this.animations["idle"]!.offset = view.shakeOffset;
    // }
    for (let i = this.messages.length - 1; i >= 0; i--) {
      this.messages[i].x = this.x + 0.2;
      this.messages[i].y = this.y + totalHeight + 0.5 + 1 - this.messages[i].h;
      totalHeight -= this.messages[i].h;
    }
    for (const message of this.messages) {
      if (message.y < this.y) continue;
      message.render(view);
    }
  }
  private sendMessage(emote: (typeof GameEmote.emotes)[number]) {
    const newMessage = this.messages.shift()!;
    newMessage.reset(emote);
    this.messages.push(newMessage);
  }
}
