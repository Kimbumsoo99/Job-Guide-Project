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

  const url = `${baseUrl}/resources?adapterKind=VMWARE&resourceKind=VirtualMachine&name=VM03`;
  const options = getOptions(token);

  console.log(url);
  console.log(options);

  const realResources = await httpsGet(url, options);
  console.log(realResources);
  console.log(realResources.resourceList[0]);
  console.log(realResources.resourceList[0].identifier);
  const resourceId = realResources.resourceList[0].identifier;
  return resourceId;
};

export const getRealResourcesJSON = async (req, res) => {
  console.log("\ngetREalResourcesV2 호출\n");
  token = token ? token : await getVRealTokenJson();
  console.log("Token: ", token);

  const url = `${baseUrl}/resources?adapterKind=VMWARE&resourceKind=VirtualMachine&name=VM02`;
  const options = getOptions(token);

  console.log(url);
  console.log(options);

  const realResources = await httpsGet(url, options);
  console.log(realResources);
  return res.send(realResources);
};

export const getRealCpuUsageV2 = async (req, res) => {
  const currentTime = Date.now();
  const preTime = currentTime - 1000 * 60 * 60;
  console.log(currentTime, preTime);
  console.log("\ngetRealCpuUsageV2 호출\n");
  const resourceId = await getRealResourcesV2();
  console.log(resourceId);
  console.log("\ngetRealCpuUsageV2 복귀\n");
  console.log(token);
  const url = `${baseUrl}/resources/${resourceId}/stats?statKey=cpu|usage_average&begin=${preTime}&end=${currentTime}`;
  const options = getOptions(token);
  const realCpuStats = await httpsGet(url, options);
  console.log(realCpuStats);
  return res.send(realCpuStats);
};

export const getRealMemUsage = async (req, res) => {
  console.log("\ngetRealMemUsageV2 호출\n");
  const resourceId = await getRealResourcesV2();
  const url = `${baseUrl}/resources/${resourceId}/stats?statKey=mem|usage_average`;
  const options = getOptions(token);
  const realMemStats = await httpsGet(url, options);
  return res.send(realMemStats);
};

export const getRealdiskUsage = async (req, res) => {
  console.log("\ngetRealdiskUsageV2 호출\n");
  const resourceId = await getRealResourcesV2();
  const url = `${baseUrl}/resources/${resourceId}/stats?statKey=diskspace|used`;
  const options = getOptions(token);
  const realdiskStats = await httpsGet(url, options);
  return res.send(realdiskStats);
};

export const getRealResources0525 = async (req, res) => {
  console.log("\ngetRealResources0523 호출\n");
  const resourceId = await getRealResourcesV2();
  const url = `${baseUrl}/resources/${resourceId}/stats?statKey=mem|usage_average&statKey=cpu|usage_average&intervalType=MINUTES&rollUpType=AVG&intervalQuantifier=5&currentOnly=TRUE`;
  const options = getOptions(token);
  const realStats = await httpsGet(url, options);

  // const realStats = {
  //   cpu: {
  //     timeStamp: [
  //       1684960119999, 1684942119999, 1684924119999, 1684906119999,
  //       1684888119999, 1684870119999, 1684852119999, 1684834119999,
  //       1684816119999, 1684798119999, 1684780119999, 1684762119999,
  //     ],
  //     usage: [23, 50, 30, 20, 40, 50, 5, 89, 99, 100, 34, 20],
  //   },
  //   mem: {
  //     timeStamp: [
  //       1684960119999, 1684942119999, 1684924119999, 1684906119999,
  //       1684888119999, 1684870119999, 1684852119999, 1684834119999,
  //       1684816119999, 1684798119999, 1684780119999, 1684762119999,
  //     ],
  //     usage: [23, 50, 30, 20, 40, 50, 5, 89, 99, 100, 34, 20],
  //   },
  // };
  console.log(realStats.value[0]["stat-list"]);
  return res.render("vmDetail", { realStats });
};
