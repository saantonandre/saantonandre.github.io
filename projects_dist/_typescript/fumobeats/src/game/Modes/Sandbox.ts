import { SongEndScreen } from "game/Modes/BeatsMode/SongEndScreen";
import { GameMode, GameModeProps } from "game/Modes/GameMode";
import { BasicBackground } from "game/entities/interface/BasicBackground";
import { gameDebug } from "modules/Debug";

export class Sandbox extends GameMode {
  constructor(props: GameModeProps) {
    super(props);
    this.ents.push(new BasicBackground(1, props.view.w, props.view.h));

    this.ents.push(new SongEndScreen(props.view));
  }
  compute(resume?: boolean) {
    this.initCompute(resume);
    gameDebug.drawPoint(this.mouse.absolute, "red", true);
    for (let i = 0; i < this.ents.length; i++) {
      this.ents[i].compute(this);
    }
    for (let i = 0; i < this.ents.length; i++) {
      this.ents[i].render(this.view);
    }
  }
}
