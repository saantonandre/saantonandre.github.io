import { editorEvents } from "@Editor/MapEditor/events";
import { gameDebug } from "@modules/Debug";
import { Entity } from "@modules/Entity";
import { Player } from "./entities/Player";
import { GameMode } from "./GameMode";
import { mapConfig } from "./mapConfig";
import { type GameModeProps } from "./Game";
import { type Point } from "@modules/lib/shapes";
import { type TypedRect } from "@Editor/MapEditor/rectUtils";

import map from "./maps/0.json";

export class SandboxMode extends GameMode {
  constructor(props: GameModeProps) {
    super(props);
    const player = new Player();
    props.view.changeFocus(player);
    this.ents.push(...importMap(map[0], player));
    console.log(props);
    editorEvents.sub("test-request", ({ data }) => {
      this.ents.length = 0;
      this.ents.push(...importMap(data, player));
    });
    editorEvents.sub("level-modified", ({ data }) => {
      this.ents.length = 0;
      this.ents.push(...importMap(data, player, false));
    });
  }
  compute() {
    this.initCompute();
    gameDebug.drawPoint(this.mouse.absolute, "red", true);
    for (let i = 0; i < this.ents.length; i++) {
      this.ents[i].compute(this);
    }
    for (let i = this.ents.length - 1; i >= 0; i--) {
      if (this.ents[i].removed) {
        this.ents.splice(i, 1);
      }
    }
    for (let i = 0; i < this.ents.length; i++) {
      this.ents[i].render(this.view);
    }
  }
}
function importMap(
  level: { map: TypedRect[]; spawnPoint: Point },
  player: Player,
  reposition: boolean = true
) {
  const ents = level.map.flatMap(({ x, y, w, h, type }) => {
    const entities = [];
    for (let width = 0; width < w; width++) {
      for (let height = 0; height < h; height++) {
        const entity = new Entity(x + width, y + height, 1, 1);
        entity.setAnimation("idle", {
          xFrames: [mapConfig.tiles?.[type][0] || 0],
          yFrames: [mapConfig.tiles?.[type][1] || 0],
        });
        entity.fillColor = "darkgray";
        entities.push(entity);
      }
    }
    console.log(entities);
    return entities;
  });
  if (reposition) {
    player.setProperties({ x: level.spawnPoint.x, y: level.spawnPoint.y });
  }
  ents.push(player);
  return ents;
}
