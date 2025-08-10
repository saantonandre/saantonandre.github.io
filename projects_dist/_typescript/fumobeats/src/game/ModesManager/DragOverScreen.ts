import { imagesIndex } from "assets/images";
import { firstCoffee } from "game/ModesManager/ModesManager";
import { InterfaceEntity } from "game/entities/interface/InterfaceEntity";
import { eventStream } from "game/gameEvents";
import { GameText } from "modules/Entity/GameText";
import { View } from "modules/View";

const dragOverBg = new Image();
dragOverBg.src = imagesIndex._bg_3_png;

export class DragOverScreen extends InterfaceEntity {
  dragOver = false;
  text = new GameText(0, 0);
  constructor(x: number, y: number, w: number, h: number) {
    super(x, y, w, h);
    this.sheet = dragOverBg;
    this.setAnimation("idle", { xFrames: [0], yFrames: [0] });
    this.text.x = this.w / 2;
    this.text.y = this.h / 2;
    this.text.absolute = true;
    this.text.align = "center";
    this.text.color = "white";
    this.text.font = firstCoffee.family;
    this.text.fontSize = 15;
  }
  compute() {
    eventStream.read("files-hover-start", ({ files }) => {
      this.dragOver = true;
      this.text.content = `Import file/s`;
    });
    eventStream.read("files-hover-end", () => {
      this.dragOver = false;
    });
  }
  render(view: View) {
    if (!this.dragOver) return;
    this.defaultRender(view);
    this.text.render(view);
  }
}
