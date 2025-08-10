import { BasicContainer } from "./BasicContainer";
import { ComponentChildren, FunctionComponent } from "preact";
import { twMerge } from "tailwind-merge";

type Props = {
  trigger: ComponentChildren;
};
export const Popover: FunctionComponent<Props> = ({ children, trigger }) => {
  return (
    <div className="relative flex flex-col items-center group">
      {trigger}
      <BasicContainer
        className={twMerge(
          "absolute bottom-0 left-0 flex-col translate-y-full z-10 items-stretch",
          "group-hover:flex group-focus:flex group-active:flex hidden gap-1"
        )}
      >
        {children}
      </BasicContainer>
    </div>
  );
};
