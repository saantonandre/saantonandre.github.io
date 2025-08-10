import { useMapEditor } from "../../hooks/useMapEditor";
import { useMessage } from "../../hooks/useMessage";
import { FunctionComponent } from "preact";
import { useState } from "preact/hooks";

export const RenderedTiles: FunctionComponent = () => {
  const { editor } = useMapEditor();
  const [renderedTiles, setRenderedTiles] = useState(0);
  useMessage("render", () => {
    setRenderedTiles(editor.tilesRendered);
  });
  return <div>Rendered tiles: {renderedTiles}</div>;
};
