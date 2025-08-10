export const validationPatterns = {
  password: /(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{10,}/,
  email:
    /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/,
  ethAddress: /0x([a-z]|[A-Z]|[0-9]){40}/,
};

export function isValidAddress<T extends `0x${string}`>(
  value: any
): value is T {
  if (typeof value === "string")
    return validationPatterns.ethAddress.test(value);
  return false;
}

/**
 * @link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_expressions
 */
export const escapeRegexSyntax = (string?: string) => {
  if (!string) return string;
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
};
export const exactMatchRegex = (string?: string) => {
  const escapedString = escapeRegexSyntax(string);
  return new RegExp("^" + escapedString + "$");
};
