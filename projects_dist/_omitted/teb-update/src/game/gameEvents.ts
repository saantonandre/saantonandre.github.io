import { EventStream } from "@modules/Events/EventStream";

type GameEvents = {
  // "switch-mode": [{ mode: GameModes }];
  // "player-hit": [{ perfect: boolean }];
  // "player-score": [{ perfect: boolean; combo: number }];
  "pause-start": [number];
  "pause-end": [number];
};

export const eventStream = new EventStream<GameEvents>();