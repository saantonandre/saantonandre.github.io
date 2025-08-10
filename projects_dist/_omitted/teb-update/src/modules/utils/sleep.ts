/**
 * Used to wait for {millis} amount of time
 * @remarks Do **NOT** use in production
 * @param time Amount of milliseconds to wait
 * @returns Promise
 */
export const sleep = (time: number) => {
  return new Promise<void>((resolve) => setTimeout(() => resolve(), time));
};