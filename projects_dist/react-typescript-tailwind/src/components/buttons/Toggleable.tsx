import { twMerge } from "tailwind-merge";
type Props<T> = React.ButtonHTMLAttributes<HTMLButtonElement>&{
  toggle: T;
  activeClassName?: string;
  onClick:(toggleValue:T)=>void
} ;

export function ToggleableButton<T> ({
  toggle,
  activeClassName="",
  className,
  children,
  onClick,
  ...attributes
}:Props<T>)  {
  return (
    <button
      className={twMerge(
        "select-none flex w-fit items-center gap-1 rounded-lg  bg-transparent p-2 font-medium text-contrast2 transition-all hover:text-contrast",
        "disabled:hover:text-contrast2 disabled:bg-neutral2 border-none",
        className,
        toggle ? activeClassName : ""
      )}
      onClick={()=>onClick(toggle)}
      {...attributes}
    >
      {children}
    </button>
  );
};
export default ToggleableButton;
