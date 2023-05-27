import User from "../models/User";
import {
    getHostList,
    getSessionId,
    getVMInfo,
    getVMList,
} from "./api/vCenterAPI";
import TestHostList from "../jsons/0525host.json";
import TestVMList from "../jsons/0525vmlist.json";
import TestVMInfo from "../jsons/0525vminfo.json";

const https = require("https");

// const username = "administrator@vsphere.local";
// const password = "123Qwer!";
// const hostIP = "192.168.0.102";

function isEmptyArr(arr) {
    if (Array.isArray(arr) && arr.length === 0) {
        return true;
    }

    return false;
}

//0527 Refactoring 완료
//0527 Refactoring 완료
//0527 Refactoring 완료

let sessionID;

export const home = (req, res) => res.render("home");

export const getAddBasicInfo = (req, res) => {
    const { user } = req.session;
    if (!user.vsphere || req.query.change == 1) {
        return res.render("addVSphere");
    }
    //return res.redirect("/vs/data");
    return res.redirect("/vs/hosts");
};

export const postAddBasicInfo = async (req, res) => {
    const { vs_id, vs_pw, vc_ip } = req.body;
    const { user } = req.session;
    const { _id } = user;

    const isDuplicated = await User.exists({
        _id,
        "vsphere.vc_ip": vc_ip,
    });
    if (isDuplicated) {
        return res.render("addVSphere", {
            errorMessage: "Sorry, that IP is already registered.",
        });
    }

    const updatedUser = await User.findByIdAndUpdate(
        _id,
        {
            vsphere: {
                vs_id,
                vs_pw,
                vc_ip,
            },
        },
        { new: true }
    );
    req.session.user = updatedUser;

    // 집에서 실행
    // if (!sessionID) sessionID = await getSessionId(vs_id, vs_pw, vc_ip);
    // req.session.sessionID = sessionID;
    // 집에서 실행

    return res.redirect(`/vs/hosts`);
    //return res.redirect(`/vm/data?vs_id=${vm_id}&vs_pw=${vm_pw}&vs_ip=${vm_ip}`);

    // return res.redirect(
    //     `/vs/hosts?vs_id=${vs_id}&vs_pw=${vs_pw}&vs_ip=${vc_ip}`
    // );
};

export const hostsPageRender = async (req, res) => {
    const { user } = req.session;
    const { _id } = user;
    // session에 있는 vspherer는 Object
    if (!user.vsphere) {
        //vsphere 정보가 존재하지 않는다면, 등록부터 하기
        return res.redirect("/vs");
    }

    // DB에 있는 vsphere는 Array라는 문제점이 있음. 향후 생각해보기 (0527)
    if (user.vsphere.info) {
        //vsphere 정보가 존재하고, host 정보도 user에 이미 존재
        return res.render("hostPage", { hostList: user.vsphere.info });
    }

    // ID, IP는 존재하지만, host 정보가 없는 경우 (첫 정상 접근)
    // Host 정보를 받아서, DB에 저장하고 render 시킨다.
    // 집에서 실행
    // if (!sessionID) {
    //     sessionID = await getSessionId(
    //         user.vsphere.vs_id,
    //         user.vsphere.vs_pw,
    //         user.vsphere.vc_ip
    //     );
    //     req.session.sessionID = sessionID;
    // }
    // 집에서 실행

    // 집에서 실행
    // const vCenterIP = user.vsphere.vc_ip;
    // const hostList = await getHostList(sessionID, vCenterIP);
    const hostList = TestHostList;
    // 집에서 실행

    const updatedUser = await User.findByIdAndUpdate(
        _id,
        {
            "vsphere.info": hostList,
        },
        { new: true }
    );
    req.session.user = updatedUser;

    //hostList에 대한 데이터를 보내줘야함.
    return res.render("hostPage", { hostList });
};

export const vmsPageRender = async (req, res) => {
    const { user } = req.session;
    const { _id } = user;

    const { hosts } = req.query;

    if (!hosts) res.redirect("/vs/hosts");

    // 집에서 실행
    // if (!sessionID) {
    //     sessionID = await getSessionId(
    //         user.vsphere.vs_id,
    //         user.vsphere.vs_pw,
    //         user.vsphere.vc_ip
    //     );
    //     req.session.sessionID = sessionID;
    // }
    // 집에서 실행

    // 집에서 실행
    // const vCenterIP = user.vsphere.vc_ip;
    // const vmList = await getVMList(hosts, sessionID, vCenterIP);
    const vmList = TestVMList;

    for (const [index, vm] of vmList.value.entries()) {
        // 집에서 실행
        // const name = vm.vm;
        // vmList.value[index].info = await getVMInfo(name, sessionId);
        vmList.value[index].info = TestVMInfo;
        // 집에서 실행
    }
    // 집에서 실행

    const updatedUser = await User.findByIdAndUpdate(
        _id,
        {
            $set: {
                "vsphere.info.value.$[inner].vmList": vmList,
            },
        },
        {
            new: true,
            arrayFilters: [{ "inner.host": hosts }],
        }
    );
    req.session.user = updatedUser;

    return res.render("vmPage", { hosts, vmList });
};

export const vmDetailPageRender = async (req, res) => {
    const { user } = req.session;
    const { _id } = user;

    const vmName = req.query.vm;
    const hostName = req.query.hosts;
    const hostList = user.vsphere.info.value;

    let vmList;
    for (const [index, host] of hostList.entries()) {
        if (hostName == host.host) {
            vmList = host.vmList;
        }
    }

    let vmInfo;
    for (const [index, vm] of vmList.value.entries()) {
        if (vmName == vm.vm) {
            vmInfo = vm;
        }
    }

    console.log(vmInfo);
    return res.render("vmInfo", { vmInfo, vmName, hostName });
};
//0527 Refactoring 완료
//0527 Refactoring 완료
//0527 Refactoring 완료

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

// export const getVMInfo = async (sessionId) => {
//     try {
//         const vmId = await getVMName(sessionId);
//         const options = getOptions(sessionId);
//         const vmInfo = await httpsGet(
//             `https://${hostIP}/rest/vcenter/vm/${vmId}`,
//             options
//         );
//         return vmInfo;
//     } catch (error) {
//         console.error(error);
//         throw new Error("Get VM Info Error");
//     }
// };

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
