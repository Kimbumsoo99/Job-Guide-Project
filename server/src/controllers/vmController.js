const https = require("https");

const username = "administrator@vsphere.local";
const password = "123Qwer!";
const hostIP = "192.168.0.102";

export const home = (req, res) => res.render("home");

const getSessionId = async () => {
  const data = JSON.stringify({});
  let sessionIdJson;

  const options = {
    hostname: hostIP,
    port: 443,
    path: "/rest/com/vmware/cis/session",
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization:
        "Basic " + Buffer.from(username + ":" + password).toString("base64"),
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
        const jsonResponse = JSON.parse(responseBody);
        console.log("JSON 객체 값");
        console.log(jsonResponse);
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

  sessionIdJson = res.value;
  console.log("session ID:", sessionIdJson);
  return sessionIdJson;
};

export const getVm = async (req, res) => {
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

    https.get(`https://${hostIP}/rest/vcenter/host`, options, (response) => {
      let data = "";

      response.on("data", (chunk) => {
        data += chunk;
      });

      response.on("end", () => {
        const vms = JSON.parse(data);
        console.log("모든 가상 머신 정보:");
        console.log(vms);
        return vms; //json

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
