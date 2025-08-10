import Dropdown from "components/inputs/Dropdown";
import Tooltip from "components/popovers/Tooltip";
import { twMerge } from "tailwind-merge";
type Props<T> = {
  /** Table data array (selected only) */
  selectedData: T[];
  /** [actionName, actionCallback] */
  actions: [React.ReactNode | JSX.Element, ((data: T[]) => void)?][];
  disabled?: boolean;
};
export function ActionDropdown<T>({
  selectedData,
  actions,
  disabled,
}: Props<T>) {
  return (
    <>
    <Tooltip tip="Nessuna riga selezionata" disabled={!disabled}>
      <Dropdown
        disabled={disabled}
        placement="bottom-start"
        containerClassName={twMerge(
          "shadow overflow-hidden rounded-lg bg-transparent min-w-[100px]"
        )}
        optionsClassName={twMerge(
          "bg-neutral2 hover:bg-neutral3 first:rounded-t-lg hover:border-primary whitespace-nowrap"
        )}
        className="text-contrast h-9 disabled:text-contrast2"
        buttonContent={
          <div className="flex items-center gap-3">Azioni </div>
        }
        options={actions.map(([content, onClick]) => {
          return [content, () => onClick?.(selectedData)];
        })}
      />
    </Tooltip>
    </>
  );
}

export default ActionDropdown;
