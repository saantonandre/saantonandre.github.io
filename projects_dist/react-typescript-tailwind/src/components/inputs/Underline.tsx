import { twMerge } from "tailwind-merge";

type Props = {
  placeholder: string;
} & React.InputHTMLAttributes<HTMLInputElement>;

/** An input with a floating label */
export const UnderlineInput: React.FC<Props> = ({
  className,
  id = "floating-outlined-" + Math.random(),
  placeholder = "Floating outlined",
  ...attributes
}) => {
  return (
    <div className={"relative " + className}>
      <input
        id={id}
        required
        placeholder=" "
        className={twMerge(
          "peer block w-full border-0 border-b-2 border-gray-300 bg-transparent py-2.5 px-0 text-sm text-gray-900 focus:border-primary focus:outline-none focus:ring-0",
          className
        )}
        {...attributes}
      />
    </div>
  );
};

export default UnderlineInput;
