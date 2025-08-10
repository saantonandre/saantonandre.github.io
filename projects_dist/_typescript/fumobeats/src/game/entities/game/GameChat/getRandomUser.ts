import { othersIndex } from "assets/others";

/** Amount of messages in the dataset. Update this number when changing the dataset */
const DATASET_SIZE = 224350;

const badges8 = new Uint8Array(othersIndex._badges8_bin);
const colors16 = new Uint16Array(othersIndex._colors16_bin);
const presence16 = new Uint16Array(othersIndex._presence16_bin);
const usernames = othersIndex._usernames_json;

export const getRandomUser = () => {
  const random = Math.random() * DATASET_SIZE;
  let userIndex = 0;
  let acc = 0;
  for (let i = 0; i < presence16.length; i++) {
    acc += presence16[i];
    if (acc > random) {
      userIndex = i;
      break;
    }
  }
  const username = usernames[userIndex];
  const color = colors16[userIndex];
  const colorHex = color === 0 ? null : toHex(color);
  const badges = getBadges(badges8[userIndex]);
  return [username, colorHex, badges] as const;
};
function toHex(number: number) {
  return (
    "#" +
    number
      .toString(16)
      .padStart(3, "0")
      .split("")
      .map((v) => v + v)
      .join("")
  );
}

function getBadges(number: number) {
  const badges = ["gifter", "mod", "vip", "sub"];
  const badgesValue = [8, 4, 2, 1];
  const userBadges: string[] = [];
  for (let i = 0, count = number; i < badges.length && count > 0; i++) {
    if (count >= badgesValue[i]) {
      count -= badgesValue[i];
      userBadges.push(badges[i]);
    }
  }
  return userBadges;
}
