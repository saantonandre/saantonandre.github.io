//@ts-check
/** @import {FCChild} from "../lib/types.js" */
import { c } from "../lib/base.js";

/**
 * @param {FCChild[]} children
 * @param {Partial<CSSStyleDeclaration>} style
 */
export const Container = (children = [], style = {}) => {
  return c("div", () => ({
    children: [...children],
    style: {
      boxSizing: "border-box",
      ...style,
    },
  }));
};
