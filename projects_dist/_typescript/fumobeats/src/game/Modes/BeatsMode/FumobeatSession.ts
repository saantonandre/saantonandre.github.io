import { Fumobeat, getDummyFumobeat } from "game/Fumobeat";
import { eventStream } from "game/gameEvents";

export class FumobeatSession {
  fumobeat: Fumobeat = getDummyFumobeat();
  score: number = 0;
  missedFumos: number = 0;
  largestCombo: number = 0;
  perfectHits: number = 0;
  hasEnded: boolean = false;
  reset(fumobeat?: Fumobeat) {
    this.score = 0;
    this.missedFumos = 0;
    this.largestCombo = 0;
    this.perfectHits = 0;
    this.hasEnded = false;
    if (!fumobeat) return;
    this.fumobeat = fumobeat;
  }
}
