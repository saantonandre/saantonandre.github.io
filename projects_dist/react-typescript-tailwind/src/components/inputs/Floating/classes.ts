import { twMerge } from "tailwind-merge";

export const classes = {
  inputC: twMerge(
    "peer z-10 w-full rounded-lg border bg-transparent p-2",
    " transition-all disabled:bg-slate-50 disabled:opacity-75"
  ),
  labelC: twMerge(
    "absolute left-2 transition-all peer-focus:-translate-y-2/3 peer-disabled:text-black",
    "peer-focus:z-10 peer-focus:top-1 text-slate-500 peer-focus:scale-75 peer-focus:bg-white peer-focus:text-primary"
  ),
};
export default classes;
