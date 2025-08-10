import { EditorCanvas } from "./components/EditorCanvas";
import { EditorInfo } from "./components/EditorInfo";
import { GridToggle } from "./components/GridToggle";
import { ImportExport } from "./components/ImportExport";
import { InfoToggle } from "./components/InfoToggle";
import { LevelSelector } from "./components/LevelSelector";
import { RatioSlider } from "./components/RatioSlider";
import { SelectionMetrics } from "./components/SelectionMetrics";
import { SpawnPointButton } from "./components/SpawnPointButton";
import { TestLevel } from "./components/TestLevel";
import { TileSelector } from "./components/TileSelector";
import { FunctionComponent } from "preact";
import { BasicContainer } from "./components/BasicContainer";
import styles from "./index.tailwind.css?inline";

export const App: FunctionComponent = () => {
  return (
    <>
      <style type="text/css">{styles}</style>
      <div
        className="font-monospace flex flex-col absolute inset-0 p-2 gap-2 text-contrast whitespace-nowrap z-10"
        style={{ imageRendering: "pixelated" }}
      >
        <div class="flex justify-between items-center">
          <div className="flex gap-2">
            <LevelSelector />
            <GridToggle />
            <InfoToggle />
          </div>
          <div className="flex gap-2">
            <TestLevel />
            <ImportExport />
          </div>
        </div>

        <BasicContainer className="grow overflow-hidden relative">
          <EditorCanvas />
          <SelectionMetrics />
          <div className="pointer-events-none absolute top-0 left-0 flex flex-col p-1">
            <RatioSlider />
            <EditorInfo />
          </div>
        </BasicContainer>
        <div className="flex justify-between gap-2">
          <TileSelector />
          <div className="flex flex-1 justify-end">
            <SpawnPointButton />
          </div>
        </div>
      </div>
    </>
  );
};
