import { useMapEditor } from "../../hooks/useMapEditor";
import { useMessage } from "../../hooks/useMessage";
import { FunctionComponent } from "preact";
import { useState } from "preact/hooks";

export const RenderTime: FunctionComponent = () => {
  const { editor } = useMapEditor();
  const [renderTime, setRenderTime] = useState(0);
  useMessage("render", () => {
    setRenderTime(editor.timeToDraw);
  });
  return <div>Time to render (ms): {renderTime}</div>;
};
