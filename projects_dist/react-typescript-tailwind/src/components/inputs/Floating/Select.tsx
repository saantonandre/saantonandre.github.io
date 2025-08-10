import classes from "components/inputs/Floating/classes";
import { useEffect, useState } from "react";
import { twMerge } from "tailwind-merge";

type Props = {
  label: string;
  inputClassName?: string;
  innerRef?: React.Ref<HTMLSelectElement>;
  underline?: boolean;
  /** Whether or not the label should -always- stay to the top */
  stayUp?: boolean;
} & React.DetailedHTMLProps<
  React.InputHTMLAttributes<HTMLSelectElement>,
  HTMLSelectElement
>;

/** A select with a floating label */
export const FloatingSelect: React.FC<Props> = ({
  className,
  inputClassName,
  id = "floating_select" + Math.random(),
  label = "Floating select",
  onChange,
  children,
  value,
  underline,
  innerRef,
  stayUp,
  defaultValue,
  ...attributes
}) => {
  const { inputC, labelC } = classes;
  const [val, setVal] = useState(value);
  useEffect(() => {
    // Used to update when controlled
    setVal(value);
  }, [value, defaultValue]);
  return (
    <div className={twMerge("relative flex items-center", className)}>
      <select
        id={id}
        required
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
        defaultValue={defaultValue || ""}
        {...attributes}
        ref={innerRef}
      >
        <option value="" disabled />
        {children}
      </select>
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

export default FloatingSelect;
