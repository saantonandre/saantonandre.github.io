import { InterfaceEntity } from "game/entities/interface/InterfaceEntity";
import { Controls } from "modules/Controls";
import { Behavior } from "modules/Entity/Entity";
import { isPointToRect } from "modules/lib/physics/isPointToRect";
import { Rect } from "modules/types/shapes";

export const createClickBehavior = (
  hitbox?: Rect
): Behavior<InterfaceEntity> => {
  const state = {
    prevMouseDown: false,
    clickStart: false,
  };

  return (e, props) => {
    if (isPointToRect(props.mouse.absolute, hitbox || e.hitbox)) {
      if (!e.hovered) {
        e.hovered = true;
        e.sounds && props.sound.play("_hover_mp3", { volume: 0.3 });
        e.onMouseEnter?.(e, props);
      }
      if (!state.prevMouseDown && Controls.has("left")) {
        e.sounds && props.sound.play("_select_mp3", { volume: 0.3 });
        state.clickStart = true;
      }
      if (state.clickStart && !Controls.has("left")) {
        state.clickStart = false;
        e.onClick?.(e, props);
      }
    } else {
      if (e.hovered) {
        e.hovered = false;
        e.onMouseOut?.(e, props);
      }
    }
    if (state.prevMouseDown && !Controls.has("left")) {
      state.clickStart = false;
    }
    state.prevMouseDown = Controls.has("left");
    return true;
  };
};
