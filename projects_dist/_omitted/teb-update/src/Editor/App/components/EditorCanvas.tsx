import { useMapEditor } from "../hooks/useMapEditor";
import { FunctionComponent } from "preact";
import { HTMLAttributes } from "preact/compat";
import { useEffect, useRef } from "preact/hooks";

export const EditorCanvas: FunctionComponent<
  HTMLAttributes<HTMLCanvasElement>
> = ({ ...attributes }) => {
  const { editor } = useMapEditor();
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    editor.canvas = canvas;
  }, [ref.current]);
  return (
    <canvas
      {...attributes}
      ref={ref}
      onContextMenu={(e) => e.preventDefault()}
    ></canvas>
  );
};
