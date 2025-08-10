/** Transforms a byte size number into human readable */
export const formatByteSize = (size: number): string => {
  const sizes: [number, string][] = [
    [1024 ** 3, "GB"],
    [1024 ** 2, "MB"],
    [1024, "KB"],
    [1, "B"],
  ];
  const targetSize = sizes.find(([sz]) => size > sz) || sizes[sizes.length - 1];

  return (size / targetSize[0]).toFixed(2) + " " + targetSize[1];
};
