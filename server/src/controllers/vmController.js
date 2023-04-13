import { resolve } from "path";
import { getSessionId } from "./headerGet";
import exp from "constants";

const https = require("https");

const username = "administrator@vsphere.local";
const password = "123Qwer!";
const hostIP = "192.168.0.102";

export const home = (req, res) => res.render("home");

export const getVmAfterHostCPU = async (req, res) => {
  try {
    const sessionIdJson = await getSessionId(); //sessionIdJson == vmware-api-session-id
    console.log("SessionID GET After: " + sessionIdJson); // 이부분에서 가져온 Session ID를 확인
    console.log("Error SessionID: " + sessionIdJson.value); // 이 부분은 에러

    const vmwareHeaders = {
      "Content-Type": "application/json",
      Authorization:
        "Basic " + Buffer.from(username + ":" + password).toString("base64"),
      "vmware-api-session-id": sessionIdJson,
    };

    const options = {
      headers: vmwareHeaders,
      rejectUnauthorized: false,
    };

    https.get(`https://${hostIP}/rest/vcenter/vm`, options, (response) => {
      let data = "";

      response.on("data", (chunk) => {
        data += chunk;
      });

      response.on("end", () => {
        const vms = JSON.parse(data);
        console.log("모든 가상 머신 정보:");
        console.log(vms);
        const vmId = vms.value[0].vm;

        return https.get(
          `https://${hostIP}/rest/vcenter/vm/${vmId}`,
          options,
          (response) => {
            let data = "";

            response.on("data", (chunk) => {
              data += chunk;
            });

            response.on("end", () => {
              const cpuInfo = JSON.parse(data);
              console.log("CPU 사용량 정보:");
              console.log(cpuInfo);
              return res.send(cpuInfo);
            });
          }
        );
      });
    });
  } catch (error) {
    console.error(error);
    return res.status(500).send("Error");
  }
};

export const getVMName = async (sessionId) => {
  const data = JSON.stringify({});
  const sessionIdJson = sessionId; //sessionIdJson == vmware-api-session-id
  console.log("SessionID GET After: " + sessionIdJson); // 이부분에서 가져온 Session ID를 확인

  const options = {
    hostname: hostIP,
    port: 443,
    path: "/rest/vcenter/vm",
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization:
        "Basic " + Buffer.from(username + ":" + password).toString("base64"),
      "vmware-api-session-id": sessionIdJson,
    },
    rejectUnauthorized: false,
  };
  const res = await new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      let responseBody = "";

      res.on("data", (chunk) => {
        responseBody += chunk;
      });

      res.on("end", () => {
        const vms = JSON.parse(responseBody);
        console.log("모든 가상 머신 정보:");
        console.log(vms);
        resolve(vms);
      });
    });
    req.on("error", (error) => {
      console.error(error);
      reject(error);
    });
    req.write(data);
    req.end();
  });

  const vmId = res.value[0].vm;
  console.log("VM name:", vmId);
  return vmId;
};

export const getVMInfo = async (req, res) => {
  try {
    const sessionId = await getSessionId();
    const vmId = await getVMName(sessionId);

    const vmwareHeaders = {
      "Content-Type": "application/json",
      Authorization:
        "Basic " + Buffer.from(username + ":" + password).toString("base64"),
      "vmware-api-session-id": sessionId,
    };

    const options = {
      headers: vmwareHeaders,
      rejectUnauthorized: false,
    };

    https.get(
      `https://${hostIP}/rest/vcenter/vm/${vmId}`,
      options,
      (response) => {
        let data = "";

        response.on("data", (chunk) => {
          data += chunk;
        });

        response.on("end", () => {
          const vmInfo = JSON.parse(data);
          console.log("VM 사용량 정보:");
          console.log(vmInfo);
          return res.send(vmInfo);
        });
      }
    );
  } catch (error) {
    console.error(error);
    return res.status(500).send("Error");
  }
};

export const getDataCenterList = async (req, res) => {
  try {
    const sessionId = await getSessionId();

    const vmwareHeaders = {
      "Content-Type": "application/json",
      Authorization:
        "Basic " + Buffer.from(username + ":" + password).toString("base64"),
      "vmware-api-session-id": sessionId,
    };

    const options = {
      headers: vmwareHeaders,
      rejectUnauthorized: false,
    };

    https.get(
      `https://${hostIP}/rest/vcenter/datacenter`,
      options,
      (response) => {
        let data = "";

        response.on("data", (chunk) => {
          data += chunk;
        });

        response.on("end", () => {
          const dataCenterList = JSON.parse(data);
          console.log("DataCenter 정보:");
          console.log(dataCenterList);
          return res.send(dataCenterList);
        });
      }
    );
  } catch (error) {
    console.error(error);
    return res.status(500).send("Error");
  }
};

export const getDataStoreList = async (req, res) => {
  try {
    const sessionId = await getSessionId();

    const vmwareHeaders = {
      "Content-Type": "application/json",
      Authorization:
        "Basic " + Buffer.from(username + ":" + password).toString("base64"),
      "vmware-api-session-id": sessionId,
    };

    const options = {
      headers: vmwareHeaders,
      rejectUnauthorized: false,
    };

    https.get(
      `https://${hostIP}/rest/vcenter/datastore`,
      options,
      (response) => {
        let data = "";

        response.on("data", (chunk) => {
          data += chunk;
        });

        response.on("end", () => {
          const dataStoreList = JSON.parse(data);
          console.log("DataStore 정보:");
          console.log(dataStoreList);
          return res.send(dataStoreList);
        });
      }
    );
  } catch (error) {
    console.error(error);
    return res.status(500).send("Error");
  }
};

export const getHost = async (req, res) => {
  try {
    const sessionId = await getSessionId();

    const vmwareHeaders = {
      "Content-Type": "application/json",
      Authorization:
        "Basic " + Buffer.from(username + ":" + password).toString("base64"),
      "vmware-api-session-id": sessionId,
    };

    const options = {
      headers: vmwareHeaders,
      rejectUnauthorized: false,
    };

    https.get(`https://${hostIP}/rest/vcenter/host`, options, (response) => {
      let data = "";

      response.on("data", (chunk) => {
        data += chunk;
      });

      response.on("end", () => {
        const hostList = JSON.parse(data);
        console.log("Host 정보:");
        console.log(hostList);
        return res.send(hostList);
      });
    });
  } catch (error) {
    console.error(error);
    return res.status(500).send("Error");
  }
};

export const getNetwork = async (req, res) => {
  try {
    const sessionId = await getSessionId();

    const vmwareHeaders = {
      "Content-Type": "application/json",
      Authorization:
        "Basic " + Buffer.from(username + ":" + password).toString("base64"),
      "vmware-api-session-id": sessionId,
    };

    const options = {
      headers: vmwareHeaders,
      rejectUnauthorized: false,
    };

    https.get(`https://${hostIP}/rest/vcenter/network`, options, (response) => {
      let data = "";

      response.on("data", (chunk) => {
        data += chunk;
      });

      response.on("end", () => {
        const networkList = JSON.parse(data);
        console.log("Network 정보:");
        console.log(networkList);
        return res.send(networkList);
      });
    });
  } catch (error) {
    console.error(error);
    return res.status(500).send("Error");
  }
};

export const getHardMemory = async (req, res) => {
  try {
    const sessionId = await getSessionId();
    const vm = await getVMName(sessionId);

    const vmwareHeaders = {
      "Content-Type": "application/json",
      "vmware-api-session-id": sessionId,
    };

    const options = {
      headers: vmwareHeaders,
      rejectUnauthorized: false,
    };

    https.get(
      `https://${hostIP}/rest/vcenter/vm/${vm}/hardware/memory`,
      options,
      (response) => {
        let data = "";

        response.on("data", (chunk) => {
          data += chunk;
        });

        response.on("end", () => {
          const memoryInfo = JSON.parse(data);
          console.log("Memory 정보:");
          console.log(memoryInfo);
          return res.send(memoryInfo);
        });
      }
    );
  } catch (error) {
    console.error(error);
    return res.status(500).send("Error");
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
        size_MiB: 2048, // Set the new memory size in MiB
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
