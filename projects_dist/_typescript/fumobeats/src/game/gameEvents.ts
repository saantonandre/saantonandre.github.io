import { Fumobeat } from "game/Fumobeat";
import { GameModes } from "game/ModesManager/ModesManager";
import { EventStream } from "modules/Events/EventStream";

type GameEvents = {
  /** The player has hit something */
  "switch-mode": [{ mode: GameModes }];
  /** The player has hit something */
  "player-hit": [{ perfect: boolean }];
  /** The player has scored some points */
  "player-score": [{ perfect: boolean; combo: number }];
  /** The player has beeen damaged */
  "player-damaged": [];
  /** The player combo streak has been broken */
  "combo-break": [{ combo: number }];
  /** A large streak of fumos is about to spawn */
  "fumo-streak-start": [];
  /** The player is slowing time */
  "time-slow-start": [];
  /** A request to pause has been submitted */
  "game-pause": [];
  /** A request to pause has been submitted */
  "game-resume": [];
  /** A request to change playback rate has been submitted */
  "game-rate-change": [{ rate: number }];
  /** A fileList of any type has been submitted for analysis */
  "files-import-request": [{ files: FileList | File[] }];
  /** A fileList of any type is being hovered */
  "files-hover-start": [{ files: FileList | File[] }];
  /** A fileList of any type has stopped being hovered */
  "files-hover-end": [];
  /** A request to play the given fumobeat */
  "fumobeat-play": [{ fumobeat: Fumobeat }];
  /** The last fumo in a fumobeat of the song has been removed */
  "fumobeat-end": [];
  /** The current frame value of the playing fumobeat  */
  // "fumobeat-wave": [number];
  /** A request to edit the given fumobeat */
  "fumobeat-edit": [{ fumobeat: Fumobeat }];
  /** One or more fumobeats have been selected to be exported */
  "fumobeats-export": [{ fumobeats: Fumobeat[] }];
  /** One or more fumobeats have been imported */
  "fumobeats-import": [{ fumobeats: Fumobeat[] }];
  /** One or more fumobeats have been selected for deletion. (fumobeats) */
  "fumobeats-delete": [{ fumobeats: Fumobeat[] }];
  /** A fumobeat's delete button has been hovered */
  "fumobeat-delete-button-in": [];
  /** A fumobeat's delete button has been unhovered */
  "fumobeat-delete-button-out": [];
  /** A fumobeat's delete button has been hovered */
  "fumobeat-download-button-in": [];
  /** A fumobeat's delete button has been unhovered */
  "fumobeat-download-button-out": [];
  /** A fumo has been spawned */
  "fumo-spawn": [];
  /** A spotless fumo has fallen out of bounds */
  "fumo-missed": [];
  /** One or more items in the database has either been added or removed */
  "database-change": [];
  /** An asynchronous operation started/finished */
  loading: [boolean];
  /** The mouse wheel has been scrolled up or down. Negative if up */
  scroll: [{ direction: number }];
};

export const eventStream = new EventStream<GameEvents>();
