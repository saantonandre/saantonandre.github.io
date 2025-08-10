import LoadingSpinner from "components/others/LoadingSpinner";
import { twMerge } from "tailwind-merge";

export const TransparentButton: React.FC<
  React.ButtonHTMLAttributes<HTMLButtonElement> & {
    loading?: boolean;
    loadingClassName?: string;
  }
> = ({ children, className, loading, loadingClassName, ...attributes }) => {
  return (
    <button
      className={twMerge(
        "flex w-fit select-none items-center justify-center rounded-lg bg-neutral bg-opacity-0 p-1 px-2 font-medium",
        "text-contrast2 transition-all hover:bg-opacity-75 hover:text-contrast disabled:text-contrast2/50",
        "disabled:hover:bg-opacity-30 outline-0",
        className
      )}
      {...attributes}
      disabled={loading || attributes.disabled}
    >
      {loading ? (
        <LoadingSpinner className={twMerge("fill-primary", loadingClassName)} />
      ) : (
        children
      )}
    </button>
  );
};
export default TransparentButton;
