import { BasicContainer } from "./BasicContainer";
import { FunctionComponent } from "preact";
import { HTMLAttributes } from "preact/compat";
import { twMerge } from "tailwind-merge";

type Props = {
  active: boolean;
} & HTMLAttributes<HTMLDivElement>;

export const ToggleButton: FunctionComponent<Props> = ({
  children,
  active,
  className,
  ...attributes
}) => {
  return (
    <div
      role="button"
      tabIndex={0}
      className={twMerge(
        "flex gap-1 items-center cursor-pointer select-none",
        className?.toString()
      )}
      {...attributes}
    >
      <BasicContainer
        className={twMerge(
          "aspect-square h-6 flex items-center justify-center",
          className?.toString()
        )}
      >
        {active && <>&#10004;</>}
      </BasicContainer>
      <span className="underline">{children}</span>
    </div>
  );
};
