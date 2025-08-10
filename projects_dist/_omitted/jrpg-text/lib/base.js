// @ts-check
/** @import {FC,StyleMap} from "./types" */

/** @type {Partial<StyleMap>} */
const defaultstyle = {};
/**
 * Sets default style for each element
 * @param {Partial<StyleMap>} styleMap
 */
export const setDefautStyle = (styleMap) => {
  for (const style in styleMap) {
    defaultstyle[style] = styleMap[style];
  }
};

/** @type {FC} */
export function c(tag, getParams) {
  const element = document.createElement(tag);
  return () => {
    const { props, style, children } = getParams();
    props && Object.keys(props).forEach((key) => (element[key] = props[key]));
    const allStyles = { ...defaultstyle[tag], ...style };
    Object.keys(allStyles).forEach(
      (key) => (element.style[key] = allStyles[key])
    );
    /**@type {Node[]} */
    const nodes = [];
    for (const child of children || []) {
      let value = child;
      if (typeof value === "function") value = value();
      if (typeof value === "number" || typeof value === "string") {
        const textNode = document.createTextNode(String(value));
        value = textNode;
      }
      if (value instanceof Node) nodes.push(value);
    }
    element.replaceChildren(...nodes);
    return element;
  };
}
/** Sets up the application by rendering the root element */
export function setup(/** @type {ReturnType<FC>} */ app) {
  window.addEventListener(
    "message",
    (e) => e.data === "rerender" && document.body.replaceChildren(app())
  );
  document.body.replaceChildren(app());
}

/** Sends an update message */
export function update() {
  postMessage("rerender");
}

/** Sample hook, used to manage state by using closures
 * @type {<T extends any>(x:T)=>[()=>T, (y:T)=>void]}
 */
export function useState(x) {
  return [() => x, (y) => (update(), (x = y))];
}
