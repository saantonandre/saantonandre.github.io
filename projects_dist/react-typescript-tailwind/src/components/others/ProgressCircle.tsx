import { useEffect, useRef, useState } from "react";
import { twMerge } from "tailwind-merge";

type Props = {
  /** Any number from 0.0 to 1.0 */
  amount: number;
  size?: number;
  strokeWidth?: number;
  Icon?: React.FC<React.SVGProps<SVGSVGElement>>;
  color: string;
}&React.SVGProps<SVGSVGElement>;

/** Displays the billboard Visibility indexes */
export const ProgressCircle: React.FC<Props> = ({
  amount,
  Icon,
  size = 40,
  strokeWidth = 6,
  color,
  className,
  ...attributes
}) => {
  const circleRef = useRef<null | SVGCircleElement>(null);

  const [[dashArray, dashOffset], setProgress] = useState([0, 0]);
  useEffect(() => {
    if (!circleRef.current) {
      return;
    }
    const radius = size / 2 - strokeWidth;
    const circumference = radius * 2 * Math.PI;
    const offset = circumference - amount * circumference;
    setProgress([circumference, offset]);
  }, [circleRef, amount, size, strokeWidth]);
  return (
    <div className="relative h-fit w-fit">
      <svg width={size} height={size} {...attributes}>
        <circle
          ref={circleRef}
          style={{
            stroke: color,
          }}
          className="transition-all duration-1000 origin-center opacity-20"
          strokeWidth={strokeWidth}
          fill="transparent"
          r={size / 2 - strokeWidth}
          cx={size / 2}
          cy={size / 2}
        />
        <circle
          ref={circleRef}
          style={{
            stroke: color,
          }}
          className="transition-all duration-1000 origin-center -rotate-90"
          strokeWidth={strokeWidth}
          strokeDasharray={dashArray}
          strokeDashoffset={dashOffset}
          fill="transparent"
          r={size / 2 - strokeWidth}
          cx={size / 2}
          cy={size / 2}
        />
      </svg>
      {Icon && (
        <div
          style={{ color: color }}
          className={twMerge(
            "absolute left-1/2 top-1/2 w-7 -translate-x-1/2 -translate-y-1/2 opacity-50",
            amount === 1 && "opacity-100 animate-pulse"
          )}
        >
          <Icon className="max-w-full max-h-full stroke-2" />
        </div>
      )}
    </div>
  );
};
export default ProgressCircle;
