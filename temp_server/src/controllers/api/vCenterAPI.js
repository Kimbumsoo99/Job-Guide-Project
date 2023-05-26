import { getBaseOptions, requestAPI } from "./header";

let sessionId;

export const getSessionId = async (username, password, vCenterIP) => {
    const data = JSON.stringify({});
    const options = getBaseOptions(vCenterIP);
    options.path = "/rest/com/vmware/cis/session";
    options.method = "POST";
    options.headers.Authorization =
        "Basic " + Buffer.from(username + ":" + password).toString("base64");

    sessionIdJson = await requestAPI(options, data);
    console.log(sessionIdJson.value);
    sessionId = sessionIdJson.value;
    return sessionId;
};

export const getHostList = async (vSphereID, vSpherePW, vCenterIP) => {
    const sid = sessionId
        ? sessionId
        : await getSessionId(vSphereID, vSpherePW, vCenterIP);
    const options = getBaseOptions(vCenterIP);
    options.headers["vmware-api-session-id"] = sid;
    options.path = "/rest/vcenter/host";
    options.method = "GET";

    const hostList = await requestAPI(options);

    return hostList;
};

export const getVMList = async (hostName, vSphereID, vSpherePW, vCenterIP) => {
    const sid = sessionId
        ? sessionId
        : await getSessionId(vSphereID, vSpherePW, vCenterIP);
    const options = getBaseOptions(vCenterIP);
    options.headers["vmware-api-session-id"] = sid;
    options.path = `/rest/vcenter/vm?filter.hosts=${hostName}`;
    options.method = "GET";

    const vmList = await requestAPI(options);

    return vmList;
};

export const getVMInfo = async (vmName, vCenterIP) => {
    const sid = sessionId;
    const options = getBaseOptions(vCenterIP);
    options.headers["vmware-api-session-id"] = sid;
    options.path = `/rest/vcenter/vm/${vmName}`;
    options.method = "GET";

    const vmInfo = await requestAPI(options);

    return vmInfo;
};
