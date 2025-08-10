import { gameDebug } from "@modules/Debug";
import { Game } from "./Game";

export function initialize() {
  gameDebug.initialize()
  const game = new Game();
  game.init();
}
