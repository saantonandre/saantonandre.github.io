import { View } from "modules/View";
import { GameText } from "modules/Entity/GameText";
import { firstCoffee } from "game/ModesManager/ModesManager";
import { InterfaceEntity } from "game/entities/interface/InterfaceEntity";
import { createClickBehavior } from "game/entities/interface/createClickBehavior";
import { ComputeProps } from "modules/Entity/Entity";
import { formatSeconds } from "utils/dateFormatter";
import { EditorMode } from "game/Modes/EditorMode/EditorMode";
import { Controls } from "modules/Controls";

export class LengthController extends InterfaceEntity {
  editor: EditorMode;
  circleControl: InterfaceEntity;
  text: GameText;
  dragging = false;
  sounds = false;
  constructor(props: { editor: EditorMode; x: number; y: number }) {
    super(props.x, props.y, 10, 1);
    this.editor = props.editor;
    this.circleControl = new InterfaceEntity(this.x, this.y);
    this.circleControl.setAnimation("idle", { xFrames: [2], yFrames: [20] });
    this.circleControl.setAnimation("active", { xFrames: [2], yFrames: [21] });
    this.setAnimation("idle", { xFrames: [3], yFrames: [19] });
    this.behaviors.push(createClickBehavior(this));
    this.text = new GameText(this.x + this.w + 0.2, this.y + this.h / 2);
    this.text.align = "left";
    this.text.baseline = "middle";
    this.text.color = "#f0eceb";
    this.text.absolute = true;
    this.text.fontSize = 12;
    this.text.font = firstCoffee.family;
  }
  compute(props: ComputeProps) {
    const audio = this.editor.music;
    if (this.hovered && Controls.has("left")) {
      let progressRate = (props.mouse.absolute.x - this.x - 0.5) / (this.w - 1);
      if (progressRate < 0) progressRate = 0;
      if (progressRate > 1) progressRate = 1;
      audio.currentTime = audio.duration * progressRate;
      if (this.circleControl.animation === "idle") {
        this.circleControl.loadAnimation("active");
      }
    } else {
      if (this.circleControl.animation === "active") {
        this.circleControl.loadAnimation("idle");
      }
    }
    this.circleControl.x =
      this.x + (audio.currentTime / audio.duration) * (this.w - 1);
    this.defaultCompute(props);
    this.text.content = formatSeconds(audio.currentTime);
  }
  render(view: View) {
    this.defaultRender(view);
    this.circleControl.defaultRender(view);
    this.text.render(view);
  }
}
