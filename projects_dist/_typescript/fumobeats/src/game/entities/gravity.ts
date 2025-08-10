import { Fumo } from "game/entities/game/Fumo";
import { eventStream } from "game/gameEvents";
import { Entity } from "modules/Entity";
import { Behavior } from "modules/Entity/Entity";

export const gravityBehavior: Behavior<Entity | Fumo> = function (e, props) {
  const { dt, view } = props;
  e.yVel += 0.015 * dt;
  if (e.y > view.y + view.h) {
    e.removed = true;
    e.onOutOfBounds(props);
    if (["fumo", "gymbag"].includes(e.type)&&!e.damaged) {
      eventStream.post("fumo-missed");
    }
    return false;
  }
  return true;
};
export const gravityBehavior2: Behavior<Entity | Fumo> = function (e, props) {
  const { dt, view } = props;
  e.yVel += 0.005 * dt;
  if (e.y > view.y + view.h) {
    e.removed = true;
    e.onOutOfBounds(props);
    return false;
  }
  return true;
};
