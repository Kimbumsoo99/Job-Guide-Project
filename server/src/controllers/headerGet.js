const https = require("https");

const username = "administrator@vsphere.local";
const password = "123Qwer!";
const hostIP = "192.168.0.102";

export const getSessionId = async (username, password, hostIP) => {
  console.log("\ngetSessionId 호출\n");
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
