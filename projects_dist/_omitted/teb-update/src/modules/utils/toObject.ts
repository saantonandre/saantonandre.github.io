export function toObject<K extends string | symbol | number, V>(
  entries: [K, V][]
) {
  return Object.fromEntries(entries) as Record<K, V>;
}
export function toEntries<
  K extends string | symbol | number,
  T extends Record<K, any>
>(object: T) {
  return Object.entries(object) as [K, T[K]][];
}
