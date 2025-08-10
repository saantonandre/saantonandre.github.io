import fs from "fs";
import { mkdir } from "fs/promises";
import path from "path";
import { CodegenConfig } from "@graphql-codegen/cli";
import {
  buildClientSchema,
  getIntrospectionQuery,
  printSchema,
} from "graphql/utilities";
console.log(process.env)
const {
  GQL_ENDPOINT_ADMIN,
  GQL_ENDPOINT_TENANT,
  GQL_TOKEN_ADMIN,
  GQL_TOKEN_TENANT,
} = process.env;

const selectedConfig: keyof typeof configs = "admin";
// First get a valid token for the corresponding side (ADMIN or TENANT) and change the one in .env.local
// launch yarn graphql:codegenimport fs from "fs"
const token = {
  admin: GQL_TOKEN_ADMIN,
  tenant: GQL_TOKEN_TENANT,
};
const url = {
  admin: GQL_ENDPOINT_ADMIN,
  tenant: GQL_ENDPOINT_TENANT,
};
const updateSchema = async () => {
  const folder="schemas"
  const file = `./schema-${selectedConfig}.gql`;
  console.log(`Downloading schema into ${file}`);
  if (!fs.existsSync(folder)) await mkdir(folder); //Optional if you already have downloads directory
  const destination = path.resolve(folder, file);
  await fetch(url[selectedConfig]!, {
    method: "POST",
    headers: {
      Authorization: `${token[selectedConfig]}`,
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query: getIntrospectionQuery(),
    }),
  })
    .then((res) => res.json())
    .then((schemaJSON) => printSchema(buildClientSchema(schemaJSON.data)))
    .then((clientSchema) => {
      fs.writeFileSync(destination, clientSchema);
      console.log(
        `Successfully downloaded the schema in destination: "${destination}"`
      );
    })
    .catch(() => {
      console.log(
        "There has been an error while trying to fetch/download the schema"
      );
    });
};
updateSchema();
const generateConfig = (
  endpoint: string,
  token: string,
  out: string,
  documents: string
): CodegenConfig => ({
  schema: [
    {
      [endpoint]: {
        headers: {
          Authorization: `${token}`,
        },
      },
    },
  ],
  ignoreNoDocuments: true, // for better experience with the watcher
  generates: {
    [out]: {
      documents,
      plugins: ["typescript", "typescript-operations"],
      config: {
        gqlImport: "graphql.macro#gql",
      },
    },
  },
});

const configs = {
  admin: generateConfig(
    GQL_ENDPOINT_ADMIN!,
    GQL_TOKEN_ADMIN!,
    "./src/graphql/admin/generated.ts",
    "./src/graphql/admin/*.gql"
  ),
  tenant: generateConfig(
    GQL_ENDPOINT_TENANT!,
    GQL_TOKEN_TENANT!,
    "./src/graphql/tenant/generated.ts",
    "./src/graphql/tenant/*.gql"
  ),
};
const config = configs[selectedConfig];

export default config;
