import { getBaseOptions, requestAPI } from "./header";

let sid;

export const getSessionId = async (username, password, vCenterIP) => {
    try {
        const data = JSON.stringify({});
        const options = getBaseOptions(vCenterIP);
        options.path = "/rest/com/vmware/cis/session";
        options.method = "POST";
        options.headers.Authorization =
            "Basic " +
            Buffer.from(username + ":" + password).toString("base64");

        const sessionIdJson = await requestAPI(options, data);
        sid = sessionIdJson.value;
        return sid;
    } catch (error) {
        throw new Error("Request failed");
    }
};

export const getHostList = async (sessionID, vCenterIP) => {
    try {
        if (!sid) sid = sessionID;
        const options = getBaseOptions(vCenterIP);
        options.headers["vmware-api-session-id"] = sessionID;
        options.path = "/rest/vcenter/host";
        options.method = "GET";

        const hostList = await requestAPI(options);

        return hostList;
    } catch (error) {
        throw new Error("Request failed");
    }
};

export const getVMList = async (hostName, sessionID, vCenterIP) => {
    try {
        if (!sid) sid = sessionID;
        const options = getBaseOptions(vCenterIP);
        options.headers["vmware-api-session-id"] = sessionID;
        options.path = `/rest/vcenter/vm?filter.hosts=${hostName}`;
        options.method = "GET";

        const vmList = await requestAPI(options);

        return vmList;
    } catch (error) {
        throw new Error("Request failed");
    }
};

export const getVMInfo = async (vmName, sessionID, vCenterIP) => {
    try {
        const options = getBaseOptions(vCenterIP);
        options.headers["vmware-api-session-id"] = sessionID;
        options.path = `/rest/vcenter/vm/${vmName}`;
        options.method = "GET";

        const vmInfo = await requestAPI(options);

        return vmInfo;
    } catch (error) {
        throw new Error("Request failed");
    }
};

export const patchMemory = async (vmName, sessionID, vCenterIP, memory) => {
    try {
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

        await requestAPI(options, postData);

        return;
    } catch (error) {
        throw new Error("Request failed");
    }
};

export const patchCPU = async (vmName, sessionID, vCenterIP, count) => {
    try {
        const options = getBaseOptions(vCenterIP);
        options.headers["vmware-api-session-id"] = sessionID;
        options.path = `/rest/vcenter/vm/${vmName}/hardware/cpu`;
        options.method = "PATCH";
        const postData = JSON.stringify({
            spec: {
                count: parseInt(count),
                hot_add_enabled: true,
            },
        });

        await requestAPI(options, postData);

        return;
    } catch (error) {
        throw new Error("Request failed");
    }
};

export const createVM = async (sessionID, vCenterIP, param) => {
    try {
        const options = getBaseOptions(vCenterIP);
        options.headers["vmware-api-session-id"] = sessionID;
        options.path = `/rest/vcenter/vm`;
        options.method = "POST";
        const postData = JSON.stringify({
            spec: {
                guest_OS: param.guest_OS,
                name: param.name,
                placement: {
                    //여기는 파라미터
                    datastore: param.placement.datastore,
                    folder: param.placement.folder,
                    host: param.placement.host,
                },
                cpu: {
                    count: parseInt(param.cpu),
                },
                memory: {
                    size_MiB: parseInt(param.memory),
                },
            },
        });
        const createVMName = await requestAPI(options, postData);

        return createVMName;
    } catch (error) {
        throw new Error("Request failed");
    }
};

export const deleteVM = async (vmName, sessionID, vCenterIP) => {
    try {
        const options = getBaseOptions(vCenterIP);
        options.headers["vmware-api-session-id"] = sessionID;
        options.path = `/rest/vcenter/vm/${vmName}`;
        options.method = "DELETE";
        await requestAPI(options);

        return;
    } catch (error) {
        throw new Error("Request failed");
    }
};

export const vmPowerOff = async (vmName, sessionID, vCenterIP) => {
    try {
        const options = getBaseOptions(vCenterIP);
        options.headers["vmware-api-session-id"] = sessionID;
        options.path = `/rest/vcenter/vm/${vmName}/power/stop`;
        options.method = "POST";
        await requestAPI(options);

        return;
    } catch (error) {
        throw new Error("Request failed");
    }
};

export const vmPowerOn = async (vmName, sessionID, vCenterIP) => {
    try {
        const options = getBaseOptions(vCenterIP);
        options.headers["vmware-api-session-id"] = sessionID;
        options.path = `/rest/vcenter/vm/${vmName}/power/start`;
        options.method = "POST";
        await requestAPI(options);

        return;
    } catch (error) {
        throw new Error("Request failed");
    }
};

export const getFolderVM = async (req, res) => {
    try {
        const vCenterIP = "192.168.0.102";
        const options = getBaseOptions(vCenterIP);
        const sessionID = req.session.sessionID;
        options.headers["vmware-api-session-id"] = sessionID;
        options.path = `/rest/vcenter/folder`;
        options.method = "GET";
        const deletevm = await requestAPI(options);

        return res.send(deletevm);
    } catch (error) {
        throw new Error("Request failed");
    }
};

export const getDatastoreVM = async (req, res) => {
    try {
        const vCenterIP = "192.168.0.102";
        const options = getBaseOptions(vCenterIP);
        const sessionID = req.session.sessionID;
        options.headers["vmware-api-session-id"] = sessionID;
        options.path = `/rest/vcenter/datastore`;
        options.method = "GET";
        const deletevm = await requestAPI(options);

        return res.send(deletevm);
    } catch (error) {
        throw new Error("Request failed");
    }
};
