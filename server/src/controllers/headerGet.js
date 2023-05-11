const https = require("https");
const fetch = require("node-fetch");

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

// vRealize Operations API를 통해 vCenter의 ID 조회하기
export async function getVCenterId(req, res) {
  // vRealize Operations API의 엔드포인트 URL
  const apiEndpoint = "https://192.168.0.109/suite-api/api";

  // vRealize Operations 인증 정보
  const username = "admin";
  const password = "123Qwer!";

  // vCenter의 이름
  const vCenterName = "192.168.0.102";

  // vRealize Operations에 인증 요청 보내기
  const authResponse = await fetch(`${apiEndpoint}/auth/token/acquire`, {
    method: "POST",
    body: JSON.stringify({ username, password }),
    headers: { "Content-Type": "application/json" },
  });

  if (!authResponse.ok) {
    throw new Error("Failed to authenticate with vRealize Operations.");
  }

  const authData = await authResponse.json();

  // 인증 토큰 얻기
  const authToken = authData.token;

  // vCenter의 정보 조회
  const vCenterResponse = await fetch(
    `${apiEndpoint}/resources?resourceKind=VCENTER`,
    {
      headers: {
        Authorization: `vRealizeOpsToken ${authToken}`,
      },
    }
  );

  if (!vCenterResponse.ok) {
    throw new Error("Failed to fetch vCenter data.");
  }

  const vCenterData = await vCenterResponse.json();

  // vCenter의 ID 찾기
  const vCenter = vCenterData.resources.find(
    (resource) => resource.name === vCenterName
  );

  if (!vCenter) {
    throw new Error(`vCenter '${vCenterName}' not found.`);
  }

  const vCenterId = vCenter.identifier;

  return vCenterId;
}

// vCenter의 ID 조회하기
getVCenterId()
  .then((vCenterId) => {
    console.log("vCenter ID:", vCenterId);
  })
  .catch((error) => {
    console.error("Error:", error);
  });
