import { ToggleButton } from "./ToggleButton";
import { useMapEditor } from "../hooks/useMapEditor";
import { useMessage } from "../hooks/useMessage";
import { FunctionComponent } from "preact";
import { useState } from "preact/hooks";

export const GridToggle: FunctionComponent = () => {
  const { editor } = useMapEditor();
  const [isGridOn, setIsGridOn] = useState(editor.showGrid);
  useMessage("grid-toggled", () => setIsGridOn(editor.showGrid));
  return (
    <ToggleButton
      active={isGridOn}
      onClick={() => {
        editor.showGrid = !editor.showGrid;
      }}
    >
      Display grid
    </ToggleButton>
  );
};
