import { BasicContainer } from "./BasicContainer";
import { useMapEditor } from "../hooks/useMapEditor";
import { useTiles } from "../hooks/useTiles";
import { FunctionComponent } from "preact";
import { twMerge } from "tailwind-merge";

export const TileSelector: FunctionComponent = () => {
  const { editor } = useMapEditor();
  const { tiles, selected } = useTiles();
  return (
    <BasicContainer className="grow flex-wrap w-fit">
      {tiles &&
        tiles.map((tile, i) => (
          <img
            key={i}
            role="button"
            tabIndex={0}
            className={twMerge(
              "border border-transparent cursor-pointer rounded p-[1px]",
              "pointer-events-auto hover:bg-contrast/50 bg-transparent",
              selected === i
                ? "border-contrast"
                : "border-transparent transition-all"
            )}
            onClick={() => {
              editor.tileType = i;
            }}
            src={tile}
            height={editor.tilesize * 2 + 4}
            width={editor.tilesize * 2 + 4}
          />
        ))}
    </BasicContainer>
  );
};
