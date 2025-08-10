import { EditorMode } from "game/Modes/EditorMode/EditorMode";
import { InterfaceEntity } from "game/entities/interface/InterfaceEntity";
import { createClickBehavior } from "game/entities/interface/createClickBehavior";
import { Controls } from "modules/Controls";
import { ComputeProps } from "modules/Entity/Entity";

export class PlayController extends InterfaceEntity {
  editor: EditorMode;
  paused: boolean = true;
  sounds = false;
  constructor(props: { editor: EditorMode; x: number; y: number }) {
    super(props.x, props.y, 1, 1);
    this.editor = props.editor;
    this.setAnimation("playing-idle", { xFrames: [2], yFrames: [17] });
    this.setAnimation("playing-active", { xFrames: [3], yFrames: [17] });
    this.setAnimation("paused-idle", { xFrames: [2], yFrames: [16] });
    this.setAnimation("paused-active", { xFrames: [3], yFrames: [16] });
    this.animation = "active-paused";
    this.behaviors.push(createClickBehavior(this));
    this.onClick = () => {
      const audio = this.editor.music;
      if (audio.paused) audio.play();
      else audio.pause();
    };
    this.editor.music.addEventListener("pause", () => {
      this.loadAnimation("paused");
    });
    this.editor.music.addEventListener("play", () => {
      this.loadAnimation("playing");
    });
  }
  compute(props: ComputeProps) {
    this.animation =
      (this.editor.music.paused ? "paused-" : "playing-") +
      (this.hovered && Controls.has("left") ? "active" : "idle");
    this.defaultCompute(props);
  }
}
