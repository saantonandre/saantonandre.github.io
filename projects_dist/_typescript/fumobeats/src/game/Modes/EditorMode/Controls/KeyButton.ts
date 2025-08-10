import { firstCoffee } from "game/ModesManager/ModesManager";
import { UIButton } from "game/entities/interface/UIButton";
import { View } from "modules/View";

type Props = { x: number; y: number; content: string };
export class KeyButton extends UIButton {
  constructor(props: Partial<Props>) {
    super({ ...props, shadow: false });
    this.content = this.content.toUpperCase();
    this.text.content = this.content.toUpperCase();
    this.w = 2;
    this.h = 2;
    this.text.x = this.xCenter;
    this.text.y = this.yCenter + 0.2;
    this.text.align = "center";
    this.text.baseline = "middle";
    this.text.color = "#ab606a";
    this.text.fontSize = 22;
    this.text.font = firstCoffee.family;
    this.setAnimation("idle", { xFrames: [14], yFrames: [22] });
    this.setAnimation("active", { xFrames: [16], yFrames: [22] });
    this.behaviors = [];
    window.addEventListener("keydown", ({ key, ctrlKey }) => {
      if (ctrlKey) return;
      if (key === this.content.toLowerCase()) {
        this.loadAnimation("active");
        this.text.y = this.yCenter + 0.25;
      }
    });
    window.addEventListener("keyup", ({ key, ctrlKey }) => {
      if (ctrlKey) return;
      if (key === this.content.toLowerCase()) {
        this.loadAnimation("idle");
        this.text.y = this.yCenter + 0.2;
      }
    });
  }
  compute() {}
  render(view: View) {
    this.renderSprite(view);
    this.text.render(view);
  }
}
