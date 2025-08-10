// This function resizes an image to a square of a given size
export function resizeImage(inputImage: HTMLImageElement, maxSize: number) {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d")!;
  canvas.width = maxSize;
  canvas.height = maxSize;
  const imageAspectRatio = inputImage.width / inputImage.height;
  let scaledImageWidth = maxSize;
  let scaledImageHeight = maxSize;
  if (imageAspectRatio > 1) {
    scaledImageHeight = maxSize / imageAspectRatio;
  } else {
    scaledImageWidth = maxSize * imageAspectRatio;
  }
  ctx.drawImage(
    inputImage,
    (maxSize - scaledImageWidth) / 2,
    (maxSize - scaledImageHeight) / 2,
    scaledImageWidth,
    scaledImageHeight
  );
  return canvas.toDataURL();
}
