import Entity from "../../entity";

export class Scythe extends Entity {
  source: Entity;
  constructor(source: Entity) {
    super(source.x, source.y);
    this.rot = source.rot + 1;
    this.w = 4;
    this.h = 3;
    this.source = source;
    this.setAnimation("idle",[2],[0])
  }
  follow(deltaTime: number) {
    this.x += ((this.source.x + this.source.w / 2 - this.w / 2)-this.x)/3 * deltaTime;
    this.y += ((this.source.y + this.source.h / 2 - this.h / 2)-this.y)/3 * deltaTime;
    // Handle the case when the rot is back to 0
    // 3.14 / -3.14
    // add +1
    const target=this.source.rot+1;
    if(target - this.rot>Math.PI){
      this.rot+=Math.PI*2;
    }else if(target - this.rot<-Math.PI){      
      this.rot-=Math.PI*2;

    }else{
      this.rot += ((target - this.rot) / 12) * deltaTime;
    }
  }
  attack() {}
  render(
    context: CanvasRenderingContext2D,
    tilesize: number,
    ratio: number,
    camera?: {
      x: number;
      y: number;
    }
  ) {
    const pivot = {x:this.w/2,y:this.h/2}
    this.renderSprite(context, tilesize, ratio, camera,pivot);
  }
}
