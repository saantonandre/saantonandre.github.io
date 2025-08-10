import { containerClasses } from "./BasicContainer";
import { EditorButton } from "./EditorButton";
import { ComponentChildren, FunctionComponent } from "preact";
import { twMerge } from "tailwind-merge";
import { createPortal } from "preact/compat";
export type ModalProps = {
  open: boolean;
  setOpen: (value: boolean) => void;
  title?: ComponentChildren;
};
export const BasicModal: FunctionComponent<ModalProps> = ({
  open,
  setOpen,
  children,
  title,
}) => {
  const container = document.getElementById("modals")!;
  return createPortal(
    <dialog open={open} className="z-50 mt-12 bg-transparent">
      <div className={twMerge(containerClasses, "items-center flex-col")}>
        <div className="flex w-full justify-between text-contrast min-w-[400px]">
          {title}
          <EditorButton
            className="text-xs bg-danger"
            onClick={() => setOpen(false)}
          >
            &#128473;
          </EditorButton>
        </div>
        <hr className="border-contrast-low h-[1px] w-full" />
        <div className="flex flex-col gap-2 p-2">{children}</div>
      </div>
    </dialog>,
    container
  );
};
