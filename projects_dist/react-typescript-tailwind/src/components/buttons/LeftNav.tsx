import { twMerge } from "tailwind-merge";


export const LeftNavButton: React.FC<
  React.HTMLAttributes<HTMLDivElement> & { active: boolean }
> = ({ active, children, ...attributes }) => {
  return (
    <div
      role="button"
      className={twMerge(
        "select-none relative flex h-full min-h-[1.5rem] flex-row items-center justify-center font-semibold hover:text-primary-dark",
        active ? "text-primary" : "text-gray-700"
      )}
      {...attributes}
    >
      <div
        className={twMerge(
          "absolute left-0 m-auto w-0 rounded-r-lg bg-primary transition-all",
          active ? "h-full w-1" : "h-0"
        )}
      />
      <div className="px-2" />
      {children}
    </div>
  );
};
export default LeftNavButton;