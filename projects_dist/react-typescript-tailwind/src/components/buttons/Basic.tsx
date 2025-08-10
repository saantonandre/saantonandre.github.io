import LoadingSpinner from "components/others/LoadingSpinner";
import { twMerge } from "tailwind-merge";

type ButtonProps = React.DetailedHTMLProps<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
>;
export const BasicButton: React.FC<
  ButtonProps & { loading?: boolean; loadingClassName?: string }
> = ({ children, className, loading, loadingClassName, ...attributes }) => {
  return (
    <button
      className={twMerge(
        "bg-primary flex w-fit select-none items-center justify-center rounded-lg p-2 py-1 font-medium",
        "text-contrast hover:brightness-105 active:brightness-90 disabled:pointer-events-none disabled:opacity-60",
        className
      )}
      {...attributes}
      disabled={loading || attributes.disabled}
    >
      {loading ? (
        <LoadingSpinner className={twMerge("fill-white h-6", loadingClassName)} />
      ) : (
        children
      )}
    </button>
  );
};
export default BasicButton;
