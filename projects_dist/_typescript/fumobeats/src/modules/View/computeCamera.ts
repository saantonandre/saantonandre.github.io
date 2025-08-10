import { View } from "./View";
const TOLERANCE = 0.001;
/** Updates the camera position of a view */
export function computeCamera(view: View, deltaTime: number) {
  const viewFocus = view.getFocusPoint();
  const xTarget = viewFocus.x - view.w / 2;
  const yTarget = viewFocus.y - view.h / 2;
  const xDelta = xTarget - view.x;
  const yDelta = yTarget - view.y;
  if (Math.abs(xDelta) + Math.abs(yDelta) > TOLERANCE) {
    view.x += xDelta * view.transitionSpeed * deltaTime;
    view.y += yDelta * view.transitionSpeed * deltaTime;
  }
  if (view.shake) {
    view.shakeOffset.x = Math.random() / 2 - 0.25;
    view.shakeOffset.y = Math.random() / 2 - 0.25;
    view.x += view.shakeOffset.x;
    view.y += view.shakeOffset.y;
    view.shake -= deltaTime;
  }
  if (view.shake <= 0) {
    view.shake = 0;
    view.shakeOffset.x = 0;
    view.shakeOffset.y = 0;
    return;
  }
}
