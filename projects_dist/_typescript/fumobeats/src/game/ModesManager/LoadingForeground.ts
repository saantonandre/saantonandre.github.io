import { InterfaceEntity } from "game/entities/interface/InterfaceEntity";
import { eventStream } from "game/gameEvents";
import { ComputeProps } from "modules/Entity/Entity";
import { View } from "modules/View";

export class LoadingForeground extends InterfaceEntity {
  opacity = 0;
  active = false;
  icon: InterfaceEntity;
  fillColor = "#1f1f1f";

  constructor(view: View) {
    super(0, 0, view.w, view.h);
    this.icon = new InterfaceEntity(0, 0);
    const idle = this.icon.setAnimation("idle", {
      xFrames: [18, 18, 18, 18, 18, 18],
      yFrames: [14, 15, 16, 17, 18, 19],
    });
    idle.slowness = 4;
  }
  compute(props: ComputeProps) {
    eventStream.read("loading", (value) => {
      this.active = value;
    });
    this.opacity += (props.dt / 40) * (this.active ? 1 : -1);
    if (this.opacity > 0.5) this.opacity = 0.5;
    if (this.opacity < 0) this.opacity = 0;
    if (this.opacity === 0) return;
    this.icon.x = this.x + this.w / 2 - this.icon.w / 2;
    this.icon.y = this.y + this.h / 2 - this.icon.h / 2;
    this.icon.updateSprite(props.dt);
  }
  render(view: View) {
    if (this.opacity === 0) return;
    const prevAlpha = view.context.globalAlpha;
    view.context.globalAlpha = this.opacity;
    this.renderRect(view);
    view.context.globalAlpha = prevAlpha;
    this.icon.defaultRender(view);
  }
}
