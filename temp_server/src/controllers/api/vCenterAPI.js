import { getBaseOptions, getSessionId } from "./header";

let sessionId;

const requestAPI = (options, data) => {
    if (!data) {
        data = JSON.stringify({});
    }

    return new Promise((resolve, reject) => {
        const req = https.request(options, (res) => {
            console.log(`statusCode: ${res.statusCode}`);
            let responseBody = "";

            res.on("data", (chunk) => {
                responseBody += chunk;
            });

            res.on("end", () => {
                const jsonResponse = JSON.parse(responseBody);
                // console.log("JSON 객체 값");
                // console.log(jsonResponse);
                resolve(jsonResponse);
            });
        });

        req.on("error", (error) => {
            console.error(error);
            reject(error);
        });

        req.write(data);
        req.end();
    });
};

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
};
