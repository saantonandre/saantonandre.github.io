const CHANNEL_NAME = "vending-machine";

export const sendMessage = (type, ...data) => {
  postMessage({ channel: CHANNEL_NAME, type, data });
};

export const handleMessage = (type, callback = (...data) => {}) => {
  window.addEventListener("message", (e) => {
    if (e.data.type !== type || e.data.channel !== CHANNEL_NAME) return;
    callback(...e.data.data);
  });
};
window.handleMessage = handleMessage;
window.sendMessage = sendMessage;
