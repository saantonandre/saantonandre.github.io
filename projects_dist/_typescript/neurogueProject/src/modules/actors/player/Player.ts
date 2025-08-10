import { Entity, Sprite } from "../../entity";
import { Controls } from "../../controls";
import { Mouse, MetaLike, CameraLike } from "../../mouse";
import debug from "modules/debug";
import Sword, { OffsetPositioning } from "modules/actors/player/Sword";
export class Player extends Entity {
  controls: Controls;
  mouse: Mouse;
  mantle: Sprite;
  skirt: Sprite;
  swords: Sword[];
  swordsOffsets: ReturnType<typeof swordOffsets>;
  stance: string;
  constructor(
    x: number,
    y: number,
    canvas: HTMLCanvasElement,
    meta: MetaLike,
    camera: CameraLike
  ) {
    super(x, y);
    this.stance = "idle";
    this.inertia = 0.8;
    this.swordsOffsets = swordOffsets(this);
    this.swords = [
      new Sword(this, { ...this.swordsOffsets["idle"][0] }),
      new Sword(this, { ...this.swordsOffsets["idle"][1] }),
    ];
    this.mouse = new Mouse(canvas, meta, camera);
    this.controls = new Controls();
    this.w = 2;
    this.h = 2;
    this.setAnimation("idle", [0], [0]);
    this.prevPos = [];
    this.mantle = new Sprite(this.x, this.y);
    this.mantle.w = 2;
    this.mantle.h = 2;
    this.mantle.setAnimation("idle", [0], [2]);

    this.skirt = new Sprite(this.x, this.y);
    this.skirt.w = 2;
    this.skirt.h = 2;
    this.skirt.setAnimation("idle", [0], [4]);
  }
  resolveInputs = () => {
    this.stance = "idle";
    this.swords.forEach((s) => s.loadAnimation("idle"));
    if (this.controls.rClickDown && this.stance !== "defend") {
      this.swords[0].offsetPositioning = {
        ...this.swordsOffsets["attack0"][0],
      };
      this.swords[1].offsetPositioning = {
        ...this.swordsOffsets["attack0"][1],
      };
      this.swords[0].loadAnimation("attack");
      this.stance = "attack0";
    }
    if (this.controls.lClickDown && this.stance !== "defend") {
      this.swords[0].offsetPositioning = {
        ...this.swordsOffsets["attack1"][0],
      };
      this.swords[1].offsetPositioning = {
        ...this.swordsOffsets["attack1"][1],
      };
      this.swords[1].loadAnimation("attack");
      this.stance = "attack1";
    }
    if (this.controls.lClickDown && this.controls.rClickDown) {
      this.swords[0].offsetPositioning = { ...this.swordsOffsets["defend"][0] };
      this.swords[1].offsetPositioning = { ...this.swordsOffsets["defend"][1] };
      this.swords.forEach((s) => s.loadAnimation("defend"));
      this.stance = "defend";
    }
    if (
      this.stance === "idle" &&
      this.swords[0].offsetPositioning.x() !== this.swordsOffsets["idle"][1].x()
    ) {
      this.swords[0].offsetPositioning = {
        ...this.swordsOffsets["idle"][0],
      };
      this.swords[1].offsetPositioning = {
        ...this.swordsOffsets["idle"][1],
      };
    }
    [this, this.mantle, this.swords[0], this.swords[1], this.skirt].forEach(
      (e) => (e.trackPos = false)
    );
    if (this.controls.e) {
      [this, this.mantle, this.swords[0], this.swords[1], this.skirt].forEach(
        (e) => (e.trackPos = true)
      );
      this.xVelExt = Math.cos(this.rot) * 0.6;
      this.yVelExt = Math.sin(this.rot) * 0.6;
    } else if (!this.xVelExt && !this.yVelExt) {
      [this, this.mantle, this.swords[0], this.swords[1], this.skirt].forEach(
        (e) => {
          e.trackPos = false;
        }
      );
    }

    // Moves
    if (this.controls.left && !this.controls.right && !this.col.L) {
      this.xVel = -this.speed;
      this.left = 1;
    } else if (this.xVel < 0) {
      this.xVel = 0;
    }
    if (this.controls.right && !this.controls.left && !this.col.R) {
      this.xVel = this.speed;
      this.left = 0;
    } else if (this.xVel > 0) {
      this.xVel = 0;
    }
    if (this.controls.up && !this.controls.down && !this.col.B) {
      this.yVel = -this.speed;
    } else if (this.yVel < 0) {
      this.yVel = 0;
    }
    if (this.controls.down && !this.controls.up && !this.col.T) {
      this.yVel = this.speed;
    } else if (this.yVel > 0) {
      this.yVel = 0;
    }
    if (
      !this.controls.left &&
      !this.controls.right &&
      !this.controls.up &&
      !this.controls.down
    ) {
      this.xVel = 0;
      this.yVel = 0;
    }
    if (
      +this.controls.left +
        +this.controls.right +
        +this.controls.up +
        +this.controls.down >
      1
    ) {
      this.xVel /= 1.42;
      this.yVel /= 1.42;
    }
  };
  compute = (deltaTime: number) => {
    this.rot =
      this.Physics.getAngle({
        x1: this.x + this.w / 2,
        y1: this.y + this.h / 2,
        x2: this.mouse.x,
        y2: this.mouse.y,
      }) +
      Math.PI * 2;
    this.resolveInputs();
    this.updateVelocities(deltaTime);
    this.updatePosition(deltaTime);
    this.updateHitbox();

    this.swords[0].follow(deltaTime);
    this.swords[1].follow(deltaTime);
    this.updatePropPosition(this.mantle, deltaTime, 3);
    this.updatePropPosition(this.skirt, deltaTime, 5);

    debug.inspect(this);
    debug.drawPoint(this.centerPoint);
    debug.drawPoint(this.mouse, "green");
    debug.drawLine(this.centerPoint, this.mouse, "pink");
  };
  render = (
    context: CanvasRenderingContext2D,
    tilesize: number,
    ratio: number,
    camera?: {
      x: number;
      y: number;
    }
  ) => {
    if (this.prevPos.length) {
      if(this.controls.e){
        context.filter="brightness(50%)"
      }
      const pivot = { x: this.w / 2, y: this.h / 2 };
      [this.skirt, this.mantle, this.swords[0], this.swords[1], this].forEach(
        (sprite) => {
          sprite.prevPos.forEach((pos,i) => {
            sprite.renderSprite(context, tilesize, ratio, camera, pivot, pos);
            pos.opacity-=0.03
            if(pos.opacity<=0){
              sprite.prevPos.splice(i,1)
            }
          });
        }
      );
    }
    this.skirt.renderSprite(context, tilesize, ratio, camera);
    this.mantle.renderSprite(context, tilesize, ratio, camera);
    this.renderArm(this.swords[0],context, tilesize, ratio, camera)
    this.renderArm(this.swords[1],context, tilesize, ratio, camera)
    this.swords[0].renderSprite(context, tilesize, ratio, camera);
    this.swords[1].renderSprite(context, tilesize, ratio, camera);
    this.renderSprite(context, tilesize, ratio, camera);
    context.fillStyle = "red";
    context.fillStyle = "black";
    context.filter="none"
  };
  private updatePropPosition = (
    sprite: Sprite,
    deltaTime: number,
    offset: number = 5
  ) => {
    sprite.updateSprite(deltaTime);
    sprite.x +=
      ((this.x + this.w / 2 - sprite.w / 2 - sprite.x) / offset) * deltaTime;
    sprite.y +=
      ((this.y + this.h / 2 - sprite.h / 2 - sprite.y) / offset) * deltaTime;
    const target = this.rot;
    if (target - sprite.rot > Math.PI) {
      sprite.rot += Math.PI * 2;
    } else if (target - sprite.rot < -Math.PI) {
      sprite.rot -= Math.PI * 2;
    } else {
      sprite.rot += ((target - sprite.rot) / offset) * deltaTime;
    }
  };
  private renderArm = (
    sword:Sword,
    context: CanvasRenderingContext2D,
    tilesize: number,
    ratio: number,
    camera: { x: number; y: number } = { x: 0, y: 0 },
  ) => {
    context.beginPath();
    const prot=sword===this.swords[0]?Math.PI-Math.PI/4:-Math.PI+Math.PI/4;
    const pcos=Math.cos(this.rot+prot)*0.5;
    const psin=Math.sin(this.rot+prot)*0.5;
    context.moveTo(
      (this.centerPoint.x +pcos + camera.x) * tilesize * ratio,
      (this.centerPoint.y +psin  + camera.y) * tilesize * ratio
    );
    const srot=Math.PI-Math.PI/4
    const scos=Math.cos(sword.rot+srot)*0.5;
    const ssin=Math.sin(sword.rot+srot)*0.5;
    context.lineTo(
      (sword.centerPoint.x +scos + camera.x) * tilesize * ratio,
      (sword.centerPoint.y +ssin + camera.y) * tilesize * ratio
    );
    context.closePath();
    context.strokeStyle = "#f5a097";
    context.lineWidth=8;
    context.stroke();
    context.strokeStyle = "#fef3c0";
    context.lineWidth=4;
    context.stroke();

  };
}
export default Player;
const swordOffsets = (source: Entity) =>
  ({
    idle: [
      {
        x: () => Math.cos(source.rot + 1.5),
        y: () => Math.sin(source.rot + 1.5),
        rot: () => Math.PI / 2,
        delay: () => 8,
      },
      {
        x: () => Math.cos(source.rot - 1.5),
        y: () => Math.sin(source.rot - 1.5),
        rot: () => Math.PI * 2,
        delay: () => 8,
      },
    ],
    defend: [
      {
        x: () => Math.cos(source.rot + 0.3) * 0.9,
        y: () => Math.sin(source.rot + 0.3) * 0.9,
        rot: () => -0.3,
        delay: () => 3,
      },
      {
        x: () => Math.cos(source.rot - 0.3) * 0.9,
        y: () => Math.sin(source.rot - 0.3) * 0.9,
        rot: () => Math.PI / 2 + 0.3,
        delay: () => 3,
      },
    ],
    attack0: [
      {
        x: () => Math.cos(source.rot) * 1.7,
        y: () => Math.sin(source.rot) * 1.7,
        rot: () => Math.PI / 4,
        delay: () => 3,
      },
      {
        x: () => Math.cos(source.rot - 2) * 0.8,
        y: () => Math.sin(source.rot - 2) * 0.8,
        rot: () => Math.PI * 2,
        delay: () => 5,
      },
    ],
    attack1: [
      {
        x: () => Math.cos(source.rot + 2) * 0.8,
        y: () => Math.sin(source.rot + 2) * 0.8,
        rot: () => Math.PI / 2,
        delay: () => 5,
      },
      {
        x: () => Math.cos(source.rot) * 1.7,
        y: () => Math.sin(source.rot) * 1.7,
        rot: () => Math.PI / 4,
        delay: () => 3,
      },
    ],
  } as const);
