import UnderlineInput from "components/inputs/Underline";
type Props<T> = {
  setter?: React.Dispatch<React.SetStateAction<T>>;
  /** The key to set on the state provided by the setter */
  state: T | null;
  stateKey: keyof T;
  /** defines if this component should switch into an "input" state */
  switchInput: boolean;
  label?: string;
  value?: string;
  type?: string;
  autoComplete?: string;
  resolver?: (state: T) => string;
};

/** A text field with a label which can transform into an input, changes the provided state onChange */
export function MutableField<
  T extends { [name: string | number | symbol]: any }
>({
  setter,
  stateKey,
  switchInput = false,
  label = "",
  state,
  type = "text",
  autoComplete = "on",
  resolver,
  ...attributes
}: Props<T> & React.HTMLAttributes<HTMLDivElement>) {
  const MAX_STRING_LENGTH = 20;
  // Coercion to string
  let val = ((state && state[stateKey]) || "") + "";
  // Shorten long strings
  if (val.length > MAX_STRING_LENGTH) {
    val = val.trim().slice(0, MAX_STRING_LENGTH - 3) + "...";
  }
  return (
    <div className="flex flex-col">
      <div className="text-sm text-gray-400">{label}</div>
      <div>
        {switchInput ? (
          <UnderlineInput
            id={String(stateKey)}
            placeholder={label}
            onChange={(e) =>
              setter &&
              setter((prev) => ({ ...prev, [stateKey]: e.target.value }))
            }
            defaultValue={(state && state[stateKey]) || ""}
            type={type}
            autoComplete={autoComplete}
          />
        ) : (
          <div {...attributes}>
            {(resolver && state && resolver(state)) || val || "-"}
          </div>
        )}
      </div>
    </div>
  );
}
export default MutableField;
