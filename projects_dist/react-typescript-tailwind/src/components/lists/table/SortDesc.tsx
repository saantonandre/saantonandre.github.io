import {
  BarsArrowDownIcon,
  BarsArrowUpIcon,
} from "@heroicons/react/24/outline";
import ToggleableButton from "components/buttons/Toggleable";
import Tooltip from "components/popovers/Tooltip";

type Props = {
  sortDesc: boolean;
  disabled: boolean;
  setter: (val: boolean) => void;
};
export const SortDesc = ({ sortDesc, setter, disabled }: Props) => {
  return (
    <Tooltip
      tip={
        disabled
          ? "Ordinamento non selezionato"
          : sortDesc
          ? "Ordine decrescente"
          : "Ordine crescente"
      }
    >
      <ToggleableButton
        className="border w-fit bg-neutral text-contrast2 disabled:pointer-events-none disabled:opacity-60 "
        onClick={() => setter(!sortDesc)}
        toggle={sortDesc}
        disabled={disabled}
      >
        {sortDesc ? (
          <BarsArrowDownIcon className="h-4" />
        ) : (
          <BarsArrowUpIcon className="h-4" />
        )}
      </ToggleableButton>
    </Tooltip>
  );
};
export default SortDesc;
