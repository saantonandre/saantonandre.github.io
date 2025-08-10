import fs from "fs";
import {
  type GitlogOptions,
  default as gitlogDefault,
  CommitField,
} from "gitlog";
const gitlog: typeof gitlogDefault = require("gitlog").default;
console.log(gitlog)
const gitlogOptions: GitlogOptions<CommitField> = {
  repo: ".",
  number: 1000,
  author: "Andrea Santona",
  fields: ["authorDate", "subject", "body"],
  execOptions: { maxBuffer: 1000 * 1024 },
};

/**
 * Reads the root folder's gitlog and
 * @param output Path to where to write the gitlog
 */
export async function listCommits(output: string) {
  const commits = gitlog<CommitField>(gitlogOptions);
  const filteredData = commits.map((commit) => {
    const { subject, authorDate, body } = commit;
    return { authorDate, subject, body };
  });
  fs.writeFileSync(output, JSON.stringify(filteredData));

  console.log(
    `${commits.length} commits found in the current repo have been written to ${output}`
  );
}

await listCommits("src/assets/others/commits.json");