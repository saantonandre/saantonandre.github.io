import { Placement } from "@floating-ui/react";
import { ChevronDownIcon } from "@heroicons/react/24/outline";
import BasicButton from "components/buttons/Basic";
import TransparentButton from "components/buttons/Transparent";
import Tooltip from "components/popovers/Tooltip";
import { useState } from "react";
import { twMerge } from "tailwind-merge";
type ActionButton = [JSX.Element | React.ReactNode, () => void, string?];
type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  options: ActionButton[];
  buttonContent: React.ReactNode | JSX.Element | null;
  className?: string;
  optionsClassName?: string;
  noChevron?: boolean;
  offsets?: [number, number];
  placement?: Placement;
  containerClassName?: string;
  noButtonStyle?: boolean;
};
export const Dropdown = ({
  options,
  buttonContent,
  className,
  containerClassName,
  optionsClassName,
  noButtonStyle,
  disabled,
  noChevron,
  placement,
  offsets,
  ...btnAttributes
}: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <Tooltip
      controlled
      active={isOpen}
      disabled={disabled}
      placement={placement || "bottom-start"}
      offsets={offsets}
      content={
        <div
          role="menu"
          className={twMerge(
            "absolute bottom-0 z-10 min-w-full translate-y-full flex-col bg-neutral",
            containerClassName
          )}
        >
          {options.map(([optContent, optOnClick, optClassName], i) => {
            return (
              <BasicButton
                role="menuitem"
                className={twMerge(
                  "rounded-none  last:rounded-b-lg hover: bg-neutral2 w-full",
                  "border bg-contrast text-contrast2",
                  optionsClassName,
                  optClassName
                )}
                key={i}
                onMouseDown={() => optOnClick()}
                onClick={(e) => e.stopPropagation()}
              >
                {optContent}
              </BasicButton>
            );
          })}
        </div>
      }
    >
      {noButtonStyle ? (
        <button
          aria-haspopup="menu"
          className={twMerge(isOpen && "rounded-b-none", className)}
          onClick={(e) => {
            e.stopPropagation();
            setIsOpen(!isOpen);
          }}
          onBlur={() => {
            setIsOpen(false);
          }}
          disabled={disabled}
          {...btnAttributes}
        >
          {buttonContent}
          {!noChevron && (
            <ChevronDownIcon
              className={twMerge(
                "ml-1 h-4 rotate-0 transition-transform",
                isOpen && "rotate-180"
              )}
            />
          )}
        </button>
      ) : (
        <TransparentButton
          role="button"
          aria-haspopup="menu"
          className={twMerge(isOpen && "rounded-b-none", className)}
          onClick={(e) => {
            e.stopPropagation();
            setIsOpen(!isOpen);
          }}
          onBlur={() => {
            setIsOpen(false);
          }}
          disabled={disabled}
          {...btnAttributes}
        >
          {buttonContent}
          {!noChevron && (
            <ChevronDownIcon
              className={twMerge(
                "ml-1 h-4 rotate-0 transition-transform",
                isOpen && "rotate-180"
              )}
            />
          )}
        </TransparentButton>
      )}
    </Tooltip>
  );
};
export default Dropdown;
