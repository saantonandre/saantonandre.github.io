import { ArmComponent } from "game/entities/game/Player/ArmComponent";
import { Player } from "game/entities/game/Player/Player";
import { Controls } from "modules/Controls";
import { gameDebug } from "modules/Debug";
import { Behavior } from "modules/Entity/Entity";
import { getAngle } from "modules/lib/physics/getAngle";
import { Point, Rect } from "modules/types/shapes";

export const getPivotOffsets = (rect: Rect, left: number) => {
  const multLeft = 0.15;
  const multRight = 1 - multLeft;
  const x = left ? rect.w * multLeft : rect.w * multRight;
  const y = rect.h * 0.34;
  return new Point(x, y);
};

export const createPunchMouseBehavior = (arm: ArmComponent) => {
  const behavior: Behavior<Player> = (
    player,
    { dt, sound,  mouse }
  ) => {
    const state = arm.punchState;
    state.duration -= dt;
    if (
      Controls.hasNew("left") &&
      state.punch === "idle"
    ) {
      sound.play("_neuro_pfft_mp3", { volume: 0.6 });
      arm.loadAnimation("idle");
      state.punch = "punch";
      state.duration = state.maxDuration;
    }
    if (player.damaged) {
      state.duration = 0;
      state.punch = "idle";
    } else if (player.animation !== state.punch) {
      player.loadAnimation(state.punch);
    }
    arm.display = ["punch"].includes(state.punch);
    if (state.punch === "punch") {
      if (state.duration <= 0) state.punch = "idle";
    }
    const rot = getAngle(player.center, mouse);
    const left = player.damaged
      ? player.left
      : Number(Math.abs(rot) > Math.PI / 2);
    const relativeRot = getAngle(arm, mouse);

    if (!["punch"].includes(state.punch)) {
      player.left = left;
      arm.rot = relativeRot;
      const pivot = getPivotOffsets(player, left);
      arm.x = player.x + pivot.x;
      arm.y = player.y + pivot.y;
      arm.left = left;
    }

    gameDebug.drawLine([arm, mouse], "red");
    gameDebug.drawLine([arm, arm.target], "yellow");
    gameDebug.drawCustom((view) => {
      view.context.arc(
        ...view.parsePoint(arm.target),
        0.2 * view.tilesize * view.ratio,
        0,
        Math.PI * 2
      );
      view.context.stroke();
    }, "yellow");
    return true;
  };

  return behavior;
};
