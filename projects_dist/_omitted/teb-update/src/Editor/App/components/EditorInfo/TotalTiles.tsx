import { useMapEditor } from "../../hooks/useMapEditor";
import { useMessage } from "../../hooks/useMessage";
import { FunctionComponent } from "preact";
import { useState } from "preact/hooks";

export const TotalTiles: FunctionComponent = () => {
  const { editor } = useMapEditor();
  const rects = editor.levels[editor.currentLevel].map;
  const tiles = rects.reduce((acc, curr) => {
    return acc + curr.w * curr.h;
  }, 0);
  const [totalRects, setTotalRects] = useState(rects.length);
  const [totalTiles, setTotalTiles] = useState(tiles);
  useMessage(["level-modified","level-changed"], () => {
    const rects = editor.levels[editor.currentLevel].map;
    const tiles = rects.reduce((acc, curr) => {
      return acc + curr.w * curr.h;
    }, 0);
    setTotalRects(rects.length);
    setTotalTiles(tiles);
  });
  return (
    <>
      <div>Level tiles: {totalTiles}</div>
      <div>Level rects: {totalRects}</div>
    </>
  );
};
