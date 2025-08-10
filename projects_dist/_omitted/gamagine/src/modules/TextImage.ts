export class TextImage {
  static canvas = new OffscreenCanvas(0, 0);
  static context = this.canvas.getContext("2d")!;

  static async processSource(src: string) {
    const image = new Image();
    await new Promise((resolve) => {
      image.src = src;
      image.onload = resolve;
    });
    const { width, height } = image;
    Object.assign(this.canvas, { width, height });
    this.context.drawImage(image, 0, 0, width, height);
    const { data } = this.context.getImageData(0, 0, width, height);
    return [data, width] as const;
  }
}

// this.canvas.width = 0;
// this.canvas.height = 0;
