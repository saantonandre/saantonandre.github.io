import { twMerge } from "tailwind-merge";

type Props = {innerRef?:React.RefObject<HTMLInputElement>}&React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>,HTMLInputElement>;

export const BasicInput: React.FC<Props> = ({ className,onClick,innerRef, ...attributes }) => {
  return (
    <input
      className={twMerge(
        "w-full border-neutral3 border rounded-lg px-2 py-1 outline-0 focus-within:bg-neutral3 bg-neutral2 text-contrast",
        className
      )}
      onClick={(e)=>{
        e.stopPropagation();
        onClick?.(e)
      }}
      required
      ref={innerRef}
      {...attributes}
    />
  );
};

export default BasicInput;
