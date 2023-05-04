import { getSessionId } from "./headerGet";
import User from "../models/User";

const https = require("https");

let hostIP = "192.168.0.102";

export const home = (req, res) => res.render("home");

export const getAddBasicInfo = (req, res) => {
  const { user } = req.session;
  console.log(user.vsphere);
  if (isEmptyArr(user.vsphere) || req.query.add == 1)
    return res.render("cloudinput");
  // 특정 상황 시 아래가기
  return res.redirect("/vm/data");
};

export const postAddBasicInfo = async (req, res) => {
  const { vm_id, vm_pw, vm_ip } = req.body;

  return res.redirect(`/vm/data?vs_id=${vm_id}&vs_pw=${vm_pw}&vs_ip=${vm_ip}`);
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
  try {
    const sessionId = await getSessionId();
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
  try {
    const sessionId = await getSessionId();
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
  try {
    const sessionId = await getSessionId();
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

export const hostPageRender = async (req, res) => {
  return res.render("hostPage");
};

export const getVMList = async (sessionId, vCenterIP, hosts) => {
  const options = getOptions(sessionId);

  const vmList = await httpsGet(
    `https://${vCenterIP}/rest/vcenter/vm?filter.hosts=${hosts}`,
    options
  );
  return vmList;
};
