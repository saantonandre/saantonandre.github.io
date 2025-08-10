import { FunctionComponent } from "preact";
import { HTMLAttributes } from "preact/compat";
import { twMerge } from "tailwind-merge";

export const containerClasses =
  "flex items-center border-2 border-contrast-low outline outline-background gap-1 p-1 text-contrast rounded-lg bg-background";
type Props = HTMLAttributes<HTMLDivElement>;
export const BasicContainer: FunctionComponent<Props> = ({
  children,
  className,
  ...attributes
}) => {
  return (
    <div
      {...attributes}
      className={twMerge(containerClasses, className?.toString())}
    >
      {children}
    </div>
  );
};
