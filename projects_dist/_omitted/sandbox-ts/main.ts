console.log(window.crossOriginIsolated);
const measure = <P extends any[], R extends any>(
  callback: (...args: P) => R
) => {
  return (...args: P): R => {
    const t0 = performance.now();
    const res = callback(...args);
    const t1 = performance.now() - t0;
    console.log(t1);
    return res;
  };
};
const sum = (...numbers: number[]) => numbers.reduce((a, c) => a + c, 0);
const a = measure(()=>0)()
