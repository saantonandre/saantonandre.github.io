import { Fumobeat } from "game/Fumobeat";
import { firstCoffee } from "game/ModesManager/ModesManager";
import { GameEmote } from "game/entities/game/GameEmote";
import { InterfaceEntity } from "game/entities/interface/InterfaceEntity";
import { UIButton } from "game/entities/interface/UIButton";
import { createClickBehavior } from "game/entities/interface/createClickBehavior";
import { eventStream } from "game/gameEvents";
import { ComputeProps } from "modules/Entity/Entity";
import { GameText } from "modules/Entity/GameText";
import { View } from "modules/View";
import { formatSeconds } from "utils/dateFormatter";

export class FumobeatCard extends InterfaceEntity {
  fumobeat: Fumobeat;
  text: GameText;
  delete: InterfaceEntity;
  download: InterfaceEntity;
  fumo = new GameEmote(0, 0);
  constructor(
    x: number,
    y: number,
    fumobeat: Fumobeat,
    setHovered: (value: Fumobeat | null, prev?: Fumobeat) => void
  ) {
    super(x, y, 8, 2);
    this.fumobeat = fumobeat;
    this.onMouseEnter = () => setHovered(this.fumobeat);
    this.onMouseOut = () => {
      setHovered(null, this.fumobeat);
    };
    this.onClick = () => {
      eventStream.post("switch-mode", { mode: "beats" });
      eventStream.post("fumobeat-play", { fumobeat: this.fumobeat });
    };
    this.behaviors.push(createClickBehavior());
    this.setAnimation("idle", { xFrames: [12], yFrames: [10] });
    this.setAnimation("active", { xFrames: [12], yFrames: [12] });
    this.text = new GameText(x, y);
    this.text.color = "#9d5656";
    this.text.stroke = true;
    this.text.strokeColor = "#9d5656";
    this.text.strokeWidth = 2;
    this.text.fontSize = 10;
    // this.text.font=firstCoffee.family
    this.text.shadowColor = "#f2dbd5";
    this.text.absolute = true;
    this.fumo.animation = "fumo";
    this.delete = new DeleteButton(this.x + this.w, this.y);
    this.delete.onClick = () =>
      eventStream.post("fumobeats-delete", { fumobeats: [this.fumobeat] });
    this.download = new DownloadButton(this.x + this.w, this.y + 1);
    this.download.onClick = () =>
      eventStream.post("fumobeats-export", { fumobeats: [this.fumobeat] });
  }
  compute(props: ComputeProps) {
    // this.defaultCompute(props);
    this.computeBehaviors(props);
    this.delete.compute(props);
    this.download.compute(props);
    this.animation = this.hovered ? "active" : "idle";
  }
  render(view: View) {
    this.defaultRender(view);
    const prevFont = this.text.font;
    const prevColor = this.text.color;
    this.text.stroke = true;
    this.text.content = this.fumobeat.metadata.name;
    this.text.align = "center";
    this.text.y = this.y + 0.6;
    this.text.fontSize = 8;
    this.text.x = this.x + this.w / 2;
    this.text.font = firstCoffee.family;
    this.text.color = "#ffffff";
    this.text.shadowColor = "#9d5656";
    this.text.render(view);

    this.text.stroke = false;
    this.text.font = prevFont;
    const prevSize = this.text.fontSize;
    this.text.color = prevColor;
    this.text.content = formatSeconds(this.fumobeat.metadata.duration, true);
    this.text.x = this.x + this.w - 0.5;
    this.text.y = this.y + 1.5;
    this.text.align = "right";
    this.text.fontSize = 7;
    this.text.render(view);

    this.text.color = prevColor;
    // this.text.content = new Date(this.fumobeat.metadata.created_at)
    //   .toISOString()
    //   .slice(0, 10);
    this.text.content = this.fumobeat.metadata.author;
    this.text.x = this.x + this.w / 2;
    this.text.y = this.y + 1;
    this.text.align = "center";
    this.text.fontSize = 7;
    this.text.render(view);

    this.text.fontSize = prevSize;
    this.fumo.x = this.x + 0.2;
    this.fumo.y = this.y + 0.9;
    this.fumo.render(view);

    this.text.content = "x" + this.fumobeat.beats.length;
    this.text.x = this.fumo.x + 1;
    this.text.y = this.fumo.y + 0.6;
    this.text.align = "left";
    this.text.render(view);

    this.delete.y = this.y;
    this.delete.render(view);

    this.download.y = this.y + 1;
    this.download.render(view);
  }
}

class DeleteButton extends InterfaceEntity {
  constructor(x: number, y: number) {
    super(x, y);
    this.setAnimation("idle", { xFrames: [4], yFrames: [16] });
    this.setAnimation("active", { xFrames: [4], yFrames: [17] });
    this.behaviors.push(createClickBehavior(this));
  }
  compute(props: ComputeProps) {
    let prevHovered = this.hovered;
    this.defaultCompute(props);
    if (this.hovered !== prevHovered) {
      eventStream.post(`fumobeat-delete-button-${this.hovered ? "in" : "out"}`);
    }
    this.animation = this.hovered ? "active" : "idle";
  }
  render(view: View) {
    this.defaultRender(view);
  }
}
class DownloadButton extends InterfaceEntity {
  constructor(x: number, y: number) {
    super(x, y);
    this.setAnimation("idle", { xFrames: [5], yFrames: [22] });
    this.setAnimation("active", { xFrames: [5], yFrames: [23] });
    this.behaviors.push(createClickBehavior(this));
  }
  compute(props: ComputeProps) {
    let prevHovered = this.hovered;
    this.defaultCompute(props);
    if (this.hovered !== prevHovered) {
      eventStream.post(`fumobeat-download-button-${this.hovered ? "in" : "out"}`);
    }
    this.animation = this.hovered ? "active" : "idle";
  }
  render(view: View) {
    this.defaultRender(view);
  }
}
