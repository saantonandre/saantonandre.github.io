import { EllipsisHorizontalIcon } from "@heroicons/react/24/outline";
import Dropdown from "components/inputs/Dropdown";
import { twMerge } from "tailwind-merge";

/** Action Button content, Action callback, Action button classname */
export type ActionArray<T> = [
  JSX.Element | React.ReactNode,
  (data: T) => void,
  string?
];
type Props<T> = {
  data: T;
  actions: ActionArray<T>[];
  buttonContent?: JSX.Element | React.ReactNode;
  className?: string;
};
/** Generic action button which takes as input the data to be manipulated and actions to be dispatched upon it */
export function ActionsButton<T extends {}>({
  data,
  actions,
  buttonContent,
  className = "z-50 hover:bg-neutral hover:shadow-sm focus:bg-neutral2 focus:shadow",
}: Props<T>) {
  return (
    <>
      <Dropdown
        disabled={false}
        containerClassName={twMerge(
          "shadow right-0 overflow-hidden rounded-lg bg-transparent border border-neutral3"
        )}
        optionsClassName={twMerge(
          "bg-neutral2 first:rounded-t-lg whitespace-nowrap"
        )}
        className={twMerge(className)}
        buttonContent={
          buttonContent || <EllipsisHorizontalIcon className="h-6" />
        }
        noChevron
        options={actions.map(([content, onClick, className]) => {
          return [
            content,
            () => {
              onClick(data);
            },
            className,
          ];
        })}
      />
    </>
  );
}

export default ActionsButton;
