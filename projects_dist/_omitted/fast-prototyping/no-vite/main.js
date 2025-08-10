class View {
  tilesize = 16;
  ratio = 2;
  constructor(canvas) {
    this.canvas = canvas;
    this.context = canvas.getContext("2d");
  }
}

export class World {
  entities = [];
  constructor(canvas){
    this.view = new View(canvas);
  }

  loop = () => {
    for(const entity of this.entities){
      entity.update(this)
    }
    for(const entity of this.entities){
      entity.render(this)
    }
    requestAnimationFrame(this.loop);
  };
}
