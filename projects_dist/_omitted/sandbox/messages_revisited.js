const listeners = {};

const addListener = (callback) => {
  const listenerId = Math.floor(Math.random() * 1000000000) + "";
  listeners[listenerId] = callback;
  return listenerId;
};
const removeListener = (id) => {
  delete listeners[id];
};

const emitMessage = (message) => {
  for (const key in listeners) {
    listener[key](message);
  }
};

window.addListener = addListener;
window.removeListener = removeListener;
window.emitMessage = emitMessage;
