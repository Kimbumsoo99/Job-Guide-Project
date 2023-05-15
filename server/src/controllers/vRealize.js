import https from "https";
import fetch from "node-fetch";
import { httpsGet } from "./vmController";

const vRealUrl = "192.168.0.109";
const username = "admin";
const password = "123Qwer!";
const baseUrl = `https://${vRealUrl}/suite-api/api`;

const getOptions = (host, url, token) => {
  return {
    headers: {
      "Content-Type": "application/json",
      Authorization: `vRealizeOpsToken ${token}`,
      //Authorization: token,
      Accept: "application/json",
    },
    port: "443",
    method: "GET",
    rejectUnauthorized: false,
  };
};

export const getVRealTokenJson = async (req, res) => {
  return new Promise(async (resolve, reject) => {
    console.log(`${baseUrl}/auth/token/acquire 로 요청`);

    const agent = new https.Agent({ rejectUnauthorized: false });

    const authResponse = await fetch(`${baseUrl}/auth/token/acquire`, {
      method: "POST",
      body: JSON.stringify({ username, password }),
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      agent,
    });
    if (!authResponse.ok) {
      console.log("오류 났음");
      throw new Error("Failed to authenticate with vRealize Operations.");
    }
    console.log(authResponse);

    const authData = await authResponse.json();
    console.log("\nauthData\n");
    console.log(authData);

    return res.send(authData);
  });
};

export const getRealResourcesV2 = async (req, res) => {
  const token = await getVRealTokenJson();
  console.log("Token: ", token);

  const url = `${baseUrl}/resources`;
  const options = getOptions(token);

  const realResources = await httpsGet(url, options);
  console.log(realResources);
  return res.send(realResources);
};
