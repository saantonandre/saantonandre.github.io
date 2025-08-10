import { useMessage } from "../../hooks/useMessage";
import { type MapEditor } from "@Editor/MapEditor";
import { TypedRect } from "@Editor/MapEditor/rectUtils";
import { Point, Rect } from "@modules/lib/shapes";
import { FunctionComponent } from "preact";
import { useState } from "preact/hooks";

type RectMetricsProps = {
  rect: Rect | TypedRect;
  editor: MapEditor;
  metrics?: boolean;
  fill?: string;
  image?: string;
  stroke?: string;
};
export const RectMetrics: FunctionComponent<RectMetricsProps> = ({
  rect,
  editor,
  fill = "#00f3",
  stroke = "#fff8",
  metrics = true,
  image,
}) => {
  const [offsets, setOffsets] = useState<Point>({ x: editor.x, y: editor.y });
  const [ratio, setRatio] = useState<number>(editor.ratio);
  useMessage(["ratio-change","camera-move"], () => {
    setOffsets({ x: editor.x, y: editor.y });
    setRatio(editor.ratio);
  });
  const canvasLeft = editor.canvas.offsetLeft;
  const canvasTop = editor.canvas.offsetTop;
  return (
    <div
      style={{
        position: "absolute",
        left: (rect.x - offsets.x) * ratio * editor.tilesize + canvasLeft,
        top: (rect.y - offsets.y) * ratio * editor.tilesize + canvasTop,
        width: rect.w * ratio * editor.tilesize,
        height: rect.h * ratio * editor.tilesize,
        backgroundColor: fill,
        outline: `${stroke ? "1" : "0"}px solid ${stroke}`,
      }}
    >
      {image && <img className="absolute inset-0 opacity-50 w-full h-full" src={image} />}
      {metrics && (
        <>
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              transform: "translateY(-100%)",
            }}
          >
            {rect.x},{rect.y}
          </div>
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "100%",
              transform: "translateY(-50%)",
            }}
          >
            {rect.h}
          </div>
          <div
            style={{
              position: "absolute",
              top: "100%",
              left: "50%",
              transform: "translateX(-50%)",
            }}
          >
            {rect.w}
          </div>
        </>
      )}
    </div>
  );
};
