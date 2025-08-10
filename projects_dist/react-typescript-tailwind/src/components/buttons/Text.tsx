import { twMerge } from "tailwind-merge";

export const TextButton: React.FC<
  React.ButtonHTMLAttributes<HTMLButtonElement>
> = ({ children, className, ...attributes }) => {
  return (
    <span
      role="button"
      className={twMerge(
        "select-none opacity-100 hover:opacity-80 active:opacity-100",
        className
      )}
      {...attributes}
    >
      {children}
    </span>
  );
};
export default TextButton;
