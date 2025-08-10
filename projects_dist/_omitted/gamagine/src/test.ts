async function loadImage(source: string) {
  const image = new Image();
  await new Promise((res) => {
    image.src = source;
    image.onload = res;
  });
  return image;
}

function getImageData(image: HTMLImageElement) {
  const { width, height } = image;
  const offscreenCanvas = new OffscreenCanvas(width, height);
  const context = offscreenCanvas.getContext("2d");
  if (!context) throw "Offscreen context not working";
  context.drawImage(image, 0, 0, width, height);
  const { data } = context.getImageData(0, 0, width, height);
  return data;
}

function imageDataToAlphaValues(rgbaArray: Uint8ClampedArray) {
  const alphaValues: number[] = [];
  for (let i = 0; i < rgbaArray.length; i += 4) {
    alphaValues.push(rgbaArray[i + 3]);
  }
  return alphaValues;
}

function mergeAlphaValues(alphaValues:number[],width:number){
  const mergedValues=[];
  for (let i = 0; i< alphaValues.length;i++){
    const charCode = alphaValues[i];
    const charCode2 = (alphaValues[i + width] || 0) * 2;
  }
}