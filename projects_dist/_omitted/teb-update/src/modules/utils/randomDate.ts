/**
 *
 * @param range Range of randomness in milliseconds (1 day is 84_400_000)
 * @param relative
 * @returns
 */
export const randomDate = (
  range: number = 84_400_000,
  timeFrame?: "future" | "past"
) => {
  const now = Date.now();
  const distance = (Math.random() * (range * 2) - range) | 0;
  if (!timeFrame) {
    return now + distance;
  }
  return (
    now + (timeFrame === "future" ? Math.abs(distance) : -Math.abs(distance))
  );
};
