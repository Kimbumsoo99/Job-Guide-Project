import User from "../models/User";
import { getSessionId } from "./api/vCenterAPI";

const https = require("https");

// const username = "administrator@vsphere.local";
// const password = "123Qwer!";
// const hostIP = "192.168.0.102";

let sessionID;

export const home = (req, res) => res.render("home");

function isEmptyArr(arr) {
    if (Array.isArray(arr) && arr.length === 0) {
        return true;
    }

    return false;
}

export const getAddBasicInfo = (req, res) => {
    const { user } = req.session;
    if (isEmptyArr(user.vsphere) || req.query.add == 1)
        return res.render("addVSphere");
    //return res.redirect("/vs/data");
    return res.redirect("/vs/hosts");
};

export const postAddBasicInfo = async (req, res) => {
    const { vs_id, vs_pw, vc_ip } = req.body;

    const { user } = req.session;
    const { _id } = user;

    const updatedUser = await User.findByIdAndUpdate(
        _id,
        {
            $push: {
                vsphere: {
                    vs_id,
                    vs_pw,
                    vc_ip,
                },
            },
        },
        { new: true }
    );
    req.session.user = updatedUser;
    if (!req.session.sessionID) {
        req.session.sessionID = sessionID
            ? sessionID
            : await getSessionId(vs_id, vs_pw, vc_ip);
    }

    return res.redirect(`/vs/hosts`);
    //return res.redirect(`/vm/data?vs_id=${vm_id}&vs_pw=${vm_pw}&vs_ip=${vm_ip}`);

    // return res.redirect(
    //     `/vs/hosts?vs_id=${vs_id}&vs_pw=${vs_pw}&vs_ip=${vc_ip}`
    // );
};

/**
 * 공통으로 사용되는 옵션 객체 반환
 * options에 필요한 기능을 추가하여 사용
 * @param sessionId
 * @returns options
 */
export const getOptions = (sessionId) => {
    return {
        headers: {
            "Content-Type": "application/json",
            "vmware-api-session-id": sessionId,
        },
        rejectUnauthorized: false,
    };
};

/**
 * Path Parameter로 사용되는 VM의 이름을 가져오는 함수
 * @param sessionId
 * @returns VM 이름
 *
 * GET List VM 문서
 */
export const getVMName = async (sessionId) => {
    const options = getOptions(sessionId);
    options.hostname = hostIP;
    options.port = 443;
    options.path = "/rest/vcenter/vm";
    options.method = "GET";

    const res = await httpsGet(`https://${hostIP}/rest/vcenter/vm`, options);
    return res.send(res);
    console.log(res);
    const vmId = res.value[0].vm;
    return vmId;
};

/**
 * GET 메소드에 대한 요청을 보내서 Promise 객체 반환
 */
const httpsGet = (url, options) => {
    return new Promise((resolve, reject) => {
        https.get(url, options, (response) => {
            let data = "";
            response.on("data", (chunk) => {
                data += chunk;
            });
            response.on("end", () => {
                try {
                    const result = JSON.parse(data);
                    resolve(result);
                } catch (error) {
                    reject(error);
                }
            });
            response.on("error", (error) => {
                reject(error);
            });
        });
    });
};

export const getVMInfo = async (sessionId) => {
    try {
        const vmId = await getVMName(sessionId);
        const options = getOptions(sessionId);
        const vmInfo = await httpsGet(
            `https://${hostIP}/rest/vcenter/vm/${vmId}`,
            options
        );
        return vmInfo;
    } catch (error) {
        console.error(error);
        throw new Error("Get VM Info Error");
    }
};

export const getDataCenterList = async (sessionId) => {
    try {
        const options = getOptions(sessionId);
        const dataCenterList = await httpsGet(
            `https://${hostIP}/rest/vcenter/datacenter`,
            options
        );
        return dataCenterList;
    } catch (error) {
        console.error(error);
        throw new Error("Data Center Error");
    }
};

export const getDataStoreList = async (sessionId) => {
    try {
        const options = getOptions(sessionId);
        const dataStoreList = await httpsGet(
            `https://${hostIP}/rest/vcenter/datastore`,
            options
        );
        return dataStoreList;
    } catch (error) {
        console.error(error);
        throw new Error("Data Store Error");
    }
};

export const getHost = async (sessionId) => {
    try {
        const options = getOptions(sessionId);
        const hostInfo = await httpsGet(
            `https://${hostIP}/rest/vcenter/host`,
            options
        );
        return hostInfo;
    } catch (error) {
        console.error(error);
        throw new Error("Get Host Error");
    }
};

export const getNetwork = async (sessionId) => {
    try {
        const options = getOptions(sessionId);
        const networkInfo = await httpsGet(
            `https://${hostIP}/rest/vcenter/network`,
            options
        );
        return networkInfo;
    } catch (error) {
        console.error(error);
        throw new Error("Get Network Error");
    }
};

export const getHardMemory = async (sessionId) => {
    try {
        const options = getOptions(sessionId);
        const vm = await getVMName(sessionId);
        const memoryInfo = await httpsGet(
            `https://${hostIP}/rest/vcenter/vm/${vm}/hardware/memory`,
            options
        );
        return memoryInfo;
    } catch (error) {
        console.error(error);
        throw new Error("Get Memory Error");
    }
};
