import { type View } from "@modules/View";
import { Point, Line, Rect, Circle } from "@modules/lib/shapes";

export type DrawCallback = (view: View) => void;
export type DrawCustom = {
  type: "custom";
  callback: DrawCallback;
  absolute: boolean;
};
export type DrawPoint = {
  type: "point";
  shape: Point;
  absolute: boolean;
};
export type DrawCircle = {
  type: "circle";
  shape: Circle;
  absolute: boolean;
};
export type DrawLine = {
  type: "line";
  shape: Line;
  absolute: boolean;
};
export type DrawRect = {
  type: "rect";
  shape: Rect;
  absolute: boolean;
};
export type DrawText = {
  type: "text";
  text: string;
  shape: Point;
  absolute: boolean;
};
export type DrawShape = DrawPoint | DrawLine | DrawRect | DrawCustom | DrawText | DrawCircle;
