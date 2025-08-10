import { sendMessage, handleMessage } from "./messages.js";
const inputsIds = [...new Array(9).fill(0).map((_, i) => i + ""), "CANC", "REFUND"];

inputsIds.forEach((id) => {
  const input = document.getElementById(id);
  input.onclick = () => {
    sendMessage("input", id);
  };
  input.onmousedown = () => sendMessage("audio", "peep");
});
