
export const EUR_DECIMALS = 2;

/**
 * Converts a value with decimal to a value without (as bigint)
 * eg. withoutDecimals(10.52, 4) => 105200
 */
export const withoutDecimals = (value: number, decimals: number = EUR_DECIMALS) => {
  return BigInt(Math.floor(value * 10 ** decimals));
};

/**
 * Converts a value to a real number, moving the decimal separator (as string)
 * eg. withDecimals(105200, 4) => "10.52"
 */
export const withDecimals = (value: number, decimals: number = EUR_DECIMALS) => {
  return (value / 10 ** decimals).toFixed(decimals);
};