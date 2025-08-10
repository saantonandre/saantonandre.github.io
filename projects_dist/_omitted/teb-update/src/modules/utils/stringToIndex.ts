export const stringToIndex = (string: string, max: number) =>
  [...string].reduce((prev, curr) => prev + curr.charCodeAt(0), 0) % max;
