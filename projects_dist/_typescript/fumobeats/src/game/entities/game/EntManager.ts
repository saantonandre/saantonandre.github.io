import { Fumo } from "game/entities/game/Fumo";
import { gravityBehavior, gravityBehavior2 } from "game/entities/gravity";
import { gameDebug } from "modules/Debug";
import { Entity } from "modules/Entity";

export abstract class EntManager {
  private static fumoPool: Fumo[] = [];
  private static cottonPool: Entity[] = [];
  static getFumo(): Fumo {
    for (const fumo of this.fumoPool) {
      if (fumo.removed) {
        fumo.setProperties({
          x: 0,
          y: 0,
          xVel: 0,
          yVel: 0,
          rotVel: 0,
          rot: 0,
          removed: false,
          solid: true,
          damaged: 0,
          animation: "idle",
          behaviors:[gravityBehavior]
        });
        return fumo;
      }
    }
    const newFumo = new Fumo(0, 0);
    this.fumoPool.push(newFumo);
    return newFumo;
  }
  static getCotton(): Entity {
    for (const cotton of this.cottonPool) {
      if (cotton.removed) {
        cotton.setProperties({
          x: 0,
          y: 0,
          xVel: 0,
          yVel: 0,
          rotVel: 0,
          rot: 0,
          removed: false,
          behaviors:[gravityBehavior]
        });
        return cotton;
      }
    }
    const newCotton = new Entity(0, 0);
    newCotton.behaviors=[gravityBehavior2]
    this.cottonPool.push(newCotton);
    return newCotton;
  }
}
