import { handleMessage, sendMessage } from "./messages.js";

const currencies = {
  1: 0,
  2: 0,
  5: 0,
  10: 0,
  20: 0,
  50: 0,
  100: 0,
  200: 0,
};

for (const currency in currencies) {
  currencies[currency] = (Math.random() * 10) | 0;
}

handleMessage("get-available-currency", () => {
  sendMessage("available-currency", JSON.stringify(currencies));
});

handleMessage("coin-insert", (_currency) => {
  const currency = Number(_currency);
  currencies[currency]++;
});
handleMessage("drop-coin", (_currency) => {
  // Throw error if not enough currency
  const currency = Number(_currency);
  if (!currencies[currency]) {
    throw new Error("NOT ENOUGH COINS OF SELECTED TYPE");
  }
  // Remove currency from bank
  currencies[currency]--;
  // Send currency to the user
  sendMessage("release-currency", currency);
});
