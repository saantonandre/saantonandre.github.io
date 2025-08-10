import { InterfaceEntity } from "game/entities/interface/InterfaceEntity";
import { eventStream } from "game/gameEvents";
import { Entity } from "modules/Entity";
import { Behavior } from "modules/Entity/Entity";
import { View } from "modules/View";
export class ArrowsBackground extends InterfaceEntity {
  declare behaviors: Behavior<ArrowsBackground>[];
  bgOpacity = 0;
  constructor(w: number, h: number) {
    super(0, 0, w, h);
    const arrows = [
      new Arrow(3, 3),
      new Arrow(3, h - 5),
      new Arrow(w - 5, 3, 1),
      new Arrow(w - 5, h - 5, 1),
    ];
    this.components.push(...arrows);
  }
  osuWarning(ms: number, callback?: () => void) {
    const state = {
      increasing: true,
      paused: false,
    };
    this.behaviors.push((bg, props) => {
      const speed = props.dt * 3;
      if (state.increasing) {
        bg.bgOpacity += speed;
        if (bg.bgOpacity > 100) {
          bg.bgOpacity = 100;
          state.increasing = false;
          state.paused = true;
          eventStream.post("fumo-streak-start");
          props.time.deltaTimeout(() => (state.paused = false), ms);
          return true;
        }
      }
      if (!state.paused && !state.increasing) {
        bg.bgOpacity -= speed;
        if (bg.bgOpacity < 0) {
          bg.bgOpacity = 0;
          callback?.();
          return false;
        }
      }
      return true;
    });
  }
  render(view: View) {
    this.renderSprite(view);
    if (this.bgOpacity) {
      view.context.fillStyle = "black";
      view.context.globalAlpha = this.bgOpacity / 200;
      view.context.fillRect(...view.parseRect(this, { absolute: true }));
      view.context.globalAlpha = 1;
    }
    if (this.bgOpacity === 100) {
      for (const component of this.components) {
        component.render(view);
      }
    }
  }
}
class Arrow extends Entity {
  constructor(x: number, y: number, left: 0 | 1 = 0) {
    super(x, y);
    this.w = 2;
    this.h = 2;
    this.left = left;
    this.absolute = true;
    this.setAnimation("idle", { xFrames: [2, -100], yFrames: [14, 14] });
    this.setAnimation("idle", {
      xFrames: [4, -100],
      yFrames: [14, 14],
      left: 1,
    });
    if (this.animations["idle"]) {
      this.animations["idle"].slowness = 10;
    }
  }
}
