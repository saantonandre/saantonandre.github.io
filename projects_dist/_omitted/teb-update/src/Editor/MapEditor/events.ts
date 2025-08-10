import { AppEvents } from "@modules/Events/AppEvents";
import { Point } from "@modules/lib/shapes";
import { MapEditorLevelExport } from "./MapEditorLevel";

export type EditorEvents = {
  initialized: [];
  render: [];
  "ratio-change": [];
  "camera-move": [];
  "level-added": [];
  "level-removed": [];
  "level-changed": [];
  "tile-selected": [];
  "grid-toggled": [];
  "info-toggled": [];
  "hover-rect": [];
  "area-selection": [];
  "canvas-changed": [];
  "spawnpoint-selection-start": [];
  "spawnpoint-selection-end": [];
  "spawnpoint-changed": [Point];
  "level-modified": [MapEditorLevelExport];
  "test-request": [MapEditorLevelExport];
};
/** Broadcast channel, used for messages */
const EDITOR_BROADCAST = "editor";
const broadcastChannel = new BroadcastChannel(EDITOR_BROADCAST);
export const editorEvents = new AppEvents<EditorEvents>(broadcastChannel);
