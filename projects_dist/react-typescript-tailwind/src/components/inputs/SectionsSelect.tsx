import TransparentButton from "components/buttons/Transparent";
import { twMerge } from "tailwind-merge";

type Props<T extends readonly [string, string]> = {
  sections: readonly T[];
  selected: T;
  setSelected: (value: T) => void;
  className?: string;
};

export function SectionsSelect<T extends readonly [string, string]>({
  sections,
  selected,
  setSelected,
  className,
}: Props<T>) {
  return (
    <div
      className={twMerge("grid shrink-0 grid-cols-3 rounded-lg border shadow-xl p-[2px]",className)}
    >
      {sections.map((section) => {
        const [key, alias] = section;
        const [selectedKey] = selected;
        const isSelected = key === selectedKey
        return (
          <TransparentButton
            key={key}
            onClick={() => setSelected(section)}
            className={twMerge(
              "w-full rounded-lg py-0 hover:bg-purple-200",
              "dark:hover:bg-purple-200/25",
              isSelected && "bg-primary",
              !isSelected && "text-slate-700 dark:text-slate-300"
            )}
          >
            {alias}
          </TransparentButton>
        );
      })}
    </div>
  );
}
