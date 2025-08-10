import { CheckIcon, LockClosedIcon } from "@heroicons/react/24/outline";
import ProgressBar from "components/others/Progress/Bar";
import { twMerge } from "tailwind-merge";

type Props = {
  steps: string[];
  currentStep: number;
  lockedSteps?: number[];
  onStepClick?: (step: number) => void;
  className?: string;
} & React.HTMLAttributes<HTMLDivElement>;
export const StepProgress: React.FC<Props> = ({
  steps,
  currentStep,
  className,
  lockedSteps,
  onStepClick = () => {},
  ...attributes
}) => {
  return (
    <div
      className={twMerge("relative flex h-10 items-center", className)}
      {...attributes}
    >
      <ProgressBar
        containerClassName="scale-x-95"
        value={currentStep}
        max={steps.length - 1}
      />
      <div className="absolute top-0 flex w-full">
        {steps.map((step, stepIndex) => (
          <button
            key={step}
            className={twMerge(
              "flex flex-1 flex-col items-center text-gray-300 transition-all first:items-start last:items-end"
            )}
            disabled={lockedSteps?.includes(stepIndex)}
            onClick={() => onStepClick(stepIndex)}
          >
            <div
              className={twMerge(
                "relative flex h-10 w-10 items-center justify-center rounded-full",
                "scale-95 border bg-white text-xl font-bold transition-all",
                currentStep === stepIndex &&
                  "scale-110 border-4  border-primary",
                currentStep > stepIndex && "border-0 bg-primary",
                currentStep > stepIndex && "scale-75"
              )}
            >
              <CheckIcon
                className={twMerge(
                  "absolute h-6 w-6 stroke-2 text-white opacity-0 transition-all",
                  stepIndex < currentStep && "opacity-100"
                )}
              />

              <span
                className={twMerge(
                  "absolute opacity-0 transition-all",
                  stepIndex >= currentStep && "opacity-100",
                  currentStep === stepIndex && "text-primary"
                )}
              >
                {lockedSteps?.includes(stepIndex) ? (
                  <LockClosedIcon className="w-6 h-6 transition-all stroke-2" />
                ) : (
                  stepIndex + 1
                )}
              </span>
            </div>
            <div
              className={twMerge(
                "transition-all text-sm",
                currentStep === stepIndex && "text-primary"
              )}
            >
              {step}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};
export default StepProgress;
