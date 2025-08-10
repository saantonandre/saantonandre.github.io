import { CheckIcon } from "@heroicons/react/24/outline";
import { useEffect, useState } from "react";
import { twMerge } from "tailwind-merge";

type Props = React.DetailedHTMLProps<
  React.InputHTMLAttributes<HTMLInputElement>,
  HTMLInputElement
>;

export const Checkbox: React.FC<Props> = ({
  className,
  onChange,
  ...attributes
}) => {
  const [checked, setChecked] = useState(attributes.defaultChecked);
  useEffect(() => {
    setChecked(attributes.checked);
  }, [attributes.checked]);
  return (
    <label
      role="checkbox"
      aria-checked={checked}
      className={twMerge(
        "inline-block h-6 w-6 rounded-lg bg-neutral3 text-contrast dark:bg-d-neutral2 dark:text-d-contrast",
        "cursor-pointer select-none",
        className
      )}
    >
      {checked && <CheckIcon className="w-full h-full stroke-2" />}
      <input
        type="checkbox"
        className="hidden"
        onChange={(e) => {
          setChecked(e.target.checked);
          onChange?.(e);
        }}
        {...attributes}
      />
    </label>
  );
};

export default Checkbox;
