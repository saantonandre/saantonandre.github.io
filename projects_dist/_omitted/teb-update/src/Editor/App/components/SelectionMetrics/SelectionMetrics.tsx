
import { RectMetrics } from "@Editor/App/components/SelectionMetrics/RectMetrics";
import { SpawnPreview } from "@Editor/App/components/SelectionMetrics/SpawnPreview";
import { TilePreview } from "@Editor/App/components/SelectionMetrics/TilePreview";
import { useMapEditor } from "@Editor/App/hooks/useMapEditor";
import { useMessage } from "@Editor/App/hooks/useMessage";
import { TypedRect } from "@Editor/MapEditor/rectUtils";
import { FunctionComponent } from "preact";
import { useState } from "preact/hooks";

export const SelectionMetrics: FunctionComponent = () => {
  const { editor } = useMapEditor();
  const [hoveredRect, setHoveredRect] = useState(editor.hoveredRect);
  const [areaSelection, setAreaSelection] = useState<TypedRect>();
  /** Defines wether the spawnpoint is currently getting setted */
  const [isSpawn, setIsSpawn] = useState(false);
  useMessage("spawnpoint-selection-start", () => setIsSpawn(true));
  useMessage("spawnpoint-selection-end", () => setIsSpawn(false));
  useMessage("hover-rect", () => {
    setHoveredRect(editor.hoveredRect);
  });
  useMessage("area-selection", () => {
    const session = editor.controls.session;
    if (!session) return setAreaSelection(undefined);
    const rect = {
      ...session.toRect(),
      type: editor.tileType,
    };
    setAreaSelection(rect);
  });
  const isDeleting = editor.controls.session?.type === "right";
  return (
    <div
      style={{
        position: "absolute",
        overflow: "hidden",
        pointerEvents: "none",
        fontFamily: "'Trebuchet MS', sans-serif",
        color: "#fff",
        inset: 0,
      }}
    >
      {hoveredRect && (
        <RectMetrics rect={hoveredRect} editor={editor} fill="#0f01" />
      )}
      {areaSelection && (
        <RectMetrics
          rect={areaSelection}
          editor={editor}
          fill={isDeleting ? "#f001" : "#00f1"}
          stroke={isDeleting ? "red" : "cyan"}
        />
      )}
      {isSpawn && <SpawnPreview />}
      {!isSpawn && !areaSelection && <TilePreview />}
    </div>
  );
};
