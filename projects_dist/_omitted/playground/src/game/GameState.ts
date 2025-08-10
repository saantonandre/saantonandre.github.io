import { Creature } from "game/Creature";
import { creatureBehaviour } from "game/Creature/creatureBehaviour";
import { Timing } from "modules/Timing";
import { View } from "modules/View";
import { GameCanvas } from "modules/canvas";
import { Controls } from "modules/controls";
import { debug } from "modules/debug";
import { Entity } from "modules/entity";
import { Behaviour } from "modules/entity/Entity";
import { getAngle } from "modules/lib/physics/getAngle";
import { Mouse } from "modules/mouse";
import { Point } from "modules/types/shapes";

export class GameState {
  private view: View;
  private timing: Timing;
  private canvas: GameCanvas;
  private entities: Entity[] = [];
  private mouse: Mouse;
  constructor() {
    const canvas = new GameCanvas(400, 400);
    this.canvas = canvas;
    this.view = new View({ canvas, ratio: 0.5, tilesize: 16 });
    this.mouse = new Mouse(this.view);
    this.timing = new Timing();
  }
  init = () => {
    debug.active = true;
    console.log("Initializing...");
    const creature = new Creature(
      this.view.tilesWidth / 2,
      this.view.tilesHeight / 2
    );
    const controls = new Controls();

    creature.behaviours.push((entity) => {
      entity.rot = getAngle(entity.centerPoint, this.mouse);
    });
    // this.view.changeFocus(creature);
    creature.behaviours.push((entity) => {
      if (controls.up) {
        entity.yVel = entity.speed * -1;
      } else if (controls.down) {
        entity.yVel = entity.speed * 1;
      } else {
        entity.yVel = 0;
      }
      if (controls.left) {
        entity.xVel = entity.speed * -1;
      } else if (controls.right) {
        entity.xVel = entity.speed * 1;
      } else {
        entity.xVel = 0;
      }
    }, creatureBehaviour);
    this.view.changeFocus(creature);

    const dist = 5;
    const entitiesArr = [
      new Creature(creature.x + dist, creature.y),
      new Creature(creature.x, creature.y + dist),
      new Creature(creature.x - dist, creature.y),
      new Creature(creature.x, creature.y - dist),
      new Creature(creature.x + dist, creature.y),
      new Creature(creature.x, creature.y + dist),
      new Creature(creature.x - dist, creature.y),
      new Creature(creature.x, creature.y - dist),
      new Creature(creature.x + dist, creature.y),
      new Creature(creature.x, creature.y + dist),
      new Creature(creature.x - dist, creature.y),
      new Creature(creature.x, creature.y - dist),
    ];
    const entityFn = () => {
      let count = Math.random() * Math.PI * 2;
      const increment = 0.01 * (Math.random() > 0.5 ? 1 : -1);
      const behaviour: Behaviour = (e, es) => {
        creatureBehaviour(e, es);
        const PI2 = Math.PI * 2;
        if (e.fillColor === "red") {
          const angle = getAngle(e.centerPoint, creature.centerPoint);
          const diff = ((angle - e.rot) % PI2) + PI2;
          e.rot = ((e.rot + diff) % PI2) + PI2;
          count = e.rot;
          e.xVel = (e.speed / 2) * Math.cos(e.rot);
          e.yVel = (e.speed / 2) * Math.sin(e.rot);
        } else {
          count += increment;
          e.rot = (count % PI2) + PI2;
          e.xVel = e.speed * Math.cos(e.rot);
          e.yVel = e.speed * Math.sin(e.rot);
        }
      };
      return behaviour;
    };
    entitiesArr.forEach((entity) => {
      entity.behaviours.push(entityFn());
      entity.speed = Math.random() * 0.1 + 0.05;
    });
    this.entities.push(...entitiesArr, creature);
    this.loop();
  };
  private loop = () => {
    this.timing.compute();
    this.canvas.clear();
    for (const entity of this.entities) {
      entity.compute(this.entities, this.timing.deltaTime);
    }
    for (const entity of this.entities) {
      entity.render(this.view);
    }
    this.view.compute(this.timing.deltaTime);
    this.mouse.updatePos();
    debug.render(this.view);
    requestAnimationFrame(this.loop);
  };
}

const drawCalculatedCircle = (
  speed: number,
  centerPoint: Point,
  increment: number,
  rot: number
) => {
  const center = centerPoint;
  const incrementsToPI = (Math.PI * 2) / increment;
  const circumference = incrementsToPI * speed;
  const radius = circumference / (Math.PI * 2);

  const circleCenter = {
    x: Math.cos(rot + Math.PI / 2) * radius + center.x,
    y: Math.sin(rot + Math.PI / 2) * radius + center.y,
  };
  debug.drawCustom((view) => {
    view.context.arc(
      ...view.parsePoint(circleCenter),
      Math.abs(radius) * view.tilesize * view.ratio,
      0,
      Math.PI * 2
    );
    view.context.stroke();
  }, "gray");
};
