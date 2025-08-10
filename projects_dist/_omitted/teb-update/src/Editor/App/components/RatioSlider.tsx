import { EditorButton } from "./EditorButton";
import { useMapEditor } from "../hooks/useMapEditor";
import { useMessage } from "../hooks/useMessage";
import { FunctionComponent } from "preact";
import { useState } from "preact/hooks";

export const RatioSlider: FunctionComponent = () => {
  const { editor } = useMapEditor();
  const [ratio, setRatio] = useState(editor.ratio);
  useMessage("ratio-change", () => setRatio(editor.ratio));
  return (
    <div className="flex text-contrast items-center gap-1 pointer-events-auto">
      <EditorButton
        onClick={() => {
          const { x, y } = editor.center;
          editor.ratio = 1;
          editor.setCenter({ x, y });
        }}
        style={{ aspectRatio: "1/1" }}
      >
        &#8634;
      </EditorButton>
      <input
        type="range"
        min={editor.MIN_RATIO.toString()}
        max={editor.MAX_RATIO.toString()}
        value={ratio}
        step="any"
        onInput={(e) => {
          editor.ratio = Number(e.currentTarget.value);
        }}
      />
      x{ratio.toFixed(3)}
    </div>
  );
};
