import {
  EditorButton,
  EditorButtonProps,
} from "./EditorButton";
import { Popover } from "../components/Popover";
import { useMapEditor } from "../hooks/useMapEditor";
import { useMessage } from "../hooks/useMessage";
import { FunctionComponent } from "preact";
import { useState } from "preact/hooks";
import { twMerge } from "tailwind-merge";

export const LevelSelector: FunctionComponent = () => {
  const { editor } = useMapEditor();
  const [levels, setLevels] = useState(editor.levels);
  const [currentLevel, setCurrentLevel] = useState(editor.currentLevel);
  useMessage("level-added", () => {
    setLevels([...editor.levels]);
  });
  useMessage("level-removed", () => {
    setLevels([...editor.levels]);
  });
  useMessage("level-changed", () => {
    setCurrentLevel(editor.currentLevel);
  });
  return (
    <Popover
      trigger={<EditorButton>&#9776;Level {editor.currentLevel}</EditorButton>}
    >
      <EditorButton
        className="rounded-none border-0"
        onClick={() => {
          editor.addLevel();
        }}
      >
        Add level &#10133;
      </EditorButton>
      {levels.map((level, i) => {
        const isCurrentLevel = i === currentLevel;
        return (
          <OptionButton
            key={i}
            className={isCurrentLevel ? "bg-background" : ""}
            onClick={() => {
              editor.currentLevel = i;
            }}
            onContextMenu={(e) => {
              e.preventDefault();
              editor.removeLevel(i);
            }}
          >
            {i} - Level {i}
          </OptionButton>
        );
      })}
    </Popover>
  );
};
export const OptionButton: FunctionComponent<EditorButtonProps> = ({
  children,
  className,
  ...attributes
}) => {
  return (
    <EditorButton
      className={twMerge("border-0 rounded-none", className?.toString())}
      {...attributes}
    >
      {children}
    </EditorButton>
  );
};
