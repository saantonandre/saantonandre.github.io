import { debug } from "modules/debug";
import { Behaviour, Entity } from "modules/entity/Entity";
import { isConeToPoint } from "modules/lib/physics/isConeToPoint";

export const creatureBehaviour = (entity: Entity, environment: Entity[]) => {
  // calculate entities in vision
  const radius = 8;
  const angle = 1;
  const pointA = entity.centerPoint;
  for (const entityB of environment) {
    if (entityB === entity) continue;
    const pointB = entityB.centerPoint;
    const visible = isConeToPoint(
      {
        origin: pointA,
        rotation: entity.rot,
        angle,
        radius,
      },
      pointB
    );
    entity.fillColor = "white";
    if (visible) {
      entity.fillColor = "red";
      debug.drawLine([pointA, pointB], "red");
    }
  }
  const PI2 = Math.PI * 2;
  const startAngle = (entity.rot - angle / 2) % PI2;
  const endAngle = (entity.rot + angle / 2) % PI2;

  const pointRA = {
    x: pointA.x + radius * Math.cos(startAngle),
    y: pointA.y + radius * Math.sin(startAngle),
  };
  const pointRB = {
    x: pointA.x + radius * Math.cos(endAngle),
    y: pointA.y + radius * Math.sin(endAngle),
  };
  debug.drawLine([pointA, pointRA], "green");
  debug.drawLine([pointA, pointRB], "green");
  debug.drawCustom((view) => {
    view.context.arc(
      ...view.parsePoint(pointA),
      radius * view.tilesize * view.ratio,
      startAngle,
      endAngle
    );
    view.context.stroke();
  }, "green");
};
