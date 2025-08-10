import fs from "fs";

const ASSETS_FOLDER = process.argv[2];
const OUT_NAME = "index.ts";
const GENERATED_MESSAGE = `/**
* ------------------------- DO NOT EDIT -------------------------
* 
* This file has been automatically generated from a script.
* Script: \`${__filename.split("/").pop()}\`
* 
* Remember to launch the script to update the assets after any folder change
* 
* ---------------------------------------------------------------
*/`;

const sanitize = (string: string) =>
  "_" + string.replace(/[^a-z0-9]/gi, "_").toLowerCase();

const getFullName= (name: string) => {
  const ext = name.split(".").pop();
  if (ext === "bin") {
    return name + "?arraybuffer";
  }
  return name;
};
const init = () => {
  const items = fs
    .readdirSync(ASSETS_FOLDER)
    .filter((name) => !name.includes(OUT_NAME));

  const [sanitized, fileNames] = items.reduce<[string[], string[]]>(
    (prev, curr) => [prev[0].concat(sanitize(curr)), prev[1].concat(curr)],
    [[], []]
  );

  const content = `${GENERATED_MESSAGE}
${fileNames
  .map((fileName, i) => {
    return `import ${sanitized[i]} from "./${getFullName(fileName)}"`;
  })
  .join(
    "\n"
  )}\n\n/** Contains a record of every asset(except ${OUT_NAME}) located in the \`${ASSETS_FOLDER}\` folder.**/
export const ${ASSETS_FOLDER.split("/").pop()?.toLocaleLowerCase()}Index = {
${sanitized
  .map((name, i) => {
    return `\t/** Original name: \`${fileNames[i]}\`*/\n\t${name}`;
  })
  .join(",\n")}
  };`;

  fs.writeFileSync(ASSETS_FOLDER + "/" + OUT_NAME, content);
};
init();
