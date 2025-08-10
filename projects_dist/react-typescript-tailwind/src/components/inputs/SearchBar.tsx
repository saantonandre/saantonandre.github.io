import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { twMerge } from "tailwind-merge";

type Props = {
  handleChange?: (value: string) => void;
} & React.DetailedHTMLProps<
  React.InputHTMLAttributes<HTMLInputElement>,
  HTMLInputElement
>;

export const SearchBar: React.FC<Props> = ({
  handleChange,
  className,
  ...attributes
}) => {
  return (
    <div
      className={twMerge(
        "flex h-fit w-full overflow-hidden rounded-lg text-contrast shadow-lg ",
        className
      )}
    >
      <div className="p-1 px-3 border-r border-contrast2">
        <MagnifyingGlassIcon className="w-5 h-5 stroke-2 text-contrast2" />
      </div>
      <input
        className="px-4 bg-transparent grow focus:outline-none focus:ring-0"
        type="text"
        onChange={(e) => handleChange?.(e.target.value || "")}
        {...attributes}
      />
    </div>
  );
};
