import { EditorMode } from "game/Modes/EditorMode/EditorMode";
import { InterfaceEntity } from "game/entities/interface/InterfaceEntity";
import { createClickBehavior } from "game/entities/interface/createClickBehavior";
import { Controls } from "modules/Controls";
import { ComputeProps } from "modules/Entity/Entity";
import { View } from "modules/View";

export class VolumeController extends InterfaceEntity {
  editor: EditorMode;
  circleControl: InterfaceEntity;
  dragging = false;
  sounds = false;
  constructor(props: { editor: EditorMode; x: number; y: number }) {
    super(props.x, props.y, 5, 1);
    this.editor = props.editor;
    this.circleControl = new InterfaceEntity(this.x, this.y);
    this.circleControl.setAnimation("idle", { xFrames: [3], yFrames: [20] });
    this.circleControl.setAnimation("active", { xFrames: [3], yFrames: [21] });
    this.setAnimation("idle", { xFrames: [4], yFrames: [18] });
    this.behaviors.push(createClickBehavior(this));
  }
  compute(props: ComputeProps) {
    const audio = this.editor.music;
    if (this.hovered && Controls.has("left")) {
      let volumeRatio = (props.mouse.absolute.x - this.x - 0.5) / (this.w - 1);
      if (volumeRatio < 0) volumeRatio = 0;
      if (volumeRatio > 1) volumeRatio = 1;
      audio.volume = volumeRatio;

      if (this.circleControl.animation === "idle") {
        this.circleControl.loadAnimation("active");
      }
    } else {
      if (this.circleControl.animation === "active") {
        this.circleControl.loadAnimation("idle");
      }
    }
    this.circleControl.x =
      this.x + audio.volume * (this.w - 1);
    this.defaultCompute(props);
  }
  render(view: View) {
    this.defaultRender(view);
    this.circleControl.defaultRender(view);
  }
}
