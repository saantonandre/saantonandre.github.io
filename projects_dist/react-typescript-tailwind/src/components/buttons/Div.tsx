import LoadingSpinner from "components/others/LoadingSpinner";
import { twMerge } from "tailwind-merge";

type ButtonProps = React.DetailedHTMLProps<
  React.ButtonHTMLAttributes<HTMLDivElement>,
  HTMLDivElement
>;
export const DivButton: React.FC<
  ButtonProps & { loading?: boolean; loadingClassName?: string }
> = ({ children, className, loading, loadingClassName, ...attributes }) => {
  return (
    <div
      className={twMerge(
        "flex w-fit select-none items-center justify-center rounded-lg bg-primary p-2 py-1 font-medium",
        "text-contrast hover:brightness-105 active:brightness-90 disabled:pointer-events-none disabled:opacity-60",
        className
      )}
      {...attributes}
    >
      {loading ? (
        <LoadingSpinner
          className={twMerge("h-6 fill-white", loadingClassName)}
        />
      ) : (
        children
      )}
    </div>
  );
};
export default DivButton;
