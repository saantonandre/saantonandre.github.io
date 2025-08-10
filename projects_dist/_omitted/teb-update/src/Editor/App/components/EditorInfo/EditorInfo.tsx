import { RenderedTiles } from "../EditorInfo/RenderedTiles";
import { RenderTime } from "../EditorInfo/RenderTime";
import { TotalTiles } from "../EditorInfo/TotalTiles";
import { useMapEditor } from "../../hooks/useMapEditor";
import { useMessage } from "../../hooks/useMessage";
import { FunctionComponent } from "preact";
import { useState } from "preact/hooks";

export const EditorInfo: FunctionComponent = () => {
  const { editor } = useMapEditor();
  const [showInfo, setShowInfo] = useState(editor.showInfo);
  useMessage("info-toggled", () => setShowInfo(editor.showInfo));
  if (!showInfo) return null;
  return (
    <>
      <RenderTime />
      <RenderedTiles />
      <TotalTiles />
    </>
  );
};
