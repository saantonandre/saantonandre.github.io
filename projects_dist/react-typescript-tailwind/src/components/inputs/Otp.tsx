import { Dispatch, SetStateAction } from "react";
import { twMerge } from "tailwind-merge";

type Props = {
  digits: number;
  /** List of values, eg: ["0","1","2","3","4","5"] */
  values: string[];
  /** Sets the list of values */
  setValues: Dispatch<SetStateAction<string[]>>;
} & React.DetailedHTMLProps<
  React.InputHTMLAttributes<HTMLInputElement>,
  HTMLInputElement
>;
export const RE_DIGIT = new RegExp(/^\d+$/);
export const OtpInput: React.FC<Props> = ({
  values,
  setValues,
  ...inputAttributes
}) => {
  const digitsAmount = values.length;
  /** Focus the sibling of an element, to the right (default) or to the left */
  const focusSibling = (el: HTMLInputElement, left?: boolean) => {
    const sibling = left ? el.previousElementSibling : el.nextElementSibling;
    const siblingEl = sibling as HTMLInputElement | null;
    if (!siblingEl && !left) {
      el.blur();
    }
    if (!siblingEl) return el;
    siblingEl.focus();
    return siblingEl;
  };
  /** Handles user input (paste event included) */
  const changeHandler = (el: HTMLInputElement, i: number) => {
    const inputValue = el.value.trim();
    if (!RE_DIGIT.test(inputValue)) {
      return;
    }
    if (inputValue.length > 1) {
      // If the string has more than one char take the first and delegate the rest to next
      setValues((val) => {
        let currentEl = el;
        for (
          let idx = i, count = 0;
          idx < digitsAmount && count < inputValue.length;
          idx++, count++
        ) {
          val.splice(idx, 1, inputValue[count]);
          currentEl = focusSibling(currentEl);
        }
        return [...val];
      });
      return;
    }
    if (!inputValue) return;
    setValues((val) => {
      val.splice(i, 1, inputValue);
      return [...val];
    });
    if (i >= digitsAmount - 1) return;
    focusSibling(el);
  };
  return (
    <div className="flex w-full gap-3 p-2">
      {values.map((_, i) => {
        return (
          <input
            key={i}
            className={twMerge("outline-primary w-10 p-0 text-3xl text-center border select-all h-14 rounded-xl border-gray-400",values[i]!==""&&"border-primary")}
            type="text"
            pattern="\d{1}"
            maxLength={digitsAmount}
            value={values[i]}
            onChange={(e) => {
              changeHandler(e.currentTarget, i);
            }}
            onFocus={(e) => e.currentTarget.setSelectionRange(0, -1)}
            onKeyDown={(e) => {
              const el = e.currentTarget;
              switch (e.key) {
                case "Backspace":
                  setValues((val) => {
                    val.splice(i, 1, "");
                    return [...val];
                  });
                  focusSibling(el, true);
                  return;
                case "Delete":
                  setValues((val) => {
                    val.splice(i, 1, "");
                    return [...val];
                  });
                  focusSibling(el);
                  return;
                case "ArrowLeft":
                  focusSibling(el, true);
                  return;
                case "ArrowRight":
                  focusSibling(el);
                  return;
              }
            }}
            required
            autoComplete="one-time-code"
            {...inputAttributes}
          />
        );
      })}
    </div>
  );
};
export default OtpInput;
