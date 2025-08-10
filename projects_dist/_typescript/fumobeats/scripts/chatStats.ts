import fs from "fs";
import path from "path";
const INPUT_DIR = path.join(__filename, "../neuro-chats");
const OUTPUT_DIR = path.join(__filename, "../output/");

export function toEntries<
  K extends string | symbol | number,
  T extends Record<K, any>
>(object: T) {
  return Object.entries(object) as [K, T[K]][];
}

function start() {
  const files = fs
    .readdirSync(INPUT_DIR)
    .map((name) => path.join(INPUT_DIR, name));
  console.log(`Analyzing files: \n${files.join("\n")}`);
  const record: TempRecord = {};
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    console.log(`Processing file ${i + 1} of ${files.length}...`);
    processFile(file, record);
  }
  console.log(`Creating array...`);
  /** Array of sorted chatters */
  const chattersArray = toEntries(record)
    .sort(([_, a], [__, b]) => b.n - a.n)
    .map(([username, { n, badges, color }]) => {
      return [username, color, n, badges] as const;
    });
  const usersNames: string[] = [];
  const usersPresence: number[] = [];
  const usersBadges: number[] = [];
  const usersColors: number[] = [];
  /** 
    1 = subscriber, 2 = vip, 4 = moderator, 8 = gifter 0 = nothing

    3 = sub + vip
    5 = mod + sub
    6 = mod + vip
    9 = gifter + sub
    10 = gifter + vip
    11 = gifter + vip + sub
    12 = gifter + mod
    13 = gifter + mod + vip
    14 = gifter + mod + vip + sub
    
  */
  let totalMessages = 0;
  console.log("Optimizations...");
  for (const [username, color, amount, badges] of chattersArray) {
    usersPresence.push(amount);
    totalMessages += amount;
    usersNames.push(username as string);
    const sub = badges.includes("subscriber") ? 1 : 0;
    const vip = badges.includes("vip") ? 2 : 0;
    const mod = badges.includes("moderator") ? 4 : 0;
    const gifter = badges.includes("sub-gifter") ? 8 : 0;
    usersBadges.push(sub + vip + mod + gifter);
    usersColors.push(color ? hex3num(color as `#${string}`) : 0);
  }
  console.log(`Writing files...`);
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }
  const usernamesJson = JSON.stringify(usersNames);
  fs.writeFileSync(path.join(OUTPUT_DIR, "usernames.json"), usernamesJson);
  const colors16 = new Uint16Array(usersColors);
  fs.writeFileSync(path.join(OUTPUT_DIR, "colors16.bin"), colors16);
  const presence16 = new Uint16Array(usersPresence);
  fs.writeFileSync(path.join(OUTPUT_DIR, "presence16.bin"), presence16);
  const badges8 = new Uint8Array(usersBadges);
  fs.writeFileSync(path.join(OUTPUT_DIR, "badges8.bin"), badges8);
  console.log(`DONE.\nTotal chatters: ${usersNames.length}`);
  console.log(`DONE.\nTotal messages: ${totalMessages}`);
}
start();
/** Converts hex like this #FFFFFF -> xFFF(decimal representation) */
function hex3num(color: `#${string}`) {
  return parseInt("" + color[1] + color[3] + color[5], 16);
}
type DataFile = {
  comments: {
    commenter: {
      display_name: string;
    };
    message: { user_color: string; user_badges: { _id: string }[] };
  }[];
};
type TempRecord = Record<
  string,
  { n: number; badges: string[]; color: string }
>;
function processFile(filePath: string, record: TempRecord) {
  const { comments } = JSON.parse(
    fs.readFileSync(filePath, "utf8")
  ) as DataFile;

  for (const comment of comments) {
    if (!record[comment.commenter.display_name]) {
      record[comment.commenter.display_name] = {
        n: 0,
        badges: comment.message.user_badges.map(({ _id }) => _id),
        color: comment.message.user_color,
      };
    }
    record[comment.commenter.display_name].n++;
  }
  return record;
}
