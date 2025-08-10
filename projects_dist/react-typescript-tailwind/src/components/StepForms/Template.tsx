import { useEffect } from "react";
import { twMerge } from "tailwind-merge";
import { formDataGenerator, StepForm } from "components/StepForms/Stepper";


// Remove this and add/inport your own formInput datatype
type DataType={
    test:number|string,
}


export const StepFormTemplate: StepForm<
  Partial<DataType>
> = ({
  className,
  inputData,
  editHandler,
  formRef,
  isCurrentStep,
  ...attributes
}) => {



    // Business logic here
  const handleChange = (e: HTMLFormElement) => {
    const [form, valid] = formDataGenerator(e);
    // In case some inputs are added programmatically do the following
    // form.append("key",value)
    // in case it has some different kind of validation:
    // eg. editHandler(form,valid && !tooGeneric)
    editHandler(form, valid);
  };

  // Validates the form as soon as it is displayed
  useEffect(() => {
    if (isCurrentStep && formRef.current) {
      handleChange(formRef.current);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isCurrentStep]);
  return (
    <form
      ref={formRef}

      className={twMerge(
        "flex w-full flex-col items-center gap-5 rounded-3xl",
        className
      )}
      onChange={(e) => handleChange(e.currentTarget)}
      {...attributes}
    >
        {/** Form inputs here */}
    </form>
  );
};
export default StepFormTemplate;
