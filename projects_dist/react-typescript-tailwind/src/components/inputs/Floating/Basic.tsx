import classes from "components/inputs/Floating/classes";
import { useEffect, useState } from "react";
import { twMerge } from "tailwind-merge";

type Props = {
  label: string;
  inputClassName?: string;
  innerRef?: React.Ref<HTMLInputElement>;
  underline?: boolean;
  /** Whether or not the label should -always- stay to the top */
  stayUp?: boolean;
} & React.DetailedHTMLProps<
  React.InputHTMLAttributes<HTMLInputElement>,
  HTMLInputElement
>;

/** An input with a floating label */
export const FloatingBasic: React.FC<Props> = ({
  className,
  id = "floating_basic" + Math.random(),
  label = "Floating basic",
  onChange,
  inputClassName,
  value,
  innerRef,
  underline,
  stayUp,
  defaultValue,
  ...attributes
}) => {
  const [val, setVal] = useState(value);
  const { inputC, labelC } = classes;
  useEffect(() => {
    setVal(value);
  }, [value]);
  return (
    <div className={twMerge("relative flex items-center", className)}>
      <input
        id={id}
        required={attributes.required}
        className={twMerge(
          inputC,
          underline && "rounded-none border-0 border-b",
          inputClassName
        )}
        onChange={(e) => {
          if (onChange) onChange(e);
          setVal(e.target.value);
        }}
        value={value}
        defaultValue={defaultValue}
        {...attributes}
        ref={innerRef}
      />
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

export default FloatingBasic;
