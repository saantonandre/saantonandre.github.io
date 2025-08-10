const cassettaPostale = [];
const listeners = [];

const loop = () => {
  for (const messaggio of cassettaPostale) {
    for (const listener of listeners) {
      listener(messaggio);
    }
  }
  cassettaPostale.length = 0;
  setTimeout(loop,1000);
};

loop()

const addListener = callback => {
  listeners.push(callback);
};

const emitMessage = message => {
  cassettaPostale.push(message);
};

window.addListener = addListener;
window.emitMessage = emitMessage;
