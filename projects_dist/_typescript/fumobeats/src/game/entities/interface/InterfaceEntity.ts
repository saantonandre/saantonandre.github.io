import { Entity } from "modules/Entity";
import { ComputeProps } from "modules/Entity/Entity";
import { GameText } from "modules/Entity/GameText";

export class InterfaceEntity extends Entity {
  text: GameText | undefined;
  hovered = false;
  absolute = true;
  solid = false;
  sounds = true;
  onClick?: (entity: InterfaceEntity, props: ComputeProps) => void;
  onMouseEnter?: (entity: InterfaceEntity, props: ComputeProps) => void;
  onMouseOut?: (entity: InterfaceEntity, props: ComputeProps) => void;
}
