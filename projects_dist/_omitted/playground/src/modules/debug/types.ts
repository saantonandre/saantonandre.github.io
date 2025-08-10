import { View } from "modules/View";
import { Point, Line, Rect } from "modules/types/shapes";

export type DrawCallback = (view: View) => void;
export type DrawCustom = {
  type: "custom";
  callback: DrawCallback;
};
export type DrawPoint = {
  type: "point";
  shape: Point;
};
export type DrawLine = {
  type: "line";
  shape: Line;
};
export type DrawRect = {
  type: "rect";
  shape: Rect;
};
export type DrawShape = DrawPoint | DrawLine | DrawRect | DrawCustom;