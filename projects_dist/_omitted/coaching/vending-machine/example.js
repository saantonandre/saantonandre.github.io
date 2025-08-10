// This is an example on how you could handle the message events
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
// To test messages you could setup something like this
// window.sendMessage = sendMessage;
// window.handleMessage = handleMessage;

