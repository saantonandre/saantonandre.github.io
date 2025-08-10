import { DocumentPlusIcon } from "@heroicons/react/24/outline";
import ImageDiv from "components/others/ImageDiv";
import { useState } from "react";
import { twMerge } from "tailwind-merge";

type Props = {
  /** Needed to make the image available to the parents of this component */
  image: File | null;
  className?: string;
  imageClassName?: string;
  inputProps?: React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>,HTMLInputElement>;
  /** The image setter, needed to make changes to the image value */
  setImage: (image: File | null) => void;
  innerRef?: React.Ref<HTMLInputElement>;
  onImageChange?: (image: File) => void;
  src?: string | null;
  alt?: string;
  withModal?: boolean;
} & React.HTMLAttributes<HTMLLabelElement>;

export const ImageDivInput: React.FC<Props> = ({
  className,
  imageClassName,
  image,
  alt,
  inputProps,
  setImage,
  onImageChange,
  withModal,
  innerRef,
  placeholder="assets/images/image-placeholder.png",
  src,
  onChange,
  ...attributes
}) => {
  const [imageURL, setImageURL] = useState<string | null>(null);
  const [hovered, setHovered] = useState<boolean>(false);
  return (
    <label
      role="button"
      className={twMerge(
        "relative select-none overflow-hidden ",
        hovered && "border-dashed border-gray-400",
        className
      )}
      onDragOver={(e)=>e.preventDefault()}
      onDrop={(evt) => {
        evt.preventDefault();
        const file = evt.dataTransfer.files.item(0);
        if (!file) return;
        if (file.type.split("/")[0] !== "image")
          return alert("Non è un'immagine");
        setImage(file);
        setImageURL(URL.createObjectURL(file));
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
      {...attributes}
    >
      <ImageDiv
        src={imageURL || src || placeholder}
        className={twMerge("h-full w-full object-cover",imageClassName)}
        placeholder={placeholder}
        alt={alt}
        withModal={withModal}
      />

      <input
        className="absolute bottom-0 h-[1px] w-full opacity-0 "
        type="file"
        accept="image/*"
        name="image"
        ref={innerRef}
        onChange={(evt) => {
          const file = evt.target.files?.item(0);
          if (!file) return;
          setImage(file);
          setImageURL(URL.createObjectURL(file));
          onImageChange?.(file);
        }}
        {...inputProps}
      />
      <div
        className={
          "absolute bottom-0 hidden w-full text-center text-slate-700 opacity-50 peer-invalid:block"
        }
      >
        Nessuna immagine selezionata
      </div>
      <div
        className={twMerge(
          "absolute top-0 bottom-0 left-0 right-0 z-10 text-white transition-all",
          "flex items-center justify-center bg-black opacity-0 hover:opacity-40"
        )}
      >
        <DocumentPlusIcon className="h-8" />
      </div>
    </label>
  );
};

export default ImageDivInput;
