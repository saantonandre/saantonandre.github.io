import { QuitButton } from "game/entities/interface/QuitButton";
import { GameMode, GameModeProps } from "game/Modes/GameMode";
import { LoadingForeground } from "game/ModesManager/LoadingForeground";
import { eventStream } from "game/gameEvents";
import { ComputeProps } from "modules/Entity/Entity";
import { View } from "modules/View";
import { GameModes } from "game/ModesManager/ModesManager";
import { DragOverScreen } from "game/ModesManager/DragOverScreen";

export class GameOverlay extends GameMode {
  currentMode: GameModes = "menu";
  constructor(props: GameModeProps) {
    super(props);
    this.ents.push(new LoadingForeground(props.view));
    const quit = new QuitButton({
      x: this.view.w - 1,
      y: 0,
      onClick: () => {
        eventStream.post("switch-mode", { mode: "menu" });
      },
    });
    quit.compute = (props: ComputeProps) => {
      if (this.currentMode !== "menu") {
        quit.defaultCompute(props);
        quit.animation = quit.hovered ? "active" : "idle";
      }
    };
    quit.render = (view: View) => {
      if (this.currentMode !== "menu") quit.defaultRender(view);
    };
    this.ents.push(quit);
    this.ents.push(new DragOverScreen(0,0,this.view.w,this.view.h))
  }
  compute(resume?: boolean) {
    this.initCompute(resume);
    eventStream.read("switch-mode", ({ mode }) => {
      this.currentMode = mode;
    });
    for (let i = 0; i < this.ents.length; i++) {
      this.ents[i].compute(this);
    }
    for (let i = 0; i < this.ents.length; i++) {
      this.ents[i].render(this.view);
    }
  }
}
