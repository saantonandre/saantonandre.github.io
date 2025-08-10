// @ts-check

/**
 * @typedef {string|number} Value
 * @typedef  {(Value|ValueList)[]} ValueList
 * @typedef {ValueList[number]|(()=>ValueList[number])} Renderable
 */

/** Renders a `Renderable` element */
export const render = (/** @type {Renderable} */ renderable) => {
  if (typeof renderable === "string" || typeof renderable === "number") {
    return String(renderable);
  }
  if (typeof renderable === "function") {
    return render(renderable());
  }
  return `[ ${renderable.map((child) => render(child)).join(", ")} ]`;
};

/** Sets up the application by rendering the root element */
export const setup = (/** @type {Renderable} */ app) => {
  window.addEventListener(
    "message",
    (e) => e.data === "rerender" && (document.body.innerHTML = render(app))
  );
  document.body.innerHTML = render(app);
};

/** Sends an update message */
export const update = () => postMessage("rerender");

/** Sample hook, used to manage state by using closures */
/** @type {<T extends any>(x:T)=>[()=>T, (y:T)=>void]} */
export const useState = (x) => [() => x, (y) => (update(), (x = y))];
