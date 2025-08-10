import { useEffect, useState } from "react";
import { twMerge } from "tailwind-merge";

type Props = {
  value: number;
  max?: number;
  className?: string;
  containerClassName?: string;
  barStyle?: React.CSSProperties;
  inverted?: boolean;
  onTransitionEnd?: React.DOMAttributes<HTMLDivElement>["onTransitionEnd"];
};
export const ProgressBar: React.FC<Props> = ({
  value,
  max = 100,
  containerClassName,
  className,
  barStyle = {},
  onTransitionEnd,
  inverted,
  ...attributes
}) => {
  const percentage = Math.round((value / max) * 100 * 10) / 10 + "%";
  const [progressWidth, setProgressWidth] = useState("0%");
  useEffect(() => {
    setProgressWidth(percentage);
  }, [percentage]);
  return (
    <div className="w-full">
      <div
        className={twMerge(
          "h-[6px] w-full overflow-hidden  rounded-xl",
          inverted
            ? "bg-primary " + className
            : "bg-gray-200 " + containerClassName
        )}
        {...attributes}
      >
        <div
          style={{ width: progressWidth, ...barStyle }}
          onTransitionEnd={onTransitionEnd}
          className={twMerge(
            "h-full transition-all duration-1000 ",
            !inverted
              ? "bg-primary " + className
              : "bg-gray-200 " + containerClassName
          )}
        />
      </div>
    </div>
  );
};
export default ProgressBar;
