import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import TransparentButton from "components/buttons/Transparent";
import { useState } from "react";
import { twMerge } from "tailwind-merge";

type Props = {
  /** Array of images srcs */
  images: string[];
  className?: string;
};
export const ImagesCarousel: React.FC<Props> = ({ images, className }) => {
  const [current, setCurrent] = useState(0);
  const nextImage = () => {
    setCurrent((prev) => (prev + 1 >= images.length ? prev : prev + 1));
  };
  const prevImage = () => {
    setCurrent((prev) => (prev - 1 < 0 ? prev : prev - 1));
  };
  return (
    <div
      className={twMerge(
        "flex w-full flex-col justify-center gap-4",
        className
      )}
    >
      <div className="relative w-full max-h-full overflow-hidden aspect-square rounded-xl">
        <div className="w-full h-full">
          <img
            alt="Map images"
            src={images[current]}
            className="object-cover w-full h-full"
          />
          {/** Carousel controls */}
          {images.length > 1 && (
            <div className="absolute inset-0 flex items-center justify-between h-full px-2 pt-8">
              <TransparentButton
                className="px-1 bg-opacity-20 text-contrast"
                onClick={prevImage}
              >
                <ChevronLeftIcon className="h-6" />
              </TransparentButton>
              <div>
                <TransparentButton
                  className="px-1 bg-opacity-20 text-contrast"
                  onClick={nextImage}
                >
                  <ChevronRightIcon className="h-6" />
                </TransparentButton>
              </div>
            </div>
          )}
        </div>
      </div>

      {/** Carousel diamonds  */}
      {images.length > 1 &&<div className="flex items-center justify-center h-3 gap-2">
        {images.map((_src, i) => (
          <div
            key={i}
            className="flex items-center justify-center"
            role="button"
            onClick={() => setCurrent(i)}
          >
            <div
              className={twMerge(
                "h-2 w-2 rotate-45 border border-contrast2 transition-all",
                i === current && "h-3 w-3 bg-contrast"
              )}
            />
          </div>
        ))}
      </div>}
    </div>
  );
};
