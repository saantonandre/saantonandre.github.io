import { type Sprite } from "./Sprite";
import { type ViewInterface, type Point } from "./Interfaces";

const renderSprite = (type: "rect" | "image" = "image") => {
  return function (
    this: Sprite,
    view: ViewInterface,
    pivot?: Point,
    ratio?: number
  ) {
    const animation = this.animations[this.animation] || this.defaultAnimation;
    const rotation = this.rot + animation.rot;
    if (!this.display) return;
    if (type === "rect") {
      view.context.fillStyle = this.fillColor;
    }
    const rotatedRendering = rotation || pivot;

    if (!rotatedRendering) {
      /** Default Rendering */
      if (type === "image")
        return view.context.drawImage(
          ...this.getFrame(view),
          ...view.parseRect(this, {
            offset: animation.offset,
            absolute: this.absolute,
            ratio,
          })
        );
      return view.context.fillRect(
        ...view.parseRect(this, {
          offset: animation.offset,
          absolute: this.absolute,
          ratio,
        })
      );
    }
    const positivePivot = {
      x: pivot?.x ?? this.w / 2,
      y: pivot?.y ?? this.h / 2,
    };
    const negativePivot = {
      x: -positivePivot.x,
      y: -positivePivot.y,
    };
    /** Rotated Rendering */
    view.context.save();
    view.context.translate(
      ...view.parsePoint(
        {
          x: positivePivot.x + this.x,
          y: positivePivot.y + this.y,
        },
        {
          offset: animation.offset,
          absolute: this.absolute,
          ratio,
        }
      )
    );
    view.context.rotate(rotation);
    if (type === "image")
      view.context.drawImage(
        ...this.getFrame(view),
        ...view.parseRect(
          {
            w: this.w,
            h: this.h,
            ...negativePivot,
          },
          {
            absolute: true,
            ratio,
          }
        )
      );
    else
      view.context.fillRect(
        ...view.parseRect(
          {
            w: this.w,
            h: this.h,
            ...negativePivot,
          },
          { absolute: true, ratio }
        )
      );
    view.context.restore();
  };
};

export const renderSpriteImage = renderSprite("image");
export const renderSpriteRect = renderSprite("rect");
