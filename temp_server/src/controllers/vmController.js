import User from "../models/User";
import {
    createVM,
    deleteVM,
    getHostList,
    getSessionId,
    getVMInfo,
    getVMList,
    patchCPU,
    patchMemory,
} from "../apis/vCenterAPI";
import TestHostList from "../jsons/0525host.json";
import TestVMList from "../jsons/0525vmlist.json";
import TestVMInfo from "../jsons/0525vminfo.json";
import TestRealUsage from "../jsons/0525real.json";
import Test2RealUsage from "../jsons/0525real2.json";
import { getResourceUsage, getToken } from "../apis/vRealizeAPI";
import { serialize } from "v8";

const https = require("https");

// const username = "administrator@vsphere.local";
// const password = "123Qwer!";
// const hostIP = "192.168.0.102";

function calculateAverage(numbers) {
    console.log(numbers);
    const sum = numbers.reduce(function (total, current) {
        return parseFloat(total) + parseFloat(current);
    }, 0);

    return sum / numbers.length;
}

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

    // 🟦실습환경에서 실행
    // if (!sessionID) sessionID = await getSessionId(vs_id, vs_pw, vc_ip);
    // req.session.sessionID = sessionID;
    // 🟦실습환경에서 실행

    return res.redirect(`/vs/hosts`);
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
    // 🟦실습환경에서 실행
    // if (!sessionID) {
    //     sessionID = await getSessionId(
    //         user.vsphere.vs_id,
    //         user.vsphere.vs_pw,
    //         user.vsphere.vc_ip
    //     );
    //     req.session.sessionID = sessionID;
    // }
    // const vCenterIP = user.vsphere.vc_ip;
    // const hostList = await getHostList(sessionID, vCenterIP);
    // 🟦실습환경에서 실행

    // 🟥집에서 실행
    const hostList = TestHostList;
    // 🟥집에서 실행

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

    // 🟦실습환경에서 실행
    // if (!sessionID) {
    //     sessionID = await getSessionId(
    //         user.vsphere.vs_id,
    //         user.vsphere.vs_pw,
    //         user.vsphere.vc_ip
    //     );
    //     req.session.sessionID = sessionID;
    // }
    // const vCenterIP = user.vsphere.vc_ip;
    // const vmList = await getVMList(hosts, sessionID, vCenterIP);

    // for (const [index, vm] of vmList.value.entries()) {
    //     const name = vm.vm;
    //     console.log(name, sessionID);
    //     vmList.value[index].info = await getVMInfo(name, sessionID, vCenterIP);
    // }
    // 🟦실습환경에서 실행

    // 🟥집에서 실행
    const vmList = TestVMList;
    for (const [index, vm] of vmList.value.entries()) {
        vmList.value[index].info = TestVMInfo;
    }
    // 🟥집에서 실행

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

    const vmId = req.query.vm;
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
        if (vmId == vm.vm) {
            vmInfo = vm;
        }
    }

    //vm.vm 말고 << 정적 정보 수정
    // vm.name 도 필요함 << 실시간 정보
    return res.render("vmInfo", { vmInfo, vmId, hostName });
};

export const getVRealBasicInfo = (req, res) => res.render("addVRealize");

export const postVRealBasicInfo = async (req, res) => {
    const { vr_id, vr_pw, vr_ip } = req.body;
    const { user } = req.session;
    const { _id } = user;

    const updatedUser = await User.findByIdAndUpdate(
        _id,
        {
            "vsphere.v_real": { vr_id, vr_pw, vr_ip },
        },
        { new: true }
    );
    req.session.user = updatedUser;

    return res.redirect("/vs/hosts");
};

export const vmRealPageRender = async (req, res) => {
    // const { user } = req.session;

    // const username = user.vsphere.v_real.vr_id;
    // const password = user.vsphere.v_real.vr_pw;
    // const vRealizeIP = user.vsphere.v_real.vr_ip;
    // console.log(username, password, vRealizeIP);

    // //🟦실습환경에서 하기
    // // const token = await getToken(username, password, vRealizeIP);
    // // req.session.token = token;
    // // const { vm } = req.query;
    // // const realUsage = await getResourceUsage(vm, vRealizeIP, token);
    // //🟦실습환경에서 하기

    // //🟥집에서 하기
    // const realUsage = TestRealUsage;
    // //🟥집에서 하기

    // const dataLength = realUsage.values[0]["stat-list"].stat[0].data.length;
    // console.log("테스트");
    // if (dataLength < 12) {
    //     //data가 12개보다 적으면 0으로 채우기
    //     let count = 0;
    //     const tempMemTimeStamp = [];
    //     const tempMemDataUsage = [];
    //     const tempCpuTimeStamp = [];
    //     const tempCpuDataUsage = [];
    //     for (let i = 0; i < 12 - dataLength; i++) {
    //         tempMemTimeStamp.push(0);
    //         tempMemDataUsage.push(0);
    //         tempCpuTimeStamp.push(0);
    //         tempCpuDataUsage.push(0);
    //     }
    //     for (let i = 12 - dataLength; i < 12; i++) {
    //         tempMemTimeStamp.push(
    //             realUsage.values[0]["stat-list"].stat[0].timestamps[count]
    //         );
    //         tempMemDataUsage.push(
    //             realUsage.values[0]["stat-list"].stat[0].data[count].toFixed(2)
    //         );
    //         tempCpuTimeStamp.push(
    //             realUsage.values[0]["stat-list"].stat[1].timestamps[count]
    //         );
    //         tempCpuDataUsage.push(
    //             realUsage.values[0]["stat-list"].stat[1].data[count].toFixed(2)
    //         );
    //         count += 1;
    //     }
    //     realUsage.values[0]["stat-list"].stat[0].timestamps = tempMemTimeStamp;
    //     realUsage.values[0]["stat-list"].stat[0].data = tempMemDataUsage;
    //     realUsage.values[0]["stat-list"].stat[1].timestamps = tempCpuTimeStamp;
    //     realUsage.values[0]["stat-list"].stat[1].data = tempCpuDataUsage;
    // } else {
    //     console.log("테스트");

    //     //12개 이상이면 12개만 짜르기
    //     const tempMemTimeStamp = [];
    //     const tempMemDataUsage = [];
    //     const tempCpuTimeStamp = [];
    //     const tempCpuDataUsage = [];
    //     console.log(
    //         realUsage.values[0]["stat-list"].stat[0].data[3].toFixed(2)
    //     );

    //     for (let i = dataLength - 12; i < dataLength; i++) {
    //         tempMemTimeStamp.push(
    //             realUsage.values[0]["stat-list"].stat[0].timestamps[i]
    //         );
    //         tempMemDataUsage.push(
    //             realUsage.values[0]["stat-list"].stat[0].data[i].toFixed(2)
    //         );
    //         tempCpuTimeStamp.push(
    //             realUsage.values[0]["stat-list"].stat[1].timestamps[i]
    //         );
    //         tempCpuDataUsage.push(
    //             realUsage.values[0]["stat-list"].stat[1].data[i].toFixed(2)
    //         );
    //     }
    //     console.log("테스트");
    //     realUsage.values[0]["stat-list"].stat[0].timestamps = tempMemTimeStamp;
    //     realUsage.values[0]["stat-list"].stat[0].data = tempMemDataUsage;
    //     realUsage.values[0]["stat-list"].stat[1].timestamps = tempCpuTimeStamp;
    //     realUsage.values[0]["stat-list"].stat[1].data = tempCpuDataUsage;
    // }
    // console.log("테스트");

    return res.render("vmReal");
};

export const getVRealData = (req, res) => {
    const { user } = req.session;

    const username = user.vsphere.v_real.vr_id;
    const password = user.vsphere.v_real.vr_pw;
    const vRealizeIP = user.vsphere.v_real.vr_ip;
    console.log(username, password, vRealizeIP);

    //🟦실습환경에서 하기
    // const token = await getToken(username, password, vRealizeIP);
    // req.session.token = token;
    // const { vm } = req.query;
    // const realUsage = await getResourceUsage(vm, vRealizeIP, token);
    //🟦실습환경에서 하기

    //🟥집에서 하기
    // const realUsage = TestRealUsage;
    const realUsage = Test2RealUsage;
    //🟥집에서 하기

    const dataLength = realUsage.values[0]["stat-list"].stat[0].data.length;
    let cpuAvg; //Circle 차트
    let memoryAvg;
    if (dataLength < 12) {
        //data가 12개보다 적으면 0으로 채우기
        let count = 0;
        const tempMemTimeStamp = [];
        const tempMemDataUsage = [];
        const tempCpuTimeStamp = [];
        const tempCpuDataUsage = [];
        for (let i = 0; i < 12 - dataLength; i++) {
            tempMemTimeStamp.push(0);
            tempMemDataUsage.push(0);
            tempCpuTimeStamp.push(0);
            tempCpuDataUsage.push(0);
        }
        for (let i = 12 - dataLength; i < 12; i++) {
            tempMemTimeStamp.push(
                realUsage.values[0]["stat-list"].stat[0].timestamps[count]
            );
            tempMemDataUsage.push(
                parseFloat(
                    realUsage.values[0]["stat-list"].stat[0].data[count]
                ).toFixed(2)
            );
            tempCpuTimeStamp.push(
                realUsage.values[0]["stat-list"].stat[1].timestamps[count]
            );
            tempCpuDataUsage.push(
                parseFloat(
                    realUsage.values[0]["stat-list"].stat[1].data[count]
                ).toFixed(2)
            );
            count += 1;
        }
        realUsage.values[0]["stat-list"].stat[0].timestamps = tempMemTimeStamp;
        realUsage.values[0]["stat-list"].stat[0].data = tempMemDataUsage;
        realUsage.values[0]["stat-list"].stat[1].timestamps = tempCpuTimeStamp;
        realUsage.values[0]["stat-list"].stat[1].data = tempCpuDataUsage;
    } else {
        console.log("테스트");

        //12개 이상이면 12개만 짜르기
        const tempMemTimeStamp = [];
        const tempMemDataUsage = [];
        const tempCpuTimeStamp = [];
        const tempCpuDataUsage = [];
        console.log(
            parseFloat(
                realUsage.values[0]["stat-list"].stat[0].data[3]
            ).toFixed(2)
        );

        for (let i = dataLength - 12; i < dataLength; i++) {
            tempMemTimeStamp.push(
                realUsage.values[0]["stat-list"].stat[0].timestamps[i]
            );
            tempMemDataUsage.push(
                parseFloat(
                    realUsage.values[0]["stat-list"].stat[0].data[i]
                ).toFixed(2)
            );
            tempCpuTimeStamp.push(
                realUsage.values[0]["stat-list"].stat[1].timestamps[i]
            );
            tempCpuDataUsage.push(
                parseFloat(
                    realUsage.values[0]["stat-list"].stat[1].data[i]
                ).toFixed(2)
            );
        }
        console.log("테스트");
        realUsage.values[0]["stat-list"].stat[0].timestamps = tempMemTimeStamp;
        realUsage.values[0]["stat-list"].stat[0].data = tempMemDataUsage;
        realUsage.values[0]["stat-list"].stat[1].timestamps = tempCpuTimeStamp;
        realUsage.values[0]["stat-list"].stat[1].data = tempCpuDataUsage;
    }

    cpuAvg = parseFloat(
        calculateAverage(realUsage.values[0]["stat-list"].stat[1].data)
    ).toFixed(2);
    memoryAvg = parseFloat(
        calculateAverage(realUsage.values[0]["stat-list"].stat[0].data)
    ).toFixed(2);
    console.log(cpuAvg, memoryAvg);

    realUsage.cpuAvg = cpuAvg;
    realUsage.memoryAvg = memoryAvg;

    console.log(realUsage);

    return res.json(realUsage);
};

export const getVmChangeSet = async (req, res) => {
    const { vm, host } = req.query;
    const { user } = req.session;

    let findVmInfo;

    for (const [index, hostInfo] of user.vsphere.info.value.entries()) {
        if (host == hostInfo.host) {
            for (const [index, vmInfo] of hostInfo.vmList.value.entries()) {
                if (vm == vmInfo.vm) {
                    findVmInfo = vmInfo;
                    break;
                }
            }
            break;
        }
    }

    return res.render("vmEdit", { findVmInfo });
};

export const postVmChangeSet = async (req, res) => {
    const { user } = req.session;
    const { _id } = user;
    const { vm, host } = req.query;
    const { memory_size, cpu_count } = req.body;
    const vCenterIP = user.vsphere.vc_ip;

    let findVMInfo;
    for (const [index, hostInfo] of user.vsphere.info.value.entries()) {
        if (host == hostInfo.host) {
            for (const [index, vmInfo] of hostInfo.vmList.value.entries()) {
                if (vm == vmInfo.vm) {
                    findVMInfo = vmInfo;
                    break;
                }
            }
            break;
        }
    }
    //집에서 하는중
    if (findVMInfo.info.value.memory.size_MiB != memory_size) {
        await patchMemory(vm, sessionID, vCenterIP, memory_size);
        // for (const [out_index, hostInfo] of user.vsphere.info.value.entries()) {
        //     if (host == hostInfo.host) {
        //         for (const [index, vmInfo] of hostInfo.vmList.value.entries()) {
        //             if (vm == vmInfo.vm) {
        //                 user.vsphere.info.value[out_index].vmList.value[
        //                     index
        //                 ].memory_size_MiB = memory_size;
        //                 break;
        //             }
        //         }
        //         break;
        //     }
        // }
    }
    if (findVMInfo.info.value.cpu.count != cpu_count) {
        await patchCPU(vm, sessionID, vCenterIP, cpu_count);
        // for (const [out_index, hostInfo] of user.vsphere.info.value.entries()) {
        //     if (host == hostInfo.host) {
        //         for (const [index, vmInfo] of hostInfo.vmList.value.entries()) {
        //             if (vm == vmInfo.vm) {
        //                 user.vsphere.info.value[out_index].vmList.value[
        //                     index
        //                 ].cpu_count = cpu_count;
        //                 break;
        //             }
        //         }
        //         break;
        //     }
        // }
    }
    //집에서 하는중
    const changeVMInfo = await getVMInfo(vm, sessionID, vCenterIP);
    console.log(changeVMInfo);

    const updatedUser = await User.findByIdAndUpdate(
        _id,
        {
            $set: {
                "vsphere.info.value.$[inner].vmList.value.$[outer].memory_size_MiB":
                    memory_size,
                "vsphere.info.value.$[inner].vmList.value.$[outer].cpu_count":
                    cpu_count,
                "vsphere.info.value.$[inner].vmList.value.$[outer].info":
                    changeVMInfo,
            },
        },
        {
            new: true,
            arrayFilters: [{ "inner.host": host }, { "outer.vm": vm }],
        }
    );
    req.session.user = updatedUser;

    return res.redirect(`/vs/hosts/vms/detail?vm=${vm}&hosts=${host}`);
};

export const getDeleteVM = async (req, res) => {
    const { user } = req.session;
    const { vm, host } = req.query;

    const vmName = vm;
    const vCenterIP = user.vsphere.vc_ip;

    await deleteVM(vmName, sessionID, vCenterIP);

    return res.redirect(`/vs/hosts/vms?hosts=${host}`);
};

export const getCreateVM = async (req, res) =>
    res.render("vmCreate", { hosts: req.query.hosts });

export const postCreateVM = async (req, res) => {
    const { user } = req.session;
    const vCenterIP = user.vsphere.vc_ip;

    const { host_name, vm_name, os_name, memory_size, cpu_count } = req.body;
    let datastore;
    if (host_name == "host-37003") datastore = "datastore-48017";
    else if (host_name == "host-36006") datastore = "datastore-48020";
    else if (host_name == "host-40004") datastore = "datastore-48021";
    else {
        console.log("문제 있음");
        return res.redirect("/");
    }
    const param = {
        guest_OS: os_name,
        name: vm_name,
        placement: {
            datastore,
            folder: "group-v35012",
            host: host_name,
        },
        cpu: cpu_count,
        memory: memory_size,
    };
    console.log(param);
    const value = await createVM(sessionID, vCenterIP, param);
    return res.redirect(`/vs/hosts/vms?hosts=${host_name}`);
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
