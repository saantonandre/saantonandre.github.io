/** Returns wether something is null  */
export function isNull<T>(data: T | null): data is null {
  return !isNotNull(data);
}
/** Returns wether something is null or undefined  */
export function isNullish<T>(
  object: T | null | undefined
): object is null | undefined {
  return !isNotNullish(object);
}
/** Returns wether something is not null  */
function isNotNull<T>(data: T | null): data is T {
  if (data !== null) return true;
  return false;
}
/** Returns wether something is not null or undefined  */
function isNotNullish<T>(object: T | null | undefined): object is T {
  if (["string", "number"].includes(typeof object)) return true;
  return !!object;
}
