import { getBaseOptions, requestAPI } from "./header";

let sid;

export const getSessionId = async (username, password, vCenterIP) => {
    const data = JSON.stringify({});
    const options = getBaseOptions(vCenterIP);
    options.path = "/rest/com/vmware/cis/session";
    options.method = "POST";
    options.headers.Authorization =
        "Basic " + Buffer.from(username + ":" + password).toString("base64");

    console.log(options);
    const sessionIdJson = await requestAPI(options, data);
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
    console.log(options);

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
    options.path = `/rest/vcenter/vm/${vmName}/hardware/cpu`;
    options.method = "PATCH";
    const postData = JSON.stringify({
        spec: {
            cores_per_socket: 0,
            count: count,
            hot_add_enabled: true,
        },
    });

    const status = await requestAPI(options, postData);
    console.log(status);

    return;
};

export const createVM = async (sessionID, vCenterIP, param) => {
    const options = getBaseOptions(vCenterIP);
    options.headers["vmware-api-session-id"] = sessionID;
    options.path = `/rest/vcenter/vm`;
    options.method = "POST";
    const postData = JSON.stringify({
        spec: {
            guest_OS: "UBUNTU_64",
            placement: {
                //여기는 파라미터
                datastore: "datastoretest",
                folder: "STZDC",
                host: "esxi03.stz.local",
            },
            cpu: {
                count: 2,
            },
            memory: {
                size_MiB: 6144,
            },
        },
    });
    const create = await requestAPI(options, postData);
    console.log("create success");

    return;
};

export const deleteVM = async (vmName, sessionID, vCenterIP) => {
    const options = getBaseOptions(vCenterIP);
    options.headers["vmware-api-session-id"] = sessionID;
    options.path = `/rest/vcenter/vm/${vmName}`;
    options.method = "DELETE";
    const deletevm = await requestAPI(options);
    console.log("delete VM");

    return;
};

export const testCreateVM = async (req, res) => {
    const vCenterIP = "192.168.0.102";
    const options = getBaseOptions(vCenterIP);
    const sessionID = req.session.sessionID;
    console.log(sessionID);
    options.headers["vmware-api-session-id"] = sessionID;
    options.path = `/rest/vcenter/vm`;
    options.method = "POST";
    const postData = JSON.stringify({
        spec: {
            guest_OS: "UBUNTU_64",
            placement: {
                //여기는 파라미터
                datastore: "datastoretest",
                folder: "STZDC",
                host: "esxi03.stz.local",
            },
            cpu: {
                count: 2,
            },
            memory: {
                size_MiB: 6144,
            },
        },
    });
    const create = await requestAPI(options, postData);
    console.log("create success");

    return res.send(create);
};
