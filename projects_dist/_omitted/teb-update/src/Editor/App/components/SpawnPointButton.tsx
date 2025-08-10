import { EditorButton } from "./EditorButton";
import { useMapEditor } from "../hooks/useMapEditor";
import { useMessage } from "../hooks/useMessage";
import { FunctionComponent } from "preact";
import { useState } from "preact/hooks";
import { twMerge } from "tailwind-merge";

export const SpawnPointButton: FunctionComponent = () => {
  const [isActive, setIsActive] = useState(false);
  const { editor } = useMapEditor();
  useMessage("spawnpoint-selection-start", () => setIsActive(true));
  useMessage("spawnpoint-selection-end", () => setIsActive(false));
  return (
    <div className="flex items-center">
      <EditorButton
        className={twMerge("h-fit", isActive ? "bg-blue-400" : "")}
        onClick={(e) => {
          console.log(e.button)
          editor.setSpawnPoint = !editor.setSpawnPoint;
        }}
      >
        Set spawnpoint
      </EditorButton>
    </div>
  );
};
