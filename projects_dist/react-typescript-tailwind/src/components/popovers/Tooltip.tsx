import { useEffect, useState } from "react";
import {
  useFloating,
  autoUpdate,
  offset,
  flip,
  shift,
  useHover,
  useFocus,
  useDismiss,
  useRole,
  useInteractions,
  Placement,
} from "@floating-ui/react";
import { createPortal } from "react-dom";
import { twMerge } from "tailwind-merge";
const modalRoot = document.getElementById("modal-root");
type Props = {
  anchorEl?: Element;
  tip?: React.ReactNode;
  content?: React.ReactNode;
  controlled?: boolean;
  placement?: Placement;
  active?: boolean;
  disabled?: boolean;
  tooltipWrapperClass?: string;
  /** Offsets [x,y] */
  offsets?: [number, number];
} & React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLDivElement>,
  HTMLDivElement
>;

export const Tooltip: React.FC<Props> = ({
  tip = "tooltip",
  content,
  children,
  anchorEl,
  controlled,
  placement = "bottom",
  active,
  offsets = [0, 0],
  disabled,
  tooltipWrapperClass,
  ...attributes
}) => {
  const [open, setOpen] = useState(false);
  const { x, y, strategy, refs, context } = useFloating({
    open,
    onOpenChange: setOpen,
    placement: placement,
    middleware: [
      offset({ crossAxis: offsets[0], mainAxis: offsets[1] }),
      flip(),
      shift(),
    ],
    whileElementsMounted: autoUpdate,
  });
  const hover = useHover(context, { move: false });
  const focus = useFocus(context);
  const dismiss = useDismiss(context);
  const role = useRole(context, { role: "tooltip" });

  const isOpen = (controlled ? active : open) && !disabled;
  // Merge all the interactions into prop getters
  const { getReferenceProps, getFloatingProps } = useInteractions([
    hover,
    focus,
    dismiss,
    role,
  ]);
  useEffect(() => {
    if (anchorEl) anchorEl && refs.setReference(anchorEl);
  }, [anchorEl, refs]);
  return (
    <>
      {!anchorEl && (
        <div ref={refs.setReference} {...getReferenceProps()} {...attributes}>
          <>{children}</>
        </div>
      )}
      {isOpen &&
        createPortal(
          <div
            ref={refs.setFloating}
            style={{
              position: strategy,
              top: y ?? 0,
              left: x ?? 0,
              width: "max-content",
            }}
            className={twMerge(
              "tooltip z-50",
              tooltipWrapperClass,
              !(x || y) && "invisible"
            )}
            {...getFloatingProps()}
          >
            {content ? (
              <>{content}</>
            ) : (
              <div
                className={twMerge(
                  "m-2 rounded-lg border py-1 px-2 font-medium shadow shadow-primary/50",
                  "border-primary bg-neutral text-contrast"
                )}
              >
                <div className="text-sm font-medium whitespace-nowrap">
                  {tip}
                </div>
              </div>
            )}
          </div>,
          modalRoot!
        )}
    </>
  );
};
export default Tooltip;
