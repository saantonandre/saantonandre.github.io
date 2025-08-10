import BasicButton from "components/buttons/Basic";
import TransparentButton from "components/buttons/Transparent";
import BasicContainer from "components/containers/Basic";
import StepProgress from "components/modals/StepProgress";
import { createRef, useEffect, useState } from "react";
import { twMerge } from "tailwind-merge";
/**
 * Represents the custom event handler for a form
 * This is used instead of the onChange event becasuse
 * the onChannge is not triggered when input values are changed programmatically
 */
export type ModifyHandler = (data: FormData, isValid: boolean) => void;

/** Returns a FormData object and a boolean indicating if the form is valid */
export const formDataGenerator = (e: HTMLFormElement): [FormData, boolean] => {
  const form = new FormData(e);
  const elems = e.elements;

  for (let i = 0; i < elems.length; i++) {
    const inputElement = elems[i] as HTMLInputElement;
    if (inputElement.value) {
      form.set(inputElement.name, inputElement.value);
    }
  }
  const valid = e.checkValidity();
  return [form, valid];
};

/**
 * ### IMPORTANT!
 * This type is used to define the step forms,
 * step forms must be given the second element of the tuple as type.
 * Look at AdvertiserKyc or NewBillboard for usage examples.
 */
export type StepForm<T> = React.FC<
  React.DetailedHTMLProps<
    React.FormHTMLAttributes<HTMLFormElement>,
    HTMLFormElement
  > & {
    /** Callback to give to the onChange attributes, checks the form validity and updates the inputData */
    editHandler: ModifyHandler;
    /** Can be used to check the rest of the data */
    inputData: T;
    /** Reference of the form used by the stepper to perform various OPs */
    formRef: React.RefObject<HTMLFormElement>;
    /** Whether the StepForm is the current step (the one displayed) */
    isCurrentStep: boolean;
  }
>;
/** Returns the formdata as an object */
export function parseFormData<T extends {}>(formData: FormData) {
  let object = {};
  formData.forEach((value, key) => {
    let booleansHandled = value === "true" ? true : value;
    booleansHandled = booleansHandled === "false" ? false : booleansHandled;
    const pair = { [key]: booleansHandled } as Partial<T>;
    object = { ...object, ...pair };
  });
  return object;
}

export type Props<T> = {
  /** Used to define which steps are closed */
  setLockedSteps?: (steps: number[]) => void;
  /** Array of titles and corresponding forms that will be used */
  stepForms: [string, StepForm<T>][];
  /** The inputData, used to type the generic */
  inputData: T;
  /** The setter for the inputData, to update values */
  setInputData: (data: T) => void;
  /** Callback which will get called on completion (after the user final submission) */
  handleComplete?: (data: T) => Promise<T>;
  /** Callback triggering as the stepform has been successfully completed */
  handleCompleteSuccess?: () => void;
  /** If defined, generates a close button and has this function as callback */
  handleClose?: () => void;
  className?: string;
};

export function Stepper<T>({
  stepForms,
  inputData,
  className,
  setInputData,
  handleCompleteSuccess = () => {},
  handleClose,
  handleComplete = async () => {
    return inputData;
  },
}: Props<T>) {
  const [currentStep, setCurrentStep] = useState(0);
  const [formsValidity, setFormsValidity] = useState<boolean[]>(
    stepForms.map(() => false)
  );
  const [loading, setLoading] = useState(false);
  const formsRef = stepForms.map(() => createRef<HTMLFormElement>());
  //e.currentTarget.requestSubmit();
  const changeStep = (step: number) => {
    if (step < 0 || step >= stepForms.length) return;
    if (step === currentStep) return;
    if (formsValidity[step - 1] || step === 0) setCurrentStep(step);
  };

  /** Checks if the next step is locked and if the form is valid */
  const guardNextStep: ModifyHandler = (_, isValid: boolean) => {
    setFormsValidity((prev) => {
      const newFormsValidity = [...prev];
      //if the current form is not valid, invalidate every next step
      newFormsValidity[currentStep] = isValid;
      if (!isValid) {
        for (let i = currentStep + 1; i < newFormsValidity.length; i++) {
          newFormsValidity[i] = false;
        }
      }
      newFormsValidity[currentStep] = isValid;
      return newFormsValidity;
    });
  };
  useEffect(() => {
    const form = formsRef[currentStep].current;
    // Trigger onchange here
    if (!form) return;
  }, [currentStep, formsRef]);

  return (
    <BasicContainer noStyles loading={loading}>
      <div className={twMerge("relative mx-8 flex flex-col gap-2", className)}>
        <StepProgress
          steps={stepForms.map(([step]) => step)}
          currentStep={currentStep}
          onStepClick={changeStep}
          lockedSteps={formsValidity.map((_, i) =>
            formsValidity[i - 1] || i === 0 ? -1 : i
          )}
          className="mb-8"
        />
        {/* Content */}
        <div className="text-xl font-medium">{stepForms[currentStep][0]}</div>
        <>
          {stepForms.map(([_title, Form], index) => {
            return (
              <div
                key={index}
                className={`${
                  index === currentStep ? "block" : "hidden"
                } w-full animate-down-up`}
              >
                <Form
                  id={`form-${index}`}
                  inputData={inputData}
                  onSubmit={(e) => e.preventDefault()}
                  formRef={formsRef[index]}
                  isCurrentStep={index === currentStep}
                  editHandler={(fData, isValid) => {
                    const data = parseFormData<T & {}>(fData);
                    setInputData({ ...inputData, ...data });
                    guardNextStep(fData, isValid);
                  }}
                />
              </div>
            );
          })}
        </>
      </div>
      {/* Footer */}
      <div className="flex justify-end gap-3 mt-5">
        {handleClose && (
          <TransparentButton
            disabled={loading}
            className="border rounded-lg w-fit bg-gray-50"
            onClick={
              currentStep === 0
                ? () => handleClose()
                : () => setCurrentStep(currentStep - 1)
            }
          >
            {currentStep === 0 ? "Annulla" : "Torna indietro"}
          </TransparentButton>
        )}
        <BasicButton
          disabled={loading}
          type="submit"
          className={twMerge(
            "w-fit",
            formsValidity[currentStep] && "animate-wavepulse"
          )}
          form={`form-${currentStep}`}
          onClick={(e) => {
            // Prevent default behaviour
            e.preventDefault();
            formsRef[currentStep].current?.reportValidity();
            // Validates the form
            if (
              currentStep < stepForms.length - 1 &&
              formsValidity[currentStep]
            ) {
              setCurrentStep(currentStep + 1);
            }
            if (
              currentStep === stepForms.length - 1 &&
              formsValidity[currentStep]
            ) {
              setLoading(true);
              handleComplete(inputData)
                .then((data) => {
                  setInputData(data);
                  handleCompleteSuccess();
                  setLoading(false);
                })
                .catch((err) => {
                  console.log(err);
                  setLoading(false);
                });
            }
          }}
        >
          Conferma
        </BasicButton>
      </div>
    </BasicContainer>
  );
}

export default Stepper;
