// Creates the canvas element and exports it
export const canvas = document.createElement("canvas");
document.body.appendChild(canvas);

canvas.width = 800;
canvas.height = 600;

/** Prevents right clicks menu from appearing on the canvas */
canvas.oncontextmenu = function (event) {
  event.preventDefault();
};
/** Moves the canvas to the center by giving it an offset to the top/left sides */
function center(element: HTMLCanvasElement) {
  element.style.position = "absolute";
  element.style.left = (window.innerWidth - element.width) / 2 + "px";
  element.style.top = (window.innerHeight - element.height) / 2 + "px";
}
// Center the canvas at runtime
center(canvas);

/** Calls the centerCanvas function every time the window size changes */
window.addEventListener("resize", () => center(canvas));

// Exports the drawing context
/** Canvas drawing context */
export const c = canvas.getContext("2d")!;
// Disables anti aliasing
c.imageSmoothingEnabled = false;

// Clears the canvas (gets called every frame before drawing)
export function clear ( ) {
  c.clearRect(0, 0, canvas.width, canvas.height);
};
