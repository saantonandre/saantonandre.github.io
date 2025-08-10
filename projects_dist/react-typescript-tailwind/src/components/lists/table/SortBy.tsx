import Select from "components/inputs/Select";
import { Col } from "./types";
type Props<D, T extends {}> = {
  setValue: React.Dispatch<React.SetStateAction<D>>;
  value: D;
  // Array of titles and keys
  cols: Col<Partial<T>>;
};

export function SortBy<D, T extends {}>({
  setValue,
  cols,
  value,
}: Props<D, T>) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-contrast2">Ordina per:</span>
      <Select
        onChange={(e) => {
          setValue(e.target.value as D);
        }}
        value={String(value)}
        className="w-fit max-w-[120px] text-ellipsis"
      >
        <option></option>

        {Object.keys(cols).map((key, i) => {
          return (
            <option className="" key={i} value={String(key)}>
              {cols[key as keyof T][0]}
            </option>
          );
        })}
      </Select>
    </div>
  );
}

export default SortBy;
