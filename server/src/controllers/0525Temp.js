//json 받아오는 용도
import https from "https";
import fetch from "node-fetch";
import { getOptions, httpsGet } from "./vmController";
import { getSessionId } from "./headerGet";

const username = "administrator@vsphere.local";
const password = "123Qwer!";
const hostIP = "192.168.0.102";

const vRealUrl = "192.168.0.109";
const realUsername = "admin";
const baseUrl = `https://${vRealUrl}/suite-api/api`;

export const get525Host = async (req, res) => {
  try {
    const sessionId = await getSessionId(username, password, hostIP);
    const options = getOptions(sessionId);
    const hostInfo = await httpsGet(
      `https://${hostIP}/rest/vcenter/host`,
      options
    );
    return res.send(hostInfo);
  } catch (error) {
    console.error(error);
    throw new Error("Get Host Error");
  }
};

export const get525VMList = async (req, res) => {
  console.log("\ngetVMList 호출\n");
  const sessionId = await getSessionId(username, password, hostIP);
  const options = getOptions(sessionId);
  const hosts = "host-36006";
  /*const vmList = await httpsGet(
      `https://${vCenterIP}/rest/vcenter/vm`,
      options
    );*/
  const vmList = await httpsGet(
    `https://${vCenterIP}/rest/vcenter/vm?filter.hosts=${hosts}`,
    options
  );

  console.log(
    `https://${vCenterIP}/rest/vcenter/vm?filter.hosts=${hosts} : getVMList 요청 링크`
  );
  console.log(vmList);
  console.log("getVMList 종료");
  return res.send(vmList);
};

export const get525VMInfo = async (req, res) => {
  try {
    const sessionId = await getSessionId(username, password, hostIP);
    const vmId = "vm-45006";
    const options = getOptions(sessionId);
    const vmInfo = await httpsGet(
      `https://${hostIP}/rest/vcenter/vm/${vmId}`,
      options
    );
    return res.send(vmInfo);
  } catch (error) {
    console.error(error);
    throw new Error("Get VM Info Error");
  }
};

const getOptions525 = (token) => {
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
      body: JSON.stringify({ realUsername, password }),
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
  token = await getVRealTokenJson();

  const url = `${baseUrl}/resources?adapterKind=VMWARE&resourceKind=VirtualMachine&name=VM02`;
  const options = getOptions525(token);

  console.log(url);
  console.log(options);

  const realResources = await httpsGet(url, options);
  console.log(realResources);
  console.log(realResources.resourceList[0]);
  console.log(realResources.resourceList[0].identifier);
  const resourceId = realResources.resourceList[0].identifier;
  return resourceId;
};

export const get525RealResources = async (req, res) => {
  const resourceId = await getRealResourcesV2();
  const url = `${baseUrl}/resources/${resourceId}/stats?statKey=mem|usage_average&statKey=cpu|usage_average&intervalType=MINUTES&rollUpType=AVG&intervalQuantifier=5&currentOnly=TRUE`;
  const options = getOptions525(token);
  const realStats = await httpsGet(url, options);

  return res.send(realStats);
};
