import { getBaseOptions, requestAPI } from "./header";

export const getToken = async (username, password, vRealizeIP) => {
    try {
        const requestData = { username, password }; //body에 들어갈 데이터
        const requestJson = JSON.stringify(requestData);

        const options = getBaseOptions(vRealizeIP);
        options.method = "POST";
        options.path = "/suite-api/api/auth/token/acquire";

        const tokenJson = await requestAPI(options, requestJson);
        const token = tokenJson.token;

        return token;
    } catch (error) {
        throw new Error("Request failed");
    }
};

export const getResourceId = async (vmName, vRealizeIP, token) => {
    try {
        const options = getBaseOptions(vRealizeIP);
        options.method = "GET";
        options.path = `/suite-api/api/resources?adapterKind=VMWARE&resourceKind=VirtualMachine&name=${vmName}`;
        options.headers.Authorization = `vRealizeOpsToken ${token}`;

        const resources = await requestAPI(options);

        const resourceId = resources.resourceList[0].identifier;

        return resourceId;
    } catch (error) {
        throw new Error("Request failed");
    }
};

export const getResourceUsage = async (vmName, vRealizeIP, token) => {
    try {
        const resourceId = await getResourceId(vmName, vRealizeIP, token);

        const options = getBaseOptions(vRealizeIP);
        options.method = "GET";
        options.path = `/suite-api/api/resources/${resourceId}/stats?statKey=mem|usage_average&statKey=cpu|usage_average&intervalType=MINUTES&rollUpType=AVG&intervalQuantifier=5&currentOnly=TRUE`;
        options.headers.Authorization = `vRealizeOpsToken ${token}`;

        const realUsage = await requestAPI(options);

        return realUsage;
    } catch (error) {
        throw new Error("Request failed");
    }
};
