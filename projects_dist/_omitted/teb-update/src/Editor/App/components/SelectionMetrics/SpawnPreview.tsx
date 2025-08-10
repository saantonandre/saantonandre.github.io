
import { RectMetrics } from "@Editor/App/components/SelectionMetrics/RectMetrics";
import { useMapEditor } from "@Editor/App/hooks/useMapEditor";
import { TypedRect } from "@Editor/MapEditor/rectUtils";
import { FunctionComponent } from "preact";
import { useState, useEffect } from "preact/hooks";

export const SpawnPreview: FunctionComponent = () => {
    const { editor } = useMapEditor();
    const [areaSelection, setAreaSelection] = useState<TypedRect>();
    useEffect(() => {
      const handler = () => {
        const pos = editor.controls.currPos;
        setAreaSelection({
          x: Math.floor(pos.x),
          y: Math.floor(pos.y),
          w: 1,
          h: 1,
          type: 0,
        });
      };
      addEventListener("mousemove", handler);
      return () => removeEventListener("mousemove", handler);
    }, []);
    if (!areaSelection) return <></>;
    return (
      <RectMetrics
        metrics={false}
        rect={areaSelection}
        editor={editor}
        fill="#00f6"
      />
    );
  };