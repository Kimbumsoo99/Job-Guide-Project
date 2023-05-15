import https from "https";
import fetch from "node-fetch";

const vRealUrl = "192.168.0.109";
const username = "admin";
const password = "123Qwer!";

const getOptions = (host, url, token) => {
  return {
    hostname: host,
    port: 443,
    path: url,
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `vRealizeOpsToken ${token}`,
      Accept: "application/json",
    },
    rejectUnauthorized: false,
  };
};

export const getVRealTokenJson = async (req, res) => {
  return new Promise(async (resolve, reject) => {
    const baseUrl = `https://${vRealUrl}/suite-api/api`;

    console.log(`${apiEndpoint}/auth/token/acquire 로 요청`);

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
