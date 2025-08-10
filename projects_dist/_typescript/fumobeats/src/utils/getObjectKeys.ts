export const getObjectKeys = <T extends Record<K, any>, K extends keyof T>(
  obj: T
) => {
  return Object.keys(obj) as K[];
};
