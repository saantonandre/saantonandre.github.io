/**
 * @param length Amount of random characters to generate
 * @returns
 */
export const randomString = (length: number) => {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let generatedString = "";
  for (let i = 0; i < length; i++) {
    generatedString += chars[(Math.random() * chars.length) | 0];
  }
  return generatedString;
};
export const randomAddress = () => `0x${randomString(40)}`;
