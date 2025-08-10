import { twMerge } from "tailwind-merge";

type Props = React.HTMLAttributes<HTMLDivElement> & {
  data: string;
};
export const BasicList = ({
  data,
  className,
  children,
  ...attributes
}: Props) => {
  return (
    <div
      className={twMerge("flex flex-col items-center gap-3", className)}
      {...attributes}
    >
      <div className="flex flex-col w-full font-bold text-contrast2">
        <span className="text-3xl">Basic List </span>
        <span className="text-sm font-normal">({data})</span>
      </div>
      {children}
    </div>
  );
};
export default BasicList;
