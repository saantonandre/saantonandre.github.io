/**
 * Used to wait for {millis} amount of time
 * @remarks Do **NOT** use in production
 * @param millis Amount of milliseconds to wait
 * @returns Promise
 */
export const sleep = (millis: number): Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, millis));
};
