import LoadingSpinner from "components/others/LoadingSpinner";
import { twMerge } from "tailwind-merge";

type Props = {
  children?: React.ReactNode;
  loading?: boolean;
  noStyles?: boolean;
} & React.HTMLAttributes<HTMLDivElement>;

export const BasicContainer: React.FC<Props> = ({
  children,
  className,
  loading,
  noStyles,
  ...attributes
}) => {
  return (
    <div
      className={twMerge(
        "relative",
        !noStyles &&
          "flex w-fit flex-col items-center justify-center gap-5 overflow-hidden rounded-xl p-6 shadow-xl",
        className
      )}
      {...attributes}
    >
      <div
        className={twMerge(
          "absolute top-0 bottom-0 left-0 right-0 -z-10 flex items-center justify-center bg-opacity-0 transition-all",
          loading && "z-50 bg-opacity-60 opacity-100"
        )}
      >
        {loading && <LoadingSpinner className="w-6 h-6" />}
      </div>
      {children}
    </div>
  );
};

export default BasicContainer;
