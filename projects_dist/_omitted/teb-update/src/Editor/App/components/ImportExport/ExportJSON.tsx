import { BasicModal } from "../BasicModal";
import { EditorButton } from "../EditorButton";
import { OptionButton } from "../LevelSelector";
import { useMapEditor } from "../../hooks/useMapEditor";
import { FunctionComponent } from "preact";
import { useState } from "preact/hooks";
import { downloadBlob } from "@modules/utils/downloadBlob";

export const ExportJSON: FunctionComponent = () => {
  const [json, setJson] = useState<string>();
  const [open, setOpen] = useState(false);
  const { editor } = useMapEditor();
  return (
    <>
      <OptionButton
        onClick={() => {
          setOpen(true);
          setJson(editor.levels[editor.currentLevel].toJSON());
        }}
      >
        Export JSON
      </OptionButton>
      <BasicModal {...{ open, setOpen }} title="Export JSON">
        <details className="w-[400px]">
          <summary role="button" className="select-none">
            View JSON
          </summary>
          <pre className="break-words bg-primary text-wrap">{json}</pre>
        </details>
        <div className="w-full flex justify-end gap-2">
          <EditorButton
            className="w-fit"
            onClick={() => {
              downloadBlob(
                [
                  "map-" + new Date().toISOString().slice(0, 10),
                  new Blob([json!]),
                ],
                "application/json"
              );
              setOpen(false);
            }}
          >
            Download JSON file
          </EditorButton>
          <EditorButton
            className="w-fit"
            onClick={() => {
              setOpen(false);
              navigator.clipboard.writeText(json!)
            }}
          >
            Copy to clipboard
          </EditorButton>
        </div>
      </BasicModal>
    </>
  );
};
