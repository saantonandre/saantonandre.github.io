import { Player } from "game/entities/game/Player/Player";
import { getPivotOffsets } from "game/entities/game/Player/createPunchMouseBehavior";
import { Fumo } from "game/entities/game/Fumo";
import { ComputeProps } from "modules/Entity/Entity";
import { isCircleToCircle } from "modules/lib/physics/isCircleToCircle";
import { Circle, Point } from "modules/types/shapes";

const dummyFumo = new Fumo(0, 0);
type FumoSpawnProps = {
  x: number;
  y: number;
  xVel: number;
  yVel: number;
  rotVel: number;
  left: number;
  rot: number;
};

/** Returns the time offset of a fumo from spawning to being hittable */
export function getFumoTiming(
  fumoProps: FumoSpawnProps,
  computeProps: ComputeProps,
  player: Player
) {
  const MAX_LOOPS = 300;
  const REMOVED_LATENCY = 180;
  const DELTA_TIME = 1;
  let frames = 0;
  const pivotL = Point.add(player, getPivotOffsets(player, 1));
  const pivotR = Point.add(player, getPivotOffsets(player, 0));
  const circleL = new Circle(pivotL.x, pivotL.y, player.arm.w);
  const circleR = new Circle(pivotR.x, pivotR.y, player.arm.w);
  const fumo = applyFumoProps(dummyFumo, fumoProps);
  while (frames < MAX_LOOPS) {
    fumo.computeBehaviors({ ...computeProps, dt: DELTA_TIME });
    fumo.updateVelocities(DELTA_TIME);
    fumo.updatePosition(DELTA_TIME);
    const circle = new Circle(fumo.xCenter, fumo.yCenter, fumo.hitbox.w / 2);
    if (
      fumoProps.left
        ? isCircleToCircle(circle, circleL)
        : isCircleToCircle(circle, circleR)
    ) {
      break;
    }
    frames++;
  }
  const msLatency = frames * computeProps.time.gameTimeRate;
  return msLatency + REMOVED_LATENCY;
}

export function applyFumoProps(fumo: Fumo, props: FumoSpawnProps) {
  fumo.removed = false;
  fumo.x = props.x;
  fumo.y = props.y;
  fumo.xVel = props.xVel;
  fumo.yVel = props.yVel;
  fumo.rotVel = props.rotVel;
  fumo.rot = props.rot;
  fumo.left = props.left;
  return fumo;
}
