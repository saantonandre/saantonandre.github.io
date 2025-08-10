import { twMerge } from "tailwind-merge";

type Props = React.SelectHTMLAttributes<HTMLSelectElement>;

export const Select: React.FC<Props> = ({ className,children, ...attributes }) => {
  return (
    <select
      className={twMerge(
        "w-full rounded-lg bg-neutral3 px-2 py-1 outline-0 focus-within:text-contrast text-contrast2 font-medium",
        className
      )}
      {...attributes}
    >{children}</select>
  );
};

export default Select;
