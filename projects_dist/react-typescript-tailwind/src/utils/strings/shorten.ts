export const shorten = (input: any, maxLength = 20) => {
  const string = String(input);
  if (string.length < maxLength) return string;
  return string.slice(0, maxLength - 3) + "...";
};
