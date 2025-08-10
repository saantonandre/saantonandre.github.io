import { obfuscateScripts } from "./obfuscateScripts";
import { zipFolder } from "./zipFolder";

const FOLDER = process.argv[2];
if (!FOLDER) {
  throw new Error("No folder provided");
}
await obfuscateScripts(FOLDER).then(async () => {
  await zipFolder(FOLDER, "./build.zip");
});
