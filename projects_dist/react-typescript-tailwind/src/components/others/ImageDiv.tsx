import BasicModal from "components/modals/Basic";
import { useEffect, useState } from "react";
import { twMerge } from "tailwind-merge";

type ImageProps = React.DetailedHTMLProps<
  React.ImgHTMLAttributes<HTMLImageElement>,
  HTMLImageElement
>;
type Props = {
  placeholder?: string;
  withModal?: boolean;
  imageClassName?: string;
  containerClassName?: string;
  src: string | null | undefined;
} & Omit<ImageProps, "src">;

export const ImageDiv: React.FC<Props> = ({
  className,
  src,
  placeholder,
  title,
  withModal,
  imageClassName,
  containerClassName,
  ...attributes
}) => {
  const [open, setOpen] = useState(false);
  const [valid, setValid] = useState(false);
  useEffect(() => {
    setValid(false);
  }, [src]);
  return (
    <>
      <div
        className={twMerge(
          "shrink-0 overflow-hidden",
          withModal && valid && "cursor-zoom-in",
          className,
          containerClassName
        )}
        role={"img"}
        onClick={valid ? () => setOpen(true) : undefined}
      >
        <InnerImage
          className={twMerge(className, "h-full w-full", imageClassName)}
          {...{ ...attributes, src, setValid, valid, placeholder }}
        />
      </div>
      {withModal && (
        <BasicModal
          open={valid && open}
          title={title}
          close={() => setOpen(false)}
          outmostClassName="fixed"
          closableOnOverlayClick
        >
          <div className={"min-h-[300px] w-full"}>
            <InnerImage
              preview
              {...{
                ...attributes,
                src,
                className,
                setValid,
                valid,
                placeholder,
              }}
            />
          </div>
        </BasicModal>
      )}
    </>
  );
};

const InnerImage: React.FC<
  {
    preview?: boolean;
    valid: boolean;
    setValid: React.Dispatch<React.SetStateAction<boolean>>;
    placeholder?: string;
    src: ImageProps["src"] | null | undefined;
  } & Omit<ImageProps, "src">
> = ({
  preview = false,
  setValid,
  valid,
  placeholder,
  className,
  src,
  ...attributes
}) => {
  useEffect(() => {
    const image = new Image();
    image.src = String(src);
    image.onload = () => setValid(true);
    image.onerror = () => setValid(false);
  }, [src, setValid]);
  return (
    <img
      className={twMerge(
        "object-cover",
        preview ? "h-full w-full rounded-2xl object-contain" : className
      )}
      alt="placeholder"
      src={valid ? String(src) : placeholder}
      onLoadedMetadata={(e) => {
        // console.log("loaded metadata")
      }}
      {...attributes}
    />
  );
};
export default ImageDiv;
