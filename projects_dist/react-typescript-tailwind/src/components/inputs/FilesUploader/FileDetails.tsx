import { XMarkIcon } from "@heroicons/react/24/outline";
import { formatByteSize } from "utils/formatByteSize";
import TransparentButton from "components/buttons/Transparent";
import { twMerge } from "tailwind-merge";

type Props = {
  file: File;
  remove: (file: File) => void;
} & React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLDivElement>,
  HTMLDivElement
>;
export const FileDetails: React.FC<Props> = ({
  file,
  remove,
  className,
  ...attributes
}) => {
  return (
    <div
      className={twMerge(
        "flex items-center justify-between gap-1 text-sm",
        className
      )}
      {...attributes}
    >
      <div
        title={file.name}
        className="flex-[5] overflow-hidden text-ellipsis whitespace-nowrap font-medium dark:text-slate-100"
      >
        {file.name}
      </div>
      <div
        title={file.size + " B"}
        className="flex-[2] grow whitespace-nowrap text-end text-xs"
      >
        {formatByteSize(file.size)}
      </div>
      <TransparentButton
        className="flex-1 bg-slate-100 text-slate-700"
        onClick={() => remove(file)}
      >
        <XMarkIcon className="h-4" />
      </TransparentButton>
    </div>
  );
};
export default FileDetails;
