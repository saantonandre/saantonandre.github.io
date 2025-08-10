import express from "express";
import https from "https";
import { createCA, createCert } from "mkcert";

export const launchServer = async () => {
  const app = express();
  const ca = await createCA({
    organization: "Hello CA",
    countryCode: "NP",
    state: "Bagmati",
    locality: "Kathmandu",
    validity: 365,
  });
  const credentials = await createCert({
    ca: { key: ca.key, cert: ca.cert },
    domains: ["127.0.0.1", "localhost"],
    validity: 365,
  });;

  const httpsServer = https.createServer(credentials, app);
  httpsServer.listen(443, () => {
    console.log("HTTPS server running on port 443");
  });
  app.get("/", (_req, res) => {
    res.send("hello");
  });
  return "https://localhost";
};
