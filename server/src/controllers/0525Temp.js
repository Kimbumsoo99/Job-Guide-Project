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
    `https://${hostIP}/rest/vcenter/vm?filter.hosts=${hosts}`,
    options
  );

  console.log(
    `https://${hostIP}/rest/vcenter/vm?filter.hosts=${hosts} : getVMList 요청 링크`
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
