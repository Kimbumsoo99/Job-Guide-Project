import { getBaseOptions, requestAPI } from "./header";

let sid;

export const getSessionId = async (username, password, vCenterIP) => {
    const data = JSON.stringify({});
    const options = getBaseOptions(vCenterIP);
    options.path = "/rest/com/vmware/cis/session";
    options.method = "POST";
    options.headers.Authorization =
        "Basic " + Buffer.from(username + ":" + password).toString("base64");

    sessionIdJson = await requestAPI(options, data);
    console.log(sessionIdJson.value);
    sid = sessionIdJson.value;
    return sid;
};

export const getHostList = async (sessionID, vCenterIP) => {
    if (!sid) sid = sessionID;
    const options = getBaseOptions(vCenterIP);
    options.headers["vmware-api-session-id"] = sessionID;
    options.path = "/rest/vcenter/host";
    options.method = "GET";

    const hostList = await requestAPI(options);

    return hostList;
};

export const getVMList = async (hostName, sessionID, vCenterIP) => {
    if (!sid) sid = sessionID;
    const options = getBaseOptions(vCenterIP);
    options.headers["vmware-api-session-id"] = sessionID;
    options.path = `/rest/vcenter/vm?filter.hosts=${hostName}`;
    options.method = "GET";

    const vmList = await requestAPI(options);

    return vmList;
};

export const getVMInfo = async (vmName, sessionID, vCenterIP) => {
    const options = getBaseOptions(vCenterIP);
    options.headers["vmware-api-session-id"] = sessionID;
    options.path = `/rest/vcenter/vm/${vmName}`;
    options.method = "GET";

    const vmInfo = await requestAPI(options);

    return vmInfo;
};

export const patchMemory = async (vmName, sessionID, vCenterIP, memory) => {
    const options = getBaseOptions(vCenterIP);
    options.headers["vmware-api-session-id"] = sessionID;
    options.path = `/rest/vcenter/vm/${vmName}/hardware/memory`;
    options.method = "PATCH";
    const postData = JSON.stringify({
        spec: {
            hot_add_enabled: true,
            size_MiB: memory,
        },
    });

    const status = await requestAPI(options, postData);
    console.log(status);

    return;
};

export const patchCPU = async (vmName, sessionID, vCenterIP, count) => {
    const options = getBaseOptions(vCenterIP);
    options.headers["vmware-api-session-id"] = sessionID;
    options.path = ``;
    options.method = "PATCH";
    const postData = JSON.stringify({});

    const status = await requestAPI(options, postData);
    console.log(status);

    return;
};
