import { InterfaceEntity } from "game/entities/interface/InterfaceEntity";
import { createClickBehavior } from "game/entities/interface/createClickBehavior";
import { firstCoffee } from "game/ModesManager/ModesManager";
import { gameDebug } from "modules/Debug";
import { Behavior, ComputeProps } from "modules/Entity/Entity";
import { GameText } from "modules/Entity/GameText";
import { View } from "modules/View";
import { Rect } from "modules/types/shapes";

type Props = {
  x: number;
  y: number;
  fontSize: number;
  content: string;
  align: CanvasTextAlign;
  onClick: InterfaceEntity["onClick"];
  hitboxType: "this" | "text";
  shadow: boolean;
  color?: string;
  opacity?: number;
  disabled?:boolean
};
export class UIButton extends InterfaceEntity {
  type = "ui-button";
  content: string;
  text = new GameText(0, 0);
  disabled=false
  declare behaviors: Behavior<UIButton>[];
  constructor({
    x = 0,
    y = 0,
    content = "Button",
    fontSize = 10,
    onClick,
    align = "center",
    shadow = true,
    color = "#FFFFFF",
    disabled = false,
    opacity = 1,
  }: Partial<Props>) {
    super();
    this.content = content;
    this.x = x;
    this.y = y;
    this.text.x = this.x;
    this.text.y = this.y;
    this.text.align = align;
    this.text.fontSize = fontSize;
    this.text.content = content;
    this.text.color = color;
    this.text.opacity = opacity;
    this.text.fontSize = fontSize;
    this.text.font = firstCoffee.family;
    this.text.shadow = shadow;
    this.text.absolute = true;
    this.disabled = Boolean(disabled);
    this.onClick = onClick;
    if (onClick) {
      this.behaviors.push(createClickBehavior());
    }
  }
  computeButton(props: ComputeProps) {
    this.text.x = this.x;
    this.text.y = this.y;
    this.adjustToTextHitbox(props.view, this.text);
    this.computeBehaviors(props);
    for (const component of this.components) {
      component.compute(props);
    }
    this.text.shadowColor = this.hovered ? "#ab606a" : "#ff818f";
  }
  renderButton(view: View) {
    if(this.disabled)view.context.globalAlpha=0.5
    this.defaultRender(view);
    this.text.render(view);
    if(this.disabled)view.context.globalAlpha=1
  }
  compute(props: ComputeProps) {
    if(!this.disabled) this.computeButton(props);
  }
  render(view: View) {
    this.renderButton(view);
  }
  adjustToTextHitbox(view: View, text: GameText) {
    this.hitboxOffset = Rect.sub(text.getHitbox(view), this);
    gameDebug.drawRect(this.hitbox, "red", true);
  }
}
