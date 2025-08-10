import { Fumobeat } from "game/Fumobeat";
import { InterfaceEntity } from "game/entities/interface/InterfaceEntity";
import { Sprite } from "modules/Entity";
import { ComputeProps } from "modules/Entity/Entity";
import { CustomAudio } from "modules/SoundManager/CustomAudio";
import { View } from "modules/View";
// 22.5 x 15
export class SongProgress extends InterfaceEntity {
  type = "song-progress";
  source: {
    track: CustomAudio;
    fumobeat: Fumobeat;
  };
  x = 0;
  y = 14.5;
  w = 0;
  h = 0.25;
  constructor(source: { track: CustomAudio; fumobeat: Fumobeat }) {
    super();
    this.source = source;
  }
  compute(props: ComputeProps) {
    const ogAudio = this.source.track.instances[0].original;
    const endTime = Math.max(...this.source.fumobeat.beats) / 1000;
    const progressRatio = ogAudio.currentTime / endTime;
    this.w = props.view.w * progressRatio;
  }

  render(view: View) {
    this.renderRect(view);
  }
}
