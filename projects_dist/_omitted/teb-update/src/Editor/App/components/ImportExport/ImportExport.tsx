import { EditorButton } from "../EditorButton";
import { ExportJSON } from "../ImportExport/ExportJSON";
import { Popover } from "../Popover";
import { FunctionComponent } from "preact";

export const ImportExport: FunctionComponent = () => {
  return (
    <>
      <Popover trigger={<EditorButton>&#9776;Import/Export</EditorButton>}>
        <ExportJSON />
      </Popover>
    </>
  );
};

