import classes from "components/inputs/Floating/classes";
import { useEffect, useState } from "react";
import { twMerge } from "tailwind-merge";

type Props = {
  label: string;
  inputClassName?: string;
  innerRef?: React.Ref<HTMLInputElement>;
  underline?: boolean;
  onDisableChange?: (checked: boolean) => void;
  /** Whether or not the label should -always- stay to the top */
  stayUp?: boolean;
} & Omit<
  React.DetailedHTMLProps<
    React.InputHTMLAttributes<HTMLInputElement>,
    HTMLInputElement
  >,
  "type"
>;

/** An input with a floating label */
export const FloatingRange: React.FC<Props> = ({
  className,
  id = "floating_range" + Math.random(),
  label = "Floating range",
  onChange,
  onDisableChange,
  inputClassName,
  value,
  innerRef,
  underline,
  stayUp,
  defaultValue,
  disabled,
  ...attributes
}) => {
  const notNull = (n: any) => {
    return n !== null || n !== undefined;
  };
  const [val, setVal] = useState(notNull(value) ? value : defaultValue);
  const [isDisabled, setIsDisabled] = useState(disabled);
  const { inputC, labelC } = classes;
  useEffect(() => {
    // Used to update when controlled
    if (notNull(value)) setVal(value);
  }, [value]);
  return (
    <div
      className={twMerge(
        "relative grid w-full grid-cols-12 items-center",
        className
      )}
    >
      <input
        type="checkbox"
        className="col-span-2"
        defaultChecked={!isDisabled}
        onChange={(e) => {
          setIsDisabled(!e.target.checked);
          onDisableChange?.(e.target.checked);
        }}
      />
      <input
        id={id}
        disabled={isDisabled}
        required={attributes.required}
        className={twMerge(
          inputC,
          "col-span-8",
          underline && "rounded-none border-0 border-b",
          inputClassName
        )}
        onChange={(e) => {
          onChange?.(e);
          setVal(e.target.value);
        }}
        value={value}
        defaultValue={defaultValue}
        ref={innerRef}
        type="range"
        {...attributes}
      />
      <div className="w-full col-span-2 text-center">
        {isDisabled || !notNull(val) ? (
          <i className="text-slate-400">-</i>
        ) : (
          <b>{val}</b>
        )}
      </div>
      <label
        htmlFor={id}
        className={twMerge(
          labelC,
          (val || val === 0 || stayUp || defaultValue) &&
            " z-10 -translate-y-2/3 scale-75",
          !underline && "bg-white"
        )}
      >
        {label} {attributes.required && "*"}
      </label>
    </div>
  );
};

export default FloatingRange;
