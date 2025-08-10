import Player from "modules/actors/player";
import Camera from "modules/camera";
import GameCanvas from "modules/canvas";
import debug from "modules/debug";
import Entity from "modules/entity";
import Meta from "modules/meta";

const canvas = new GameCanvas();
const meta = new Meta();
const camera = new Camera();
const player = new Player(
  canvas.width / 2 / meta.tilesize / meta.ratio,
  canvas.height / 2 / meta.tilesize / meta.ratio,
  canvas,
  meta,
  camera
);
meta.ratio=3
export const initializeGame = () => {
  loop();
};
const entities: Entity[] = [player];
const renderBackground = (context: CanvasRenderingContext2D) => {
  for (let i = 0; i < meta.tilesWidth; i += 2) {
    for (let j = 0; j < meta.tilesWidth; j += 2) {
      context.drawImage(
        player.sheet,
        0 * meta.tilesize, // x pos of the sprite
        8 * meta.tilesize, // y pos of the sprite
        2 * meta.tilesize, // width of the sprite
        2 * meta.tilesize, // height of the sprite
        i * meta.tilesize * meta.ratio,
        j * meta.tilesize * meta.ratio,
        2 * meta.tilesize * meta.ratio,
        2 * meta.tilesize * meta.ratio
      );
    }
  }
};
const renderUi = (context: CanvasRenderingContext2D) => {
  context.drawImage(
    player.sheet,
    2 * meta.tilesize, // x pos of the sprite
    8 * meta.tilesize, // y pos of the sprite
    6 * meta.tilesize, // width of the sprite
    2 * meta.tilesize, // height of the sprite
    1 * meta.tilesize * meta.ratio,
    0.5 * meta.tilesize * meta.ratio,
    6 * meta.tilesize * meta.ratio,
    2 * meta.tilesize * meta.ratio
  );
};
const renderVed = (context: CanvasRenderingContext2D) => {
  context.drawImage(
    player.sheet,
    8 * meta.tilesize, // x pos of the sprite
    8 * meta.tilesize, // y pos of the sprite
    2 * meta.tilesize, // width of the sprite
    2 * meta.tilesize, // height of the sprite
    9 * meta.tilesize * meta.ratio,
    9 * meta.tilesize * meta.ratio,
    2 * meta.tilesize * meta.ratio,
    2 * meta.tilesize * meta.ratio
  );
};
const loop = () => {
  meta.compute();
  canvas.clear();
  for (const e of entities) {
    e.compute(meta.deltaTime, entities);
  }
  renderBackground(canvas.context);
  renderVed(canvas.context);
  for (const e of entities) {
    e.render(canvas.context, meta.tilesize, meta.ratio, camera);
  }
  renderUi(canvas.context);
  debug.render(canvas.context, meta.tilesize, meta.ratio, camera);
  requestAnimationFrame(loop);
};

export default initializeGame;
