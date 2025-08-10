import "./styles/index.css";
import { canvas, c, clear } from "./modules/canvas";
import { meta, Meta } from "./modules/meta";
import {Player} from "./modules/actors/player"

const entities: EntityLike[] = [];
console.log(entities)
// configuring meta variables
meta.tilesize=32;
meta.ratio=1;
const camera = { x: 0, y: 0 };

entities.push(new Player(5, 5,canvas,meta,camera));

const loop = (meta: Meta) => {
  clear();
  meta.compute()
  for (const entity of entities) {
    entity.compute(meta.deltaTime);
  }
  for (const entity of entities) {
    entity.render(c, meta.tilesize, meta.ratio, camera);
  }
  meta.compute();
  requestAnimationFrame(() => loop(meta));
};

loop(meta)
