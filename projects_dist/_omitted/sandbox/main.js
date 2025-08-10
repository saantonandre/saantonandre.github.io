const setup = () => {
  const container = document.createElement("div");
  container.style.display = "flex";
  container.style.gap = "4px";
  document.body.appendChild(container);
  const bits = 8;
  for (let i = 0; i < bits; i++) {
    container.appendChild(createBitButton());
  }
};

const createBitButton = () => {
  const size = 40;
  const initialActive = false;
  const bgColors = ["#000", "#ccc"];
  const button = document.createElement("button");
  button.style.backgroundColor = bgColors[Number(initialActive)];
  button.style.color = bgColors[Number(!initialActive)];
  button.style.border = "1px solid #888";
  button.style.width = size + "px";
  button.style.height = size + "px";
  button.style.borderRadius = "1000px";
  button.style.cursor = "pointer";
  button.onclick = () => {
    const isActive = button.dataset.active === "true";
    button.dataset.active = isActive ? undefined : "true";
    button.style.backgroundColor = bgColors[Number(!isActive)];
    button.style.color = bgColors[Number(isActive)];
  };
  return button;
};
setup();
