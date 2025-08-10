import classes from "components/inputs/Floating/classes";
import {  useEffect, useState } from "react";
import { twMerge } from "tailwind-merge";

type Props = {
  label: string;
  inputClassName?: string;
  innerRef?: React.Ref<HTMLTextAreaElement>;
  /** Whether or not the label should -always- stay to the top */
  stayUp?: boolean;
} & React.DetailedHTMLProps<
  React.TextareaHTMLAttributes<HTMLTextAreaElement>,
  HTMLTextAreaElement
>;

/** An input with a floating label */
export const TextArea: React.FC<Props> = ({
  className,
  id = "floating_textarea"+Math.random(),
  label = "Floating textarea",
  onChange,
  inputClassName,
  value,
  title,
  innerRef,
  stayUp,
  defaultValue,
  ...attributes
}) => {
  const [val, setVal] = useState(value);
  const { inputC, labelC } = classes;
  useEffect(()=>{
    // Used to update when controlled
    setVal(value)
  },[value])
  return (
    <div className={twMerge("relative flex items-center", className)}>
      <textarea
        id={id}
        cols={30}
        required
        title={title}
        className={twMerge(
          inputC,
          inputClassName,

        )}
        onChange={(e) => {
          if (onChange) onChange(e);
          setVal(e.target.value);
        }}
        defaultValue={defaultValue}
        value={value}
        {...attributes}
        ref={innerRef}
      />
      <label
        htmlFor={id}
        className={twMerge(
          labelC,
          "top-2 peer-focus:top-2",
          (val || val === 0 || stayUp||defaultValue) &&" z-10 -translate-y-2/3 scale-75 bg-neutral"
        )}
      >
        {label} {attributes.required && "*"}
      </label>
    </div>
  );
};

export default TextArea;
