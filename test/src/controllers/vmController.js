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
    vmPowerOff,
    vmPowerOn,
} from "../apis/vCenterAPI";
import Test2HostList from "../jsons/0605host.json";
import TestVMList from "../jsons/0525vmlist.json";
import Test2VMList from "../jsons/0605vmlist.json";
import TestVMInfo from "../jsons/0525vminfo.json";
import TestRealUsage from "../jsons/0525real.json";
import Test2RealUsage from "../jsons/0525real2.json";
import Test3RealUsage from "../jsons/0525real3.json";
import { getResourceUsage, getToken } from "../apis/vRealizeAPI";

function calculateAverage(numbers) {
    const sum = numbers.reduce(function (total, current) {
        return parseFloat(total) + parseFloat(current);
    }, 0);

    return sum / numbers.length;
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
        "vsphere.vs_id": vs_id,
    });
    if (isDuplicated) {
        return res.render("addVSphere", {
            errorMessage: "Sorry, that ID is already registered.",
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
    // try {
    //     sessionID = await getSessionId(vs_id, vs_pw, vc_ip);
    //     req.session.sessionID = sessionID;
    // } catch (error) {
    //     return res.render("error", {
    //         errorName: "vCenter",
    //         errorMsg:
    //             "등록된 vSphere로 정보를 요청하던중 Error가 발생했습니다. 등록된 vSphere 정보를 다시 확인해주거나, vCenter에 전원이 켜져있는지 확인해 주세요.",
    //     });
    // }
    // 🟦실습환경에서 실행

    return res.redirect(`/vs/hosts`);
};

export const hostsPageRender = async (req, res) => {
    const { user } = req.session;
    const { _id } = user;
    // session에 있는 vspherer는 Object
    if (!user.vsphere) {
        //vsphere 정보가 존재하지 않는다면, 등록부터 하기
        return res.redirect("/vs?change=1");
    }
    if (user.vsphere.info) {
        // DB에 있는 vsphere는 Array라는 문제점이 있음. 향후 생각해보기 (0527)
        //vsphere 정보가 존재하고, host 정보도 user에 이미 존재
        return res.render("hostPage", { hostList: user.vsphere.info });
    }

    // ID, IP는 존재하지만, host 정보가 없는 경우 (첫 정상 접근)
    // Host 정보를 받아서, DB에 저장하고 render 시킨다.
    // 🟦실습환경에서 실행
    // let hostList;
    // try {
    //     if (!sessionID) {
    //         sessionID = await getSessionId(
    //             user.vsphere.vs_id,
    //             user.vsphere.vs_pw,
    //             user.vsphere.vc_ip
    //         );
    //         req.session.sessionID = sessionID;
    //     }
    //     const vCenterIP = user.vsphere.vc_ip;
    //     hostList = await getHostList(sessionID, vCenterIP);
    // } catch (error) {
    //     return res.render("error", {
    //         errorName: "vCenter",
    //         errorMsg:
    //             "등록된 vSphere로 정보를 요청하던중 Error가 발생했습니다. 등록된 vSphere 정보를 다시 확인해주거나, vCenter에 전원이 켜져있는지 확인해 주세요.",
    //     });
    // }
    // 🟦실습환경에서 실행

    // 🟥집에서 실행
    // const hostList = TestHostList;
    const hostList = Test2HostList;
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

    if (typeof user.vsphere.info.value !== "undefined") {
        const index = user.vsphere.info.value.findIndex(
            (h) => h.host === hosts
        );
        if (index == -1) {
            return res.redirect("/vs/hosts");
        }
    }

    // 🟦실습환경에서 실행
    // let vmList;
    // try {
    //     if (!sessionID) {
    //         sessionID = await getSessionId(
    //             user.vsphere.vs_id,
    //             user.vsphere.vs_pw,
    //             user.vsphere.vc_ip
    //         );
    //         req.session.sessionID = sessionID;
    //     }
    //     const vCenterIP = user.vsphere.vc_ip;
    //     vmList = await getVMList(hosts, sessionID, vCenterIP);
    //     for (const [index, vm] of vmList.value.entries()) {
    //         const name = vm.vm;
    //         vmList.value[index].info = await getVMInfo(
    //             name,
    //             sessionID,
    //             vCenterIP
    //         );
    //     }
    // } catch (error) {
    //     return res.render("error", {
    //         errorName: "vCenter",
    //         errorMsg:
    //             "등록된 vSphere로 정보를 요청하던중 Error가 발생했습니다. 등록된 vSphere 정보를 다시 확인해주거나, vCenter에 전원이 켜져있는지 확인해 주세요.",
    //     });
    // }
    // 🟦실습환경에서 실행

    // 🟥집에서 실행
    const vmList = Test2VMList;
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
    if (!vmId || !hostName) res.redirect("/vs/hosts");

    let hostList;
    if (typeof user.vsphere.info.value !== "undefined") {
        hostList = user.vsphere.info.value;

        const index = user.vsphere.info.value.findIndex(
            (h) => h.host === hostName
        );
        if (index == -1) {
            return res.redirect("/vs/hosts");
        }
    } else {
        return res.redirect("/vs/hosts");
    }

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
    // const vm = req.query.vm;
    const vmName = req.query.vmName;
    const hostName = req.query.hosts;
    const { vm } = req.query;

    const { user } = req.session;

    const username = user.vsphere.v_real.vr_id;
    const password = user.vsphere.v_real.vr_pw;
    const vRealizeIP = user.vsphere.v_real.vr_ip;
    let realUsage;
    //🟦실습환경에서 하기
    // try {
    //     const token = await getToken(username, password, vRealizeIP);
    //     req.session.token = token;
    //     realUsage = await getResourceUsage(vmName, vRealizeIP, token);
    // } catch (error) {
    //     return res.render("error", {
    //         errorName: "vRealize Operations",
    //         errorMsg:
    //             "등록된 vRealize Operations로 정보를 요청하던중 Error가 발생했습니다. 등록된 vRealize Operations 정보를 다시 확인해주거나, vRealize 가상머신에 전원이 켜져있는지 확인해 주세요.",
    //     });
    // }
    //🟦실습환경에서 하기

    //🟥집에서 하기
    const TestRealUsageList = [TestRealUsage, Test2RealUsage, Test3RealUsage];
    const randomIndex = Math.floor(Math.random() * TestRealUsageList.length);
    const randomValue = TestRealUsageList[randomIndex];
    realUsage = randomValue;
    //🟥집에서 하기

    if (!realUsage || !realUsage.values) {
        req.session.real = null;
        return res.render("vmRealError", { vmName });
    }

    const dataLength = realUsage.values[0]["stat-list"].stat[0].data.length;
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
        //12개 이상이면 12개만 짜르기
        const tempMemTimeStamp = [];
        const tempMemDataUsage = [];
        const tempCpuTimeStamp = [];
        const tempCpuDataUsage = [];

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
        realUsage.values[0]["stat-list"].stat[0].timestamps = tempMemTimeStamp;
        realUsage.values[0]["stat-list"].stat[0].data = tempMemDataUsage;
        realUsage.values[0]["stat-list"].stat[1].timestamps = tempCpuTimeStamp;
        realUsage.values[0]["stat-list"].stat[1].data = tempCpuDataUsage;
    }

    req.session.real = realUsage;

    return res.render("vmReal", { hostName, vmName, realUsage });
};

export const getVRealData = async (req, res) => {
    const realUsage = req.session.real;

    let cpuAvg; //Circle 차트
    let memoryAvg;

    cpuAvg = parseFloat(
        calculateAverage(realUsage.values[0]["stat-list"].stat[1].data)
    ).toFixed(2);
    memoryAvg = parseFloat(
        calculateAverage(realUsage.values[0]["stat-list"].stat[0].data)
    ).toFixed(2);

    realUsage.cpuAvg = cpuAvg;
    realUsage.memoryAvg = memoryAvg;

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
    try {
        if (findVMInfo.info.value.memory.size_MiB != memory_size) {
            await patchMemory(vm, sessionID, vCenterIP, memory_size);
        }
        if (findVMInfo.info.value.cpu.count != cpu_count) {
            await patchCPU(vm, sessionID, vCenterIP, cpu_count);
        }
    } catch (error) {
        return res.render("error", {
            errorName: "vCenter",
            errorMsg:
                "등록된 vCenter로 정보를 요청하던중 Error가 발생했습니다. 등록된 vSphere 정보를 다시 확인해주거나, vCenter에 전원이 켜져있는지 확인해 주세요.",
        });
    }
    const changeVMInfo = await getVMInfo(vm, sessionID, vCenterIP);

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
    try {
        await deleteVM(vmName, sessionID, vCenterIP);
    } catch (error) {
        return res.render("error", {
            errorName: "vCenter",
            errorMsg:
                "등록된 vCenter로 정보를 요청하던중 Error가 발생했습니다. 등록된 vSphere 정보를 다시 확인해주거나, vCenter에 전원이 켜져있는지 확인해 주세요.",
        });
    }
    return res.redirect(`/vs/hosts/vms?hosts=${host}`);
};

export const getCreateVM = async (req, res) =>
    res.render("vmCreate", { hosts: req.query.hosts });

export const postCreateVM = async (req, res) => {
    const { user } = req.session;
    const vCenterIP = user.vsphere.vc_ip;

    const { host_name, vm_name, os_name, memory_size, cpu_count } = req.body;
    let datastore;
    if (host_name == "host-56004" || host_name == "host-57005")
        datastore = "datastore-48019";
    // else if (host_name == "host-40004" || host_name == "host-59009")
    //     datastore = "datastore-48021";
    // else if (host_name == "host-59012" || host_name == "host-59015")
    //     datastore = "datastore-48021";
    else {
        console.log("vm 생성중에 hostName 관련 문제가 있음.");
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
    try {
        await createVM(sessionID, vCenterIP, param);
    } catch (error) {
        return res.render("error", {
            errorName: "vCenter",
            errorMsg:
                "등록된 vCenter로 정보를 요청하던중 Error가 발생했습니다. 등록된 vSphere 정보를 다시 확인해주거나, vCenter에 전원이 켜져있는지 확인해 주세요.",
        });
    }
    return res.redirect(`/vs/hosts/vms?hosts=${host_name}`);
};

export const getVMPower = async (req, res) => {
    try {
        const { user } = req.session;
        const { vm, hosts, power } = req.query;
        const vCenterIP = user.vsphere.vc_ip;

        // if (power == 1) {
        //     // OFF -> POWER_ON
        //     await vmPowerOn(vm, sessionID, vCenterIP);
        // } else if (power == 0) {
        //     // ON -> POWER_OFF
        //     await vmPowerOff(vm, sessionID, vCenterIP);
        // }
        // 🟥집에서 실행
        const updatedUser = await User.findByIdAndUpdate(
            user._id,
            {
                $set: {
                    "vsphere.info.value.$[inner].vmList.value.$[outer].power_state":
                        power == 1 ? "POWER_ON" : "POWER_OFF",
                },
            },
            {
                new: true,
                arrayFilters: [{ "inner.host": hosts }, { "outer.vm": vm }],
            }
        );
        console.log(updatedUser);
        console.log(updatedUser.vsphere.info.value[1].vmList.value[0]);
        req.session.user = updatedUser;

        // 🟥집에서 실행

        return res.redirect(`/vs/hosts/vms?hosts=${hosts}`);
    } catch (err) {
        console.log(err);
        return res.render("error", {
            errorName: "vCenter",
            errorMsg:
                "등록된 vCenter로 정보를 요청하던중 Error가 발생했습니다. 등록된 vSphere 정보를 다시 확인해주거나, vCenter에 전원이 켜져있는지 확인해 주세요.",
        });
    }
};
