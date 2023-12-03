/** This code has seen some refactoring as of 2023-10-28 saantonandre */

let canvas = document.createElement("canvas");
canvas.style.imageRendering = "pixelated";
let c = canvas.getContext("2d");
c.imageSmoothingEnabled = false;
let image = document.getElementById("a");
let image2 = document.getElementById("b");



document.body.appendChild(canvas);

/** - - - - - -
 *  - - # # # -
 *  - # # @ @ -
 *  - # # # # -
 *  - - # - # -
 *  - - - - - -
 */
//process(image);
class Color {
    constructor(values) {
        this.values = values;
    }
    /**
     * @param {Color} color 
     */
    equals(color) {
        return !(this.values[0] !== color.values[0] || this.values.values[1] !== color.values[1] || this.values[2] !== color.values[2]);
    }

    put(imageData, index) {
        imageData.splice(index, this.values.length, this.values);
    }
}

let red = new Color([255, 69, 0]);
let cache = [];
onlyColor(image, red);

function onlyColor(img, color) {
    canvas.width = img.width;
    canvas.height = img.height;
    c.drawImage(img, 0, 0, 1000, 1000);

    let imageDataObject = c.getImageData(0, 0, img.width, img.height);
    /** @type {Uint8ClampedArray}*/
    let imageData = imageDataObject.data;

    for (let i = 4; i < imageData.length; i += 4) {
        let currentColor = new Color(imageData.slice(i, i + 3));
        if (i == 4) console.log(imageData.slice(i, i+3))
        if (currentColor == color) {
            color.put(imageData, i);
        }
    }

    c.putImageData(imageDataObject, 0, 0);
    console.log("done")
}





function process(img) {
    /** @type {Uint8ClampedArray} */
    canvas.width = image.width;
    canvas.height = image.height;
    c.drawImage(image, 0, 0, 1000, 1000);
    let imageData = c.getImageData(0, 0, img.width, img.height).data;
    let pastColor = "";
    let counter = 0;

    // Iterating pixels (horizontally)
    for (let i = 1; i < imageData.length; i += 4) {
        // Check if reached horizontal bound
        if (i % img.width == 0) {
            pastColor = "";
            continue;
        }
        let currentColor = getCurrentColor(imageData, i);
        // Check if the current color is different from past color
        if (currentColor !== pastColor) {
            continue;
        }

        // Check if the current color is different from past color
        x = i % img.width;
        y = (i / img.height) | 0;

        pastColor = currentColor;
    }
    console.log("done")
}

function getCurrentColor(array, index) {
    return [array[index], array[index + 1], array[index + 2]];
}