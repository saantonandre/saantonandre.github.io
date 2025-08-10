import { twMerge } from "tailwind-merge";

type Props = {
  innerRef?: React.Ref<HTMLInputElement>;
  bgClassName?: string;
} & React.DetailedHTMLProps<
  React.InputHTMLAttributes<HTMLInputElement>,
  HTMLInputElement
>;

export const Toggle: React.FC<Props> = ({
  className = "",
  bgClassName = "",
  innerRef,
  ...attributes
}) => {
  return (
    <label
      className={twMerge(
        "relative inline-flex w-fit cursor-pointer items-center rounded-full",
        bgClassName
      )}
    >
      <input
        type="checkbox"
        value=""
        className="sr-only peer"
        ref={innerRef}
        {...attributes}
      />
      <div
        className={twMerge(
          `h-6 w-11 rounded-full outline-none after:absolute after:top-[2px] 
          after:left-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-transparent 
          after:bg-contrast2 peer-checked:after:bg-contrast after:transition-all peer-checked:after:translate-x-full `,
          className
        )}
      ></div>
    </label>
  );
};

export default Toggle;
