import ProgressBar from "components/others/Progress/Bar";
import { useEffect, useState } from "react";
import { twMerge } from "tailwind-merge";

const TICK = 100;
type Props = {
  duration: number;
  paused?: boolean;
  handleEnd?: () => void;
} & Omit<Parameters<typeof ProgressBar>[0], "value">;
export const ProgressCountDown: React.FC<Props> = ({
  duration = 5,
  paused = false,
  className,
  handleEnd = () => {},
  ...attributes
}) => {
  const [progress, setProgress] = useState<number>(0);
  const computedTick = (TICK / (duration * 1000)) * 100;
  useEffect(() => {
    setProgress(computedTick);
  }, [computedTick]);
  useEffect(() => {
    if (paused) return;
    setTimeout(() => setProgress(progress + computedTick), TICK);
  }, [progress, computedTick, handleEnd, paused]);
  return (
    <ProgressBar
      barStyle={{ transition: `${TICK}ms linear` }}
      value={progress}
      onTransitionEnd={progress >= 100 ? handleEnd : undefined}
      containerClassName={twMerge("flex justify-end rotate-180")}
      className={twMerge(className, paused && "opacity-50")}
      {...attributes}
    />
  );
};

export default ProgressCountDown;
