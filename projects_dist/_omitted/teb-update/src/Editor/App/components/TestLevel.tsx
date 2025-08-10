import { EditorButton } from "./EditorButton";
import { useMapEditor } from "../hooks/useMapEditor";
import { editorEvents } from "../../MapEditor/events";
import { FunctionComponent } from "preact";

export const TestLevel: FunctionComponent = () => {
  const { editor } = useMapEditor();

  return (
    <EditorButton
      onClick={() => {
        editorEvents.pub(
          "test-request",
          editor.levels[editor.currentLevel].export()
        );
      }}
    >
      Test level
    </EditorButton>
  );
};
