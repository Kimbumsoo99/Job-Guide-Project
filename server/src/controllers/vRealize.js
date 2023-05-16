import https from "https";
import fetch from "node-fetch";
import { httpsGet } from "./vmController";

const vRealUrl = "192.168.0.109";
const username = "admin";
const password = "123Qwer!";
const baseUrl = `https://${vRealUrl}/suite-api/api`;
let token;

const getOptions = (token) => {
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

export const getVRealTokenJson = async () => {
  console.log("\ngetVRealTokenJson 호출\n");
  try {
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

    const token = authData.token;

    return token;
  } catch (err) {
    console.log("Error 발생");
    console.log(err);
    throw err;
  }
};

export const getRealResourcesV2 = async () => {
  console.log("\ngetREalResourcesV2 호출\n");
  token = token ? token : await getVRealTokenJson();
  console.log("Token: ", token);

  const url = `${baseUrl}/resources?adapterKind=VMWARE&resourceKind=VirtualMachine&name=VM02&resourceHealth=GREEN`;
  const options = getOptions(token);

  console.log(url);
  console.log(options);

  const realResources = await httpsGet(url, options);
  console.log(realResources);
  console.log(realResources.resourceList[0].identifier);
  const resourceId = realResources.resourceList[0].identifier;
  return resourceId;
};

export const getRealCpuUsageV2 = async (req, res) => {
  console.log("\ngetRealCpuUsageV2 호출\n");
  const resourceId = await getRealResourcesV2();
  console.log("\ngetRealCpuUsageV2 복귀\n");
  console.log(token);
  const url = `${baseUrl}/resources/${resourceId}/stats/latest?currentOnly=true&statKey=cpu|usage_average`;
  const options = getOptions(token);
  const realCpuStats = await httpsGet(url, options);
  console.log(realCpuStats);
  return res.send(realCpuStats);
};