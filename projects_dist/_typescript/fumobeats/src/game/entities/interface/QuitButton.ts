import { InterfaceEntity } from "game/entities/interface/InterfaceEntity";
import { createClickBehavior } from "game/entities/interface/createClickBehavior";

export class QuitButton extends InterfaceEntity {
  constructor(props: {
    x: number;
    y: number;
    onClick: () => void;
  }) {
    super(props.x, props.y, 1, 1);
    this.setAnimation("idle", { xFrames: [2], yFrames: [18] });
    this.setAnimation("active", { xFrames: [3], yFrames: [18] });
    this.behaviors.push(createClickBehavior(this));
    this.onClick = props.onClick;
  }
}
