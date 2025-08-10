import { useMapEditor } from "./useMapEditor";
import { useMessage } from "./useMessage";
import { type MapEditor } from "../../MapEditor";
import { useEffect, useState } from "preact/hooks";

const cachedTiles: string[] = [];
const createTileImages = async (editor: MapEditor) => {
  const size = editor.tilesize;
  const canvas = new OffscreenCanvas(size, size);
  const context = canvas.getContext("2d")!;
  const tiles = editor.tileMap.map(async ([x, y]) => {
    context.clearRect(0, 0, size, size);
    context.drawImage(
      editor.sheet,
      x * size,
      y * size,
      size,
      size,
      0,
      0,
      size,
      size
    );
    const blob = await canvas.convertToBlob();
    return URL.createObjectURL(blob);
  });
  return await Promise.all(tiles);
};

/** Returns the tiles images and the currently selected tile index */
export const useTiles = () => {
  const { editor } = useMapEditor();
  const [tiles, setTiles] = useState<string[]>(cachedTiles);
  const [selected, setSelected] = useState(editor.tileType);
  useMessage("tile-selected", () => setSelected(editor.tileType));
  useEffect(() => {
    if (tiles.length) return;
    createTileImages(editor).then(setTiles);
  }, []);
  return { tiles, selected };
};
