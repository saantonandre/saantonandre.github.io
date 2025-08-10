import { ToggleButton } from "./ToggleButton";
import { useMapEditor } from "../hooks/useMapEditor";
import { useMessage } from "../hooks/useMessage";
import { FunctionComponent } from "preact";
import { useState } from "preact/hooks";

export const InfoToggle: FunctionComponent = () => {
  const { editor } = useMapEditor();
  const [isInfoOn, setIsInfoOn] = useState(editor.showInfo);
  useMessage("info-toggled", () => setIsInfoOn(editor.showInfo));
  return (
    <ToggleButton
      active={isInfoOn}
      onClick={() => {
        editor.showInfo = !editor.showInfo;
      }}
    >
      Show info
    </ToggleButton>
  );
};
