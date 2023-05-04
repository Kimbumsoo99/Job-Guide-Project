import { getSessionId } from "../controllers/headerGet";
import User from "../models/User";
import TestData from "./data.json";
import HostData from "./host.json";
import VmData from "./vmlist.json";

const https = require("https");

let hostIP = "192.168.0.102";

export const hostPage = (req, res) => res.render("host");

function isEmptyArr(arr) {
  if (Array.isArray(arr) && arr.length === 0) {
    return true;
  }

  return false;
}

export const getAddBasicInfo = (req, res) => {
  const { user } = req.session;
  if (isEmptyArr(user.vsphere)) return res.render("cloudinput");
  return res.redirect("vm/data");
};

export const postAddBasicInfo = async (req, res) => {
  const { vm_id, vm_pw, vm_ip } = req.body;
  const { user } = req.session;
  const { _id } = user;

  const updatedUser = await User.findByIdAndUpdate(
    _id,
    {
      vsphere: {
        vs_id: vm_id,
        vs_pw: vm_pw,
        vs_ip: vm_ip,
      },
    },
    { new: true } // 최근 업데이트 된 데이터로 변경
  );
  req.session.user = updatedUser;
  console.log(req.session.user);
  return res.redirect("vm/data");
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
 */
export const getVMName = async (sessionId) => {
  const options = getOptions(sessionId);
  options.hostname = hostIP;
  options.port = 443;
  options.path = "/rest/vcenter/vm";
  options.method = "GET";

  const res = await httpsGet(`https://${hostIP}/rest/vcenter/vm`, options);
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

export const patchMemory = async (request, response) => {
  const username = "administrator@vsphere.local";
  const password = "123Qwer!";
  const hostIP = "192.168.0.102";
  try {
    const sessionId = await getSessionId(username, password, hostIP);
    const vmId = await getVMName(sessionId);

    const options = {
      hostname: hostIP,
      path: `/rest/vcenter/vm/${vmId}/hardware/memory`,
      port: 443,
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "vmware-api-session-id": sessionId,
      },
      rejectUnauthorized: false,
    };

    const apiReq = https.request(options, (apiRes) => {
      console.log(`statusCode: ${apiRes.statusCode}`);

      apiRes.on("data", (d) => {
        process.stdout.write(d);
      });
    });

    apiReq.on("error", (error) => {
      console.error(error);
    });

    const postData = JSON.stringify({
      spec: {
        hot_add_enabled: true,
        size_MiB: 6144, // Set the new memory size in MiB
      },
    });

    apiReq.write(postData);
    apiReq.end();
    console.log("요청 성공");
    return response.redirect("/");
  } catch (error) {
    console.error(error);
    return response.status(500).send("Error");
  }
};

export const stopPower = async (request, response) => {
  const username = "administrator@vsphere.local";
  const password = "123Qwer!";
  const hostIP = "192.168.0.102";
  try {
    const sessionId = await getSessionId(username, password, hostIP);
    const vm = await getVMName(sessionId);
    const data = JSON.stringify({});

    const options = {
      hostname: hostIP,
      path: `/rest/vcenter/vm/${vm}/power/stop`,
      port: 443,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "vmware-api-session-id": sessionId,
      },
      rejectUnauthorized: false,
    };

    const apiReq = https.request(options, (apiRes) => {
      console.log(`statusCode: ${apiRes.statusCode}`);

      apiRes.on("data", (d) => {
        process.stdout.write(d);
      });
    });

    apiReq.on("error", (error) => {
      console.error(error);
    });

    apiReq.write(data);
    apiReq.end();
    console.log("요청 성공");
    return response.redirect("/");
  } catch (error) {
    console.error(error);
    return response.status(500).send("Error");
  }
};

export const startPower = async (request, response) => {
  const username = "administrator@vsphere.local";
  const password = "123Qwer!";
  const hostIP = "192.168.0.102";
  try {
    const sessionId = await getSessionId(username, password, hostIP);
    const vm = await getVMName(sessionId);
    const data = JSON.stringify({});

    const options = {
      hostname: hostIP,
      path: `/rest/vcenter/vm/${vm}/power/start`,
      port: 443,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "vmware-api-session-id": sessionId,
      },
      rejectUnauthorized: false,
    };

    const apiReq = https.request(options, (apiRes) => {
      console.log(`statusCode: ${apiRes.statusCode}`);

      apiRes.on("data", (d) => {
        process.stdout.write(d);
      });
    });

    apiReq.on("error", (error) => {
      console.error(error);
    });

    apiReq.write(data);
    apiReq.end();
    console.log("요청 성공");
    return response.redirect("/");
  } catch (error) {
    console.error(error);
    return response.status(500).send("Error");
  }
};

export const testGetHost = async (req, res) => {
  console.log(req.query);

  const {
    session: {
      user: { _id },
    },
  } = req;
  const { vs_id, vs_pw, vs_ip } = req.query ? req.query : null;

  //  const user = req.session.user ? req.session.user : null;
  //  console.log(user);
  //  console.log(req.session.user);

  const testData = JSON.parse(JSON.stringify(HostData));

  if (vs_id && vs_pw && vs_ip) {
    try {
      const isDuplicated = await User.exists({
        _id,
        "vsphere.vs_ip": vs_ip,
      });
      if (isDuplicated) {
        console.log("Duplicate data");
        return redirect("/");
      } else {
        const updatedUser = await User.findByIdAndUpdate(
          _id,
          {
            $push: {
              vsphere: {
                vs_id,
                vs_pw,
                vs_ip,
                info: { hostInfo: testData },
              },
            },
          },

          { new: true } // 최근 업데이트 된 데이터로 변경
        );
        req.session.user = updatedUser;
        return res.redirect("/test/page");
      }
    } catch (err) {
      console.log(err);
      return res.redirect("/").statusCode(400);
    }
  } else {
    return res.redirect("/test/page");
  }
};

export const testHostInfo = async (req, res) => {
  return res.render("hostPage");
};

export const testgetCloudVM = async (req, res) => {
  const vmList = VmData;

  return vmList;
};

export const testVMPage = async (req, res) => {
  const vmInfo = await testgetCloudVM();
  console.log("여까지 옴  11111111");
  console.log(req.query);

  const {
    session: {
      user: { _id },
    },
  } = req;
  const { vs_id, vs_pw, vs_ip, hosts } = req.query ? req.query : null;

  console.log(vmInfo);
  if (vs_id && vs_pw && vs_ip && hosts) {
    try {
      const updatedUser = await User.findByIdAndUpdate(
        {
          _id,
          "vsphere.vs_id": vs_id,
          "vsphere.vs_pw": vs_pw,
          "vsphere.vs_ip": vs_ip,
          "vsphere.info.hostInfo.value.host": hosts, // host가 host-36006인 객체를 찾음
        },
        {
          $set: {
            "vsphere.$[outer].info.hostInfo.value.$[inner].vmInfo": vmInfo,
          },
        },
        {
          new: true, // 최근 업데이트 된 데이터로 변경
          arrayFilters: [
            { "outer.vs_id": vs_id }, // vs_id가 일치하는 객체를 찾음
            { "inner.host": hosts }, // host가 host-36006인 객체를 찾음
          ],
        }
      );
      req.session.user = updatedUser;
      console.log("여까지 옴  2222222222");
      return res.redirect(
        `/test/page/vm?hosts=${hosts}&vs_id=${vs_id}&vs_ip=${vs_ip}`
      );
    } catch (err) {
      console.log(err);
      return res.redirect("/").statusCode(400);
    }
  } else {
    return res.redirect(
      `/test/page/vm?hosts=${hosts}&vs_id=${vs_id}&vs_ip=${vs_ip}`
    );
  }
};

export const testVMInfo = async (req, res) => {
  const {
    session: {
      user: { _id },
    },
  } = req;
  const { hosts, vs_id, vs_ip } = req.query ? req.query : null;
  console.log(req.query);
  console.log(hosts);

  const user = await User.findById({
    _id,
    "vsphere.vs_id": vs_id,
    "vsphere.vs_ip": vs_ip,
  });

  let VMArray;
  console.log(user.vsphere.length);
  for (let i = 0; i < user.vsphere.length; i++) {
    if (user.vsphere[i].vs_id === vs_id && user.vsphere[i].vs_ip === vs_ip) {
      VMArray = user.vsphere[i];
      break;
    }
  }
  console.log(VMArray);
  let hostVMArray;
  console.log(VMArray.info.hostInfo.value.length);
  for (let i = 0; i < VMArray.info.hostInfo.value.length; i++) {
    if (VMArray.info.hostInfo.value[i].host === hosts) {
      hostVMArray = VMArray.info.hostInfo.value[i].vmInfo.value;
      break;
    }
  }
  console.log(hostVMArray);

  //return res.redirect("/");
  return res.render("vmPage", { hosts: hosts, vmList: hostVMArray });
};
