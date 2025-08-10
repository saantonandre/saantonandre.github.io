// REFACTOR

// import { gameDebug } from "@modules/Debug";
import { Entity } from "@modules/Entity";
import { ComputeProps } from "@modules/Entity/Entity";
// import { InterfaceEntity } from "@modules/Entity/InterfaceEntity";
import { Mouse } from "@modules/Mouse";
import { Timing } from "@modules/Timing";
import { View } from "@modules/View";
import { Game } from "./Game";

export type GameModeProps = Game["_props"];
/**
 * ents, time, view, sound, mouse, dt
 */
export abstract class GameMode implements ComputeProps {
  /** Entities */
  ents: Entity[] = [];
  /** Time stuff */
  time = new Timing({
    onRateChange: (rate: number) => {
      this.sound.speed = rate;
    },
    onFpsCycle: (fps) => {
      //gameDebug.showFps(fps)
    },
  });
  /** Canvas related data */
  view: View;
  /** Sound manager data */
  sound: GameModeProps["sound"];
  /** Mouse data */
  mouse: Mouse;
  /** Current delta time */
  get dt() {
    return this.time.deltaTime;
  }
  constructor({ view, sound, mouse }: GameModeProps) {
    this.view = view;
    this.sound = sound;
    this.mouse = mouse;
  }
  onSwitchOut() {}
  compute(resume?: boolean) {}
  initCompute(resume?: boolean) {
    if (resume) {
      this.time.updateCurrentTime();
    }
    this.time.compute();
  }
}
