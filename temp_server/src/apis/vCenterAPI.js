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
            count: parseInt(count),
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
            guest_OS: param.guest_OS,
            name: param.name,
            placement: {
                //여기는 파라미터
                datastore: param.datastore,
                folder: param.folder,
                host: param.host,
            },
            cpu: {
                count: parseInt(param.cpu),
            },
            memory: {
                size_MiB: parseInt(param.memory),
            },
        },
    });
    console.log(postData);
    const createVMName = await requestAPI(options, postData);
    console.log("create success");
    console.log(createVMName);

    return createVMName;
};

export const deleteVM = async (vmName, sessionID, vCenterIP) => {
    const options = getBaseOptions(vCenterIP);
    options.headers["vmware-api-session-id"] = sessionID;
    options.path = `/rest/vcenter/vm/${vmName}`;
    options.method = "DELETE";
    await requestAPI(options);
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
            name: "TVM01",
            placement: {
                // datastore는 공유스토리지 구성 잘 되면 하나로 고정 가능

                // datastore: "datastore-48021", // 호스트 3 성공
                datastore: "datastore-48017", //HOST 1

                //folder는 아마도 고정
                folder: "group-v35012", //호스트 3 성공 HOST 1

                // host: "esxi03.stz.local",   이렇게 작성하면 안됨 X

                // host는 아래처럼 작성하기 (HOST 선택에 따라 다르게 변경)
                // host: "host-40004", // 호스트 3
                host: "host-37003", //HOST 1
            },
            cpu: {
                count: 2, //param.cpu_count
            },
            memory: {
                size_MiB: 6144, //param.memory
            },
        },
    });
    console.log(postData);
    const create = await requestAPI(options, postData);
    console.log("create success");

    return res.send(create);
};

export const testDeleteVM = async (req, res) => {
    const vCenterIP = "192.168.0.102";
    const options = getBaseOptions(vCenterIP);
    const sessionID = req.session.sessionID;
    options.headers["vmware-api-session-id"] = sessionID;
    // const vmName = "TVM01";
    const vmName = "vm-51034";
    options.path = `/rest/vcenter/vm/${vmName}`;
    options.method = "DELETE";
    const deletevm = await requestAPI(options);
    console.log("delete VM");

    return res.redirect("/hosts");
};

export const testFolderVM = async (req, res) => {
    const vCenterIP = "192.168.0.102";
    const options = getBaseOptions(vCenterIP);
    const sessionID = req.session.sessionID;
    options.headers["vmware-api-session-id"] = sessionID;
    // const vmName = "TVM01";
    options.path = `/rest/vcenter/folder`;
    options.method = "GET";
    const deletevm = await requestAPI(options);
    // console.log("delete VM");

    return res.send(deletevm);
};

export const testDatastoreVM = async (req, res) => {
    const vCenterIP = "192.168.0.102";
    const options = getBaseOptions(vCenterIP);
    const sessionID = req.session.sessionID;
    options.headers["vmware-api-session-id"] = sessionID;
    // const vmName = "TVM01";
    options.path = `/rest/vcenter/datastore`;
    options.method = "GET";
    const deletevm = await requestAPI(options);
    // console.log("delete VM");

    return res.send(deletevm);
};
