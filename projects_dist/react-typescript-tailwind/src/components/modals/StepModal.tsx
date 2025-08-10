import Stepper, { Props as StepperProps } from "components/StepForms/Stepper";
import BasicModal from "components/modals/Basic";
type Props<T> = {
  open: boolean;
  close: () => void;
  title: string;
} & StepperProps<T>;

export function StepModal<T>({ open, close,title, ...stepperProps }: Props<T>) {
  return (
    <BasicModal title={title} open={open} close={close} className="mt-0">
      <Stepper
        {...stepperProps}
        handleCompleteSuccess={() => close()}
        handleClose={() => close()}
      />
    </BasicModal>
  );
}

export default StepModal;
