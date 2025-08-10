import { ModesManager, firstCoffee } from "game/ModesManager/ModesManager";
let didStart = false;
const start = async () => {
  if (didStart) return;
  didStart = true;
  console.log("Initializing...");
  const modesManager = new ModesManager();
  modesManager.init();
  //@ts-ignore
  window.game = modesManager;
  window.removeEventListener("click", start);
  document.body.removeChild(el);
};
const el = document.createElement("div");
el.style.margin = "auto";
el.style.color = "#f0eceb";
el.style.inset = "0";
el.style.position = "absolute";
el.style.display = "flex";
el.style.flexDirection = "column";
el.style.gap = "8px";
el.style.textAlign = "center";
el.style.justifyContent = "center";
el.style.alignItems = "center";
el.style.cursor = "pointer";
el.style.fontSize = "24px";
el.style.fontFamily = firstCoffee.family;
el.innerHTML =
  "<div>Launch game!</div><small>(Click required to consent browser audio)</small>";
document.body.appendChild(el);
el.addEventListener("click", start);

// immediate start
location.hostname === "localhost" && start();

