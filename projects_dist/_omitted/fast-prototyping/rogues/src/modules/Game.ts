import { type Entity } from "./Entity";
import { System } from "./Entity/System";
import { View } from "./View";

export type { Game };

class Game {
  /** Delta Time */
  dt = 1;
  timestamp = 0;
  FRAME_INTERVAL = 1000 / 60;
  fps = 0;
  entities: Entity[] = [];
  view: View;
  systems: System[] = [];
  constructor(canvas: HTMLCanvasElement, props: Partial<Game> = {}) {
    this.view = props.view || new View(canvas);
    Object.assign(this, props);
  }
  computeDeltaTime(timestamp: number) {
    this.dt = (timestamp - this.timestamp) / this.FRAME_INTERVAL;
    this.timestamp = timestamp;
  }
  loop = (timestamp: number = this.timestamp) => {
    this.computeDeltaTime(timestamp);
    this.view.compute(this.dt);
    this.view.clear();
    for (const entity of this.entities) {
      entity.compute(this);
    }
    for (const system of this.systems) {
      system.compute(this);
    }
    for (let i = this.entities.length - 1; i >= 0; i--) {
      if (this.entities[i].removed) {
        this.entities.splice(i, 1);
      }
    }
    for (const entity of this.entities) {
      entity.render(this);
    }
    for (const system of this.systems) {
      system.render(this);
    }
    requestAnimationFrame(this.loop);
  };
}
export function createGame(
  canvas: HTMLCanvasElement,
  props: Partial<Game> = {}
) {
  return new Game(canvas, props);
}
