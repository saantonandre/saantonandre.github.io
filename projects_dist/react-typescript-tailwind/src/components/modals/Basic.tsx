import { XMarkIcon } from "@heroicons/react/24/outline";
import TransparentButton from "components/buttons/Transparent";
import { twMerge } from "tailwind-merge";
import { createPortal } from "react-dom";
import BasicContainer from "components/containers/Basic";
type Props = {
  open: boolean;
  /** If true, the modal can be closed by clicking on the overlay */
  closableOnOverlayClick?: boolean;
  bodyClassName?: string;
  outmostClassName?: string;
  title?: string;
  loading?: boolean;
  close: () => void;
} & React.HTMLAttributes<HTMLDivElement>;

const modalRoot = document.getElementById("modal-root");

/** This is a basic modal component that can be used to create a modal with a title and a close button */
export const BasicModal: React.FC<Props> = ({
  title,
  open,
  children,
  className,
  bodyClassName,
  outmostClassName,
  loading,
  closableOnOverlayClick,
  close,
  ...attributes
}) => {
  if (!modalRoot) return <></>;
  return createPortal(
    <div
      onClick={() => closableOnOverlayClick && close()}
      className={twMerge(
        "no-scrollbar transparent absolute top-0 left-0 z-50 overflow-x-hidden overflow-y-scroll py-12 px-3",
        "max-h-full min-h-full w-full animate-fade-in bg-neutral bg-opacity-50",
        outmostClassName,
        !open && "hidden"
      )}
    >
      <BasicContainer
        noStyles
        loading={loading}
        onClick={(e) => e.stopPropagation()}
        className={twMerge(
          " z-40 m-auto flex  max-h-full h-fit w-[600px] max-w-full animate-down-up-strong",
          "flex-col overflow-hidden rounded-xl border border-neutral2 bg-neutral p-0 text-contrast2 shadow-primary/50 shadow-[0_0_35px]",
          className
        )}
        {...attributes}
      >
        {/** Represents the header with the title and shows the close button */}
        {title && (
          <div className="z-50 flex items-center justify-between p-2 border-b border-neutral2">
            <div className="px-4 ">{title}</div>
            <TransparentButton
              className="rounded-3xl hover:bg-neutral2 text-contrast"
              onClick={() => close()}
            >
              <XMarkIcon
                strokeWidth={2}
                className={twMerge(
                  "w-6 rounded-full",
                  "transition-all hover:scale-110 "
                )}
              />
            </TransparentButton>
          </div>
        )}
        <div className={twMerge("p-4", bodyClassName)}>{children}</div>
      </BasicContainer>
    </div>,
    modalRoot
  );
};
export default BasicModal;
