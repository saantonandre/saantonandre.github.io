export const shorten = (input: any, maxLength = 20) => {
  const string = String(input);
  if (string.length < maxLength) return string;
  return string.slice(0, maxLength - 3) + "...";
};
export const shortenAddress = (address: string, amounts = 6) => {
  return (
    address.slice(0, amounts) +
    "..." +
    address.slice(address.length - amounts, address.length)
  );
};
