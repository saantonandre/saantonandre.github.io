import { twMerge } from "tailwind-merge";

type Props = {
  children?: React.ReactNode;
} & React.HTMLAttributes<HTMLDivElement>;

export const FixedSpaceContainer: React.FC<Props> = ({
  children,
  className,
  ...attributes
}) => {
  return (
    <div
      className={twMerge("relative h-full max-w-full", className)}
      {...attributes}
    >
      <div className="absolute top-0 bottom-0 left-0 right-0 flex justify-center w-full h-full">
        {children}
      </div>
    </div>
  );
};

export default FixedSpaceContainer;
