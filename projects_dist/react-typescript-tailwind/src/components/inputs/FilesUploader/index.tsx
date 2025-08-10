import FileDetails from "components/inputs/FilesUploader/FileDetails";
import { useState } from "react";
import { twMerge } from "tailwind-merge";

type Props = {
  files: File[];
  setFiles: (files: File[]) => void;
} & React.DetailedHTMLProps<
  React.InputHTMLAttributes<HTMLInputElement>,
  HTMLInputElement
>;
export const FileUploader: React.FC<Props> = ({
  files,
  setFiles,
  className,
  ...inputAttributes
}) => {
  const [hovered, setHovered] = useState(false);

  const addFiles = (fileList: FileList) => {
    const inputFiles: File[] = [];
    for (let i = 0; i < fileList.length; i++) {
      const fileItem = fileList.item(i);
      if (!fileItem) {
        continue;
      }
      if (
        !files.find((f) => {
          const nameEqual = f.name === fileItem.name;
          const sizeEqual = f.size === fileItem.size;
          return nameEqual && sizeEqual;
        })
      ) {
        inputFiles.push(fileItem);
      }
    }
    const updatedFiles = files.concat(...inputFiles);
    setFiles(updatedFiles);
  };

  return (
    <>
      <div className={twMerge("flex gap-2", className)}>
        <label
          role="button"
          className={twMerge(
            "relative flex h-40 w-full flex-1 select-none flex-col items-center justify-center gap-3",
            "group rounded-2xl border-2 border-purple-500 p-2  text-purple-500 transition-all ",
            "hover:border-purple-400 hover:text-purple-400",
            hovered &&
              "border-dashed border-purple-400 text-purple-400 [&>*]:pointer-events-none"
          )}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(evt) => {
            evt.preventDefault();
            const fileList = evt.dataTransfer.files;
            if (!fileList) return;
            addFiles(fileList);
            setHovered(false);
          }}
          onDragEnter={(evt) => {
            evt.preventDefault();
            setHovered(true);
          }}
          onDragLeave={(evt) => {
            evt.preventDefault();
            setHovered(false);
          }}
        >
          <input
            className="hidden"
            name="files-uploader"
            type="file"
            multiple
            onChange={(e) => {
              const fileList = e.target.files;
              if (!fileList) return;
              addFiles(fileList);
              e.target.value = "";
            }}
            {...inputAttributes}
          />
          <span
            className={twMerge(
              "bg-clip-text text-center font-bold text-transparent transition-all hover:bg-[length:150%_150%] bg-center hover:scale-105",
              "dark:from-purple-400 dark:to-pink-400"
            )}
          >
            Clicca qui o trascina un file per aggiungere alla selezione
          </span>
        </label>
        <div className="flex flex-col flex-1 h-40 min-w-0 overflow-hidden text-purple-500 border-2 border-purple-500 rounded-xl">
          <div
            className={
              "sticky top-0 rounded-t-lg bg-purple-500 p-1 px-2 text-white "
            }
          >
            File selezionati ({files.length}):
          </div>
          <div className="flex flex-col gap-1 p-1 px-2 hover-scrollbar grow">
            {files.map((file, i) => (
              <FileDetails
                key={i}
                file={file}
                className="border-b border-slate-300 text-slate-400 dark:text-slate-300 dark:border-slate-600"
                remove={(file) => {
                  setFiles(
                    files.filter((f) => {
                      const nameEqual = f.name === file.name;
                      const sizeEqual = f.size === file.size;
                      return !(nameEqual && sizeEqual);
                    })
                  );
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </>
  );
};
export default FileUploader;
