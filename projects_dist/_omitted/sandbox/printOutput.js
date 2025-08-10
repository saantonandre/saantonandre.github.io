const div = document.createElement("div");

/**
 * Prints output to the screen
 * @param {Record<string,string>} object
 */
export const printOutput = (object) => {
  div.innerHTML = "";
  div.style.display = "grid";
  div.style.fontSize = "16px";
  div.style.fontFamily = "monospace";
  div.style.width = "fit-content";
  div.style.margin = "auto";
  div.style.marginTop = "100px";
  div.style.gridTemplateColumns = "auto auto";
  for (const key in object) {
    const cell_a = document.createElement("div");
    cell_a.style.border = "1px solid white";
    cell_a.innerHTML = key;
    cell_a.style.padding = "2px 4px";
    div.appendChild(cell_a);
    const cell_b = document.createElement("div");
    cell_b.style.border = "1px solid white";
    cell_b.style.padding = "2px 4px";
    cell_b.innerHTML = String(object[key]);
    div.appendChild(cell_b);
  }
  document.body.appendChild(div);
};

export default printOutput;
