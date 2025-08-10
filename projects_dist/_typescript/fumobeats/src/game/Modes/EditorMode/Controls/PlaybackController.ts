import { EditorMode } from "game/Modes/EditorMode/EditorMode";
import { InterfaceEntity } from "game/entities/interface/InterfaceEntity";
import { createClickBehavior } from "game/entities/interface/createClickBehavior";
import { Controls } from "modules/Controls";
import { ComputeProps } from "modules/Entity/Entity";
import { View } from "modules/View";

export class PlaybackController extends InterfaceEntity {
  editor: EditorMode;
  circleControl: InterfaceEntity;
  resetButton: InterfaceEntity;
  dragging = false;
  sounds = false;
  constructor(props: { editor: EditorMode; x: number; y: number }) {
    super(props.x, props.y, 5, 1);
    this.editor = props.editor;
    this.circleControl = new InterfaceEntity(this.x, this.y);
    this.circleControl.setAnimation("idle", { xFrames: [4], yFrames: [20] });
    this.circleControl.setAnimation("active", { xFrames: [4], yFrames: [21] });
    this.resetButton = new InterfaceEntity(this.x + this.w, this.y);
    this.resetButton.setAnimation("idle", { xFrames: [5], yFrames: [20] });
    this.resetButton.setAnimation("active", { xFrames: [5], yFrames: [21] });
    this.resetButton.behaviors.push(createClickBehavior(this.resetButton));
    this.resetButton.onClick = () => {
      this.editor.music.playbackRate = 1;
    };
    this.setAnimation("idle", { xFrames: [4], yFrames: [18] });
    this.behaviors.push(createClickBehavior(this));
  }
  compute(props: ComputeProps) {
    const audio = this.editor.music;
    const min = 0.25;
    const max = 3;
    if (this.hovered && Controls.has("left")) {
      let playbackRate = (props.mouse.absolute.x - this.x - 0.5) / (this.w - 1);
      if (playbackRate < 0) playbackRate = 0;
      if (playbackRate > 1) playbackRate = 1;
      audio.playbackRate = min + playbackRate * (max - min);

      if (this.circleControl.animation === "idle") {
        this.circleControl.loadAnimation("active");
      }
    } else {
      if (this.circleControl.animation === "active") {
        this.circleControl.loadAnimation("idle");
      }
    }
    const currentRate = (audio.playbackRate - min) / (max - min);
    this.circleControl.x = this.x + currentRate * (this.w - 1);
    if (audio.playbackRate !== 1) {
      this.resetButton.animation !== "active" &&
        this.resetButton.loadAnimation("active");
    } else {
      this.resetButton.animation !== "idle" &&
        this.resetButton.loadAnimation("idle");
    }
    this.defaultCompute(props);
    this.resetButton.defaultCompute(props);
  }
  render(view: View) {
    this.defaultRender(view);
    this.circleControl.defaultRender(view);
    this.resetButton.defaultRender(view);
  }
}
