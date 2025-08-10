import Player from "modules/actors/player";
import Camera from "modules/camera";
import GameCanvas from "modules/canvas";
import debug from "modules/debug";
import Entity from "modules/entity";
import { Stacked } from "modules/entity/Stacked";
import Meta from "modules/meta";
import { distance, getAngle } from "modules/physics";

const canvas = new GameCanvas();
const meta = new Meta(canvas);
//@ts-ignore
window.meta = meta;
const camera = new Camera();
const player = new Player(
  canvas.width / 2 / meta.tilesize / meta.ratio,
  canvas.height / 2 / meta.tilesize / meta.ratio,
  canvas,
  meta,
  camera
);
camera.focus = player;
export const initializeGame = () => {
  loop();
};
const entities: Entity[] = [
  player,
  new Stacked(5, 2),
  new Stacked(15, 22),
  new Stacked(1, 8),
  new Stacked(7, 20),
  new Stacked(3, 8),
  new Stacked(9, 9),
  new Stacked(2, 5),
  new Stacked(16, 8),
  new Stacked(14, 3),
  new Stacked(18, 12),
];
const loop = () => {
  meta.compute();
  canvas.clear();
  // canvas.context.save();
  // canvas.context.translate(
  //   (camera.x + player.x - meta.tilesWidth / 2) * meta.tilesize * meta.ratio,
  //   (camera.y + player.y - meta.tilesHeight / 2) * meta.tilesize * meta.ratio
  // );
  // canvas.context.rotate(-player.rot);
  // canvas.context.restore();
  for (const e of entities) {
    e.compute(meta.deltaTime, entities);
  }
  camera.compute(meta);
  debug.render(canvas.context, meta.tilesize, meta.ratio, camera);
  const pCenter = player.centerPoint;
  for (const e of entities) {
    const eCenter = e.centerPoint;
    const angle = getAngle({
      x1: pCenter.x,
      y1: pCenter.y,
      x2: eCenter.x,
      y2: eCenter.y,
    });
    const dist = -distance(pCenter, eCenter);
    const pivot = { x: Math.cos(angle) * dist, y: Math.sin(angle) * dist };
    e !== player&&debug.drawLine(pCenter, eCenter);
    
    e.render(
      canvas.context,
      meta.tilesize,
      meta.ratio,
      camera,
      e !== player ? pivot : undefined
    );
  }
  requestAnimationFrame(loop);
};

export default initializeGame;
