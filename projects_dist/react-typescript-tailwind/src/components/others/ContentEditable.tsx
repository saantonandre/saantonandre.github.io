import { twMerge } from "tailwind-merge";

type Props = {
  className?: string;
  onChange?: (
    e:
      | React.FormEvent<HTMLDivElement>
      | React.FocusEvent<HTMLDivElement, Element>
  ) => void;
} & Omit<
  React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>,
  "onChange"
>;
export const ContentEditable: React.FC<Props> = ({
  onChange,
  className,
  children,
  ...attributes
}) => {
  return (
    <div
      className={twMerge(
        "min-h-[60px] w-full rounded-lg border p-1 outline-0",
        className
      )}
      contentEditable
      onInput={(e) => onChange?.(e)}
      onBlur={(e) => onChange?.(e)}
      {...attributes}
    >
      {children}
    </div>
  );
};
export default ContentEditable;
