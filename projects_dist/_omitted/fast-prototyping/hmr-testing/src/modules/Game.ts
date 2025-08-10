import { Player } from "./Player";

const canvas = document.createElement("canvas");
canvas.width = 720;
canvas.height = 480;
canvas.style.margin = "auto";
document.body.appendChild(canvas);
const context = canvas.getContext("2d")!;

export class Game {
  entities: Player[] = [];
  constructor() {
    this.entities.push(new Player());
    this.loop();
  }

  loop = () => {
    for (const entity of this.entities) {
      entity.compute();
    }
    for (const entity of this.entities) {
      entity.render(context);
    }
    requestAnimationFrame(this.loop);
  };
}
