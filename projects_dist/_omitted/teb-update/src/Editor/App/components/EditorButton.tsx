import { containerClasses } from "./BasicContainer";
import { FunctionComponent } from "preact";
import { CSSProperties, HTMLAttributes } from "preact/compat";
import { twMerge } from "tailwind-merge";

export type EditorButtonProps = {
  style?: CSSProperties;
} & HTMLAttributes<HTMLButtonElement>;

export const EditorButton: FunctionComponent<EditorButtonProps> = ({
  className,
  children,
  ...attributes
}) => {
  return (
    <button
      className={twMerge(
        containerClasses,
        "bg-secondary hover:bg-accent disabled:bg-background",
        className?.toString()
      )}
      {...attributes}
    >
      {children}
    </button>
  );
};
