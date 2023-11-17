class Color {
  constructor(values = [1, 1, 1]) {
    this.values = values;
  }
  /**
   * @param {Color} color
   */
  equals(color) {
    return !(
      this.values[0] !== color.values[0] ||
      this.values[1] !== color.values[1] ||
      this.values[2] !== color.values[2]
    );
  }

  /**
   * @param {Uint8ClampedArray} imageData
   * @param {Number} index
   */
  put(imageData, index) {
    imageData.splice(index, this.values.length, this.values);
  }
  /** Replaces the color's values */
  reset(values = [1, 1, 1]) {
    this.values = values;
  }
  print() {
    return (
      "rgb(" +
      this.values[0] +
      "," +
      this.values[1] +
      "," +
      this.values[2] +
      ")"
    );
  }
}
let counter = 0;

class ImageProcessor {
  constructor() {
    this.canvas = document.getElementById("canvas");
    this.canvas.style.imageRendering = "pixelated";
    this.ctx = this.canvas.getContext("2d");
    this.img = new Image();

    /** @type {ImageData}*/
    this.imageData;

    this.cache = [new Color(), new Color(), new Color(), new Color()];
    document.body.appendChild(this.canvas);
    console.log("Initialization complete");
  }
  init = () => {
    this.ctx.drawImage(this.img, 0, 0, this.img.width, this.img.height);
    this.imageData = this.ctx.getImageData(
      0,
      0,
      this.img.width,
      this.img.height
    );
    start();
  };
  loadImage = async (imagePath) => {
    console.log(`loading image ${imagePath}`);
    this.img = new Image();
    this.img.src = imagePath;
    const { w, h } = await new Promise((resolve) => {
      this.img.onload = (e) => {
        console.log(e.target.width, e.target.height);
        resolve({ w: e.target.width, h: e.target.height });
      };
    });
    this.canvas.width = w;
    this.canvas.height = h;
    if (w > 1000 || h > 1000) {
      const confirmImage = confirm(
        `Caution, the image is very large (${w}x${h})\nOnce you start processing it, the page may go unresponsive for some time. Is it fine?`
      );
      if (confirmImage) {
        this.init();
      }
    } else {
      this.init();
    }
  };
  resetCache() {
    this.cache.forEach((color) => color.reset());
  }
  /** @param {Color} color */
  toColor(color) {
    let newImageData = this.ctx.createImageData(this.imageData);
    if (this.imageData.data.length == 0) {
      console.warn("No image data!");
      return this.imageData;
    }
    let currentColor = new Color();
    let data = this.imageData.data;
    for (let i = 4; i < data.length; i += 4) {
      currentColor.reset(data.slice(i, i + 3));
      if (currentColor.equals(color)) {
        this.putColor(newImageData, color, i);
      }
    }
    console.log("Displaying only color: " + color.print());
    return newImageData;
  }
  toCanvas(imageData = this.imageData) {
    viewResult(true);
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.putImageData(imageData, 0, 0);
    console.log("Printed to canvas");
  }
  /**
   * @param {ImageData} imageData
   * @param {Color} color
   * @param {Number} index
   */
  putColor(imageData, color, index) {
    imageData.data[index] = color.values[0];
    imageData.data[index + 1] = color.values[1];
    imageData.data[index + 2] = color.values[2];
    imageData.data[index + 3] = 255;
    //imageData.data.splice(index, index + color.values.length, color.values);
  }
  arrayEquals = (a, b) =>
    a.length === b.length && a.every((v, i) => v === b[i]);
  /**
   *
   * @param {Numbers[][][]} patterns
   * @param {any} color
   * @param {ImageData} newImageData
   * @param {ImageData} imageData
   * @returns
   */
  findPattern(
    patterns,
    color = "any",
    newImageData = this.ctx.createImageData(
      this.canvas.width,
      this.canvas.height
    ),
    imageData = this.imageData
  ) {
    patterns.forEach((pattern) => {
      // Iterating through patterns
      let currentColor = new Color();
      let data = imageData.data;
      let pixelSize = 4;
      for (let i = 0; i < data.length - pixelSize; i += pixelSize) {
        // Iterating through data
        let fci = pattern[0].findIndex((bool) => +bool); // first colored index
        currentColor.reset(
          data.slice(i + fci * pixelSize, i + fci * pixelSize + 3)
        );
        let searchedColor = color == "any" ? currentColor : color;
        let equals = false;

        for (let j = 0; j < pattern.length; j++) {
          // Iterating through pattern rows
          let indexes = [];
          for (let k = 0; k < pattern[j].length; k++) {
            indexes.push(i + k * pixelSize + this.canvas.width * pixelSize * j);
          }

          let row = indexes.map(
            (pixelIndex) =>
              +this.arrayEquals(
                searchedColor.values,
                data.slice(pixelIndex, pixelIndex + 3)
              )
          );

          if (!this.arrayEquals(row, pattern[j])) {
            equals = false;
            break;
          } else if (j == pattern.length - 1) {
            counter++;
            equals = true;
          }
        }

        if (equals) {
          // Render
          pattern.forEach((row, r) => {
            row.forEach((pixel, p) => {
              if (pixel) {
                this.putColor(
                  newImageData,
                  searchedColor,
                  i + p * pixelSize + this.canvas.width * r * pixelSize
                );
              }
            });
          });
        }
      }
    });
    console.log(counter);
    document.getElementById("data").innerHTML=`Amogis found: <b>${counter}</b>`
    return newImageData;
  }
}

const viewResult = (view = true) => {
  const ui = document.getElementById("ui");
  const result = document.getElementById("result");
  ui.style.display = view ? "none" : "block";
  result.style.display = view ? "block" : "none";
};
let colors = [
  new Color([190, 0, 57]),
  new Color([255, 69, 0]),
  new Color([255, 168, 0]),
  new Color([255, 214, 53]),
  new Color([0, 163, 104]),
  new Color([0, 204, 120]),
  new Color([126, 237, 86]),
  new Color([0, 117, 111]),
  new Color([0, 158, 170]),
  new Color([36, 80, 164]),
  new Color([54, 144, 234]),
  new Color([81, 233, 244]),
  new Color([73, 58, 193]),
  new Color([106, 92, 255]),
  new Color([129, 30, 159]),
  new Color([180, 74, 192]),
  new Color([255, 56, 129]),
  new Color([255, 153, 170]),
  new Color([109, 72, 47]),
  new Color([156, 105, 38]),
  new Color([0, 0, 0]),
  new Color([137, 141, 144]),
  new Color([212, 215, 217]),
];

let patterns = [
  [
    [0, 1, 1, 1],
    [1, 1, 0, 0],
    [1, 1, 1, 1],
    [0, 1, 1, 1],
    [0, 1, 0, 1],
  ],
  [
    [0, 1, 1, 1],
    [1, 1, 0, 0],
    [1, 1, 1, 1],
    [0, 1, 0, 1],
  ],
  [
    [0, 1, 1, 1],
    [1, 1, 0, 0],
    [1, 1, 1, 1],
    [1, 1, 1, 1],
    [0, 1, 0, 1],
  ],
];
let svastikas = [
  [
    [1, 0, 1, 1, 1],
    [1, 0, 1, 0, 0],
    [1, 1, 1, 1, 1],
    [0, 0, 1, 0, 1],
    [1, 1, 1, 0, 1],
  ],
  [
    [1, 1, 1, 0, 0],
    [0, 0, 1, 0, 0],
    [1, 1, 1, 1, 1],
    [1, 0, 1, 0, 0],
    [1, 0, 1, 1, 1],
  ],
];
let imageProcessor = new ImageProcessor();
// imageProcessor.loadImage(imagePath, 2000, 2000);
const startButton = document.getElementById("process-button");

startButton.addEventListener("click", () => {
  /**@type {HTMLInputElement} */
  const fileInput = document.getElementById("file-input");
  const url = URL.createObjectURL(fileInput.files[0]);
  imageProcessor.loadImage(url);
});
function start() {
  console.log("Starting process...");
  imageProcessor.toCanvas();
  let copy = JSON.parse(JSON.stringify(patterns)).map((pattern) =>
    pattern.map((row) => row.reverse())
  );
  patterns = patterns.concat(copy);
  console.log(patterns);
  imageProcessor.toCanvas(imageProcessor.findPattern(patterns));
}
/* 
  imageProcessor.toCanvas(colors.reduce((prevValue, currentValue) => {
      if (prevValue != null) {
          return imageProcessor.findPattern(patterns, currentValue, prevValue);
      } else {
          return imageProcessor.findPattern(patterns, currentValue);
      }
  }, null))
  
  //*/
