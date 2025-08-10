import { EditorMode } from "game/Modes/EditorMode/EditorMode";
import { InterfaceEntity } from "game/entities/interface/InterfaceEntity";
import { createClickBehavior } from "game/entities/interface/createClickBehavior";
import { eventStream } from "game/gameEvents";
import { Controls } from "modules/Controls";
import { ComputeProps } from "modules/Entity/Entity";
import { View } from "modules/View";
import { isPointToRect } from "modules/lib/physics/isPointToRect";
import { Rect } from "modules/types/shapes";

export class WaveController extends InterfaceEntity {
  editor: EditorMode;
  progressRate = 0;
  barsWidth = 1;
  caret: InterfaceEntity;
  miniFumo = new MiniFumo();
  sounds = false;
  prevTime = 0;
  constructor(props: {
    editor: EditorMode;
    x: number;
    y: number;
    w: number;
    h: number;
  }) {
    super(props.x, props.y, props.w, props.h);
    this.editor = props.editor;
    this.fillColor = "#f0eceb";
    this.behaviors.push(createClickBehavior(this));
    this.onClick = (_, { mouse }) => {
      if (!this.editor.audioWave.length) return;
      const clickRatio = (mouse.absolute.x - (this.x + this.w / 2)) / this.w;
      const barsAmount = this.w / this.barsWidth;
      const barsValue = barsAmount / this.editor.audioWave.length;
      const audio = this.editor.music;
      audio.currentTime += audio.duration * clickRatio * barsValue;
    };
    this.caret = new InterfaceEntity();
    this.caret.w = 1;
    this.caret.h = 5;
    this.caret.x = this.x + this.w / 2 - this.caret.w / 2;
    this.caret.y = this.y + this.h / 2 - this.caret.h / 2;
    this.caret.setAnimation("idle", { xFrames: [13], yFrames: [19] });
  }
  private handleInputs = () => {
    const INPUT_DELAY = 25;
    if (Controls.has("Control")) {
      if (Controls.hasNew("z")) this.editor.fumobeat.beats.pop();
      return;
    }
    if (Controls.hasNew("x")) {
      const time = Math.floor(
        this.editor.music.currentTime * 1000 - INPUT_DELAY
      );
      // if right to left number is odd
      this.editor.fumobeat.beats.push(time + (time % 2 ? 0 : 1));
    }
    if (Controls.hasNew("z")) {
      const time = Math.floor(
        this.editor.music.currentTime * 1000 - INPUT_DELAY
      );
      // if left to right number is even
      this.editor.fumobeat.beats.push(time + (time % 2 ? 1 : 0));
    }
  };
  compute(props: ComputeProps) {
    this.defaultCompute(props);
    this.handleInputs();
    const audio = this.editor.music;
    const length = audio.duration;
    const currentTime = audio.currentTime;
    this.progressRate = currentTime / length;
    this.barsWidth = 1 / props.view.tilesize;
    const timestamps = this.editor.fumobeat.beats;
    const SOUND_ANTICIPATION = 0.25;
    for (const t of timestamps) {
      const timestamp = t / 1000 - SOUND_ANTICIPATION;
      if (timestamp > currentTime) continue; // make sure currentTime is >= timestamp
      if (timestamp < this.prevTime) continue; // make sure prevTime is <= timestamp
      this.editor.sound.play("_plink_mp3", { resettable: true });
    }
    this.prevTime = currentTime;

    // const ratioIndex = Math.floor(this.progressRate * this.editor.audioWave.length);
    // console.log(this.editor.audioWave[ratioIndex])
    // const waveValue=2-this.editor.audioWave[ratioIndex]
  }
  render(view: View) {
    const tempRect = Rect.temp();
    const length = this.editor.audioWave.length;
    tempRect.w = this.barsWidth;
    const totalWidth = tempRect.w * length;
    for (let i = 0; i < length; i++) {
      tempRect.x =
        this.x +
        this.barsWidth * i -
        totalWidth * this.progressRate +
        this.w / 2;
      if (tempRect.x < 0 || tempRect.x > view.w) continue;
      tempRect.h = this.editor.audioWave[i] * this.h;
      tempRect.y = this.y + this.h / 2;
      view.context.fillStyle = "#f0eceb";
      view.context.fillRect(...view.parseRect(tempRect, { absolute: true }));
    }
    const timestamps = this.editor.fumobeat.beats;
    for (let i = timestamps.length - 1; i >= 0; i--) {
      const fumoProgressRate =
        timestamps[i] / 1000 / this.editor.music.duration;
      this.miniFumo.x =
        this.x +
        this.w / 2 +
        fumoProgressRate * totalWidth -
        totalWidth * this.progressRate -
        this.miniFumo.w / 2;
      if (this.miniFumo.x < -this.miniFumo.w || this.miniFumo.x > view.w) {
        continue;
      }
      this.miniFumo.left = Math.abs(timestamps[i] % 2);
      this.miniFumo.y = timestamps[i] % 2 ? this.y + 2.5 : this.y + 0.5;
      if (Controls.has("right")) {
        if (isPointToRect(this.editor.mouse.absolute, this.miniFumo)) {
          timestamps.splice(i, 1);
          continue;
        }
      }
      this.miniFumo.render(view);
    }

    this.caret.render(view);
  }
}

export class MiniFumo extends InterfaceEntity {
  constructor() {
    super(0, 0);
    this.setAnimation("idle", { xFrames: [14], yFrames: [19] });
    this.setAnimation("idle", { xFrames: [14], yFrames: [20], left: 1 });
  }
  render(view: View) {
    if (this.x < -this.w || this.x > view.w) return;
    const prevOpacity = view.context.globalAlpha;
    const w = view.w;
    const newAlpha = Math.abs(this.x - w / 2) / (w / 2);
    view.context.globalAlpha = 1 - newAlpha / 2;
    this.defaultRender(view);
    view.context.globalAlpha = prevOpacity;
  }
}
