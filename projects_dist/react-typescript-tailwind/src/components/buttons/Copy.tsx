import { ClipboardIcon } from "@heroicons/react/24/outline";
import TransparentButton from "components/buttons/Transparent";
import { Tooltip } from "components/popovers/Tooltip";
import { useState } from "react";

export const CopyButton = ({
  longString,
  children,
  disabled = false,
  className="",
  tip=<span className="text-sm text-contrast2">Copia</span>,
  hideIcon
}: {
  longString: string;
  children: React.ReactNode;
  disabled?: boolean;
  className?:string
  tip?:React.ReactNode
  hideIcon?:boolean
}) => {
  const [show, setShow] = useState(false);
  const copyFn = () => {
    navigator.clipboard.writeText(longString);
    setShow(true);
    setTimeout(() => setShow(false), 1000);
  };
  return (
    <Tooltip disabled={show} tip={tip} >
        <div className="relative flex items-center justify-center">
          {show ? (
              <div className="py-[6px] select-none text-contrast2">Copied</div>
          ) : (
            <TransparentButton disabled={disabled} onClick={copyFn} className={"py-1 "+className}>
              <div className="flex items-center gap-3">
                {children}
                {!hideIcon&&<ClipboardIcon className="w-4 h-4 stroke-[2px]" />}
              </div>
            </TransparentButton>
          )}
        </div>
    </Tooltip>
  );
};
export default CopyButton;
