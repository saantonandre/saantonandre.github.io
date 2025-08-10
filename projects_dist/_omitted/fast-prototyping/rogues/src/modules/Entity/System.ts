import { type Game } from "../Game";

export abstract class System {
  abstract compute(game: Game): void;
  abstract render(game: Game): void;
}
