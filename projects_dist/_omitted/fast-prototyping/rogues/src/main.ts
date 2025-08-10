import { createGame, Game } from "./modules/Game";

const canvas = document.getElementById("game-canvas") as HTMLCanvasElement;

const game = createGame(canvas);
game.loop()
class MouseSystem {
  size = 2;
  compute(game: Game) {}
  render(game: Game) {
    const { x, y, context, tilesize, ratio } = game.view;
    context.strokeStyle = "#ccc";
    context.beginPath();
    context.rect(
      (x - this.size / 2) * tilesize * ratio,
      (y - this.size / 2) * tilesize * ratio,
      this.size * tilesize * ratio,
      this.size * tilesize * ratio
    );
    context.closePath();
    context.stroke();
    // context.fillStyle="white"
    // context.fillRect(
    //   (x - this.size / 2) * tilesize * ratio,
    //   (y - this.size / 2) * tilesize * ratio,
    //   this.size * tilesize * ratio,
    //   this.size * tilesize * ratio
    // );
  }
}

game.systems.push(new MouseSystem());
