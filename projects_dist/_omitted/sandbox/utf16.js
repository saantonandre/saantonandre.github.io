function getUTF16() {
  let text = "";
  while (true) {
    const character = String.fromCharCode(text.length);
    if (character.charCodeAt(0) !== text.length) break;
    text += character;
  }
  return text;
}

/**
 * Loops for [amount] cycles.
 * @param { (i:number) => void } callback
 * @param { number } amount
 */
function loop(callback, amount = 1) {
  for (let i = 0; i < amount; i++) {
    callback(i);
  }
}

