import useColorScheme from "hooks/useColorScheme";
import { twMerge } from "tailwind-merge";

type Props = {
  innerRef?: React.Ref<HTMLInputElement>;
  circleClassName?: string;
} & React.DetailedHTMLProps<
  React.InputHTMLAttributes<HTMLInputElement>,
  HTMLInputElement
>;
export const ColorSchemeToggle: React.FC<Props> = ({
  className = "",
  circleClassName = "",
  innerRef,
  ...attributes
}) => {
  const [scheme, setScheme] = useColorScheme();
  return (
    <label
      className={twMerge(
        "relative flex h-6 w-12 cursor-pointer items-center justify-center rounded-full transition-all",
        className
      )}
    >
      <input
        type="checkbox"
        value=""
        className="sr-only peer"
        ref={innerRef}
        checked={scheme === "dark"}
        onClick={() => {
          scheme==="dark" ? setScheme("light") : setScheme("dark");
        }}
        readOnly
        {...attributes}
      />
      <div
        className={twMerge(
          "h-5 w-5 -translate-x-3 rounded-full border bg-red-400 transition-all peer-checked:translate-x-3",
          "dark:border-slate-500",
          circleClassName
        )}
      ></div>
    </label>
  );
};

export default ColorSchemeToggle;
