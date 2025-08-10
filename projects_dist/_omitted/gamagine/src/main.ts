import { TextCanvas } from "./modules/TextCanvas";
import { TextImage } from "./modules/TextImage";
import img from "./assets/sprite.png";
import { TextSpritesheet } from "./modules/TextSpritesheet";

const res = await TextImage.processSource(img);
const spritesheet = new TextSpritesheet(...res);

const canvas = new TextCanvas();
document.body.appendChild(canvas.target);

let frames = 0;
let i = 0;

const sprites = Array.from({ length: 8 }).map((_, i) => {
  return spritesheet.getSprite(0, i * 16, 16, 16);
});

const sprite = spritesheet.getSprite(0, 0, 16, 16);
canvas.drawAt(sprite, 50, 10);
canvas.render();

function loop() {
  frames++;
  if (frames % 4 === 0) {
    i++;
  }
  canvas.clear();
  // console.log(sprites[i%8])
  canvas.drawAt(sprites[i % 8], 0+frames, 10);
  // canvas.drawAt({ text: "helloooo", width: 10 }, 0 + frames, 10);
  canvas.render();
  // requestAnimationFrame(loop);
}
loop();
