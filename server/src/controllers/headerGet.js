const https = require("https");
const fetch = require("node-fetch");
const xml2js = require("xml2js");

const username = "administrator@vsphere.local";
const password = "123Qwer!";
const hostIP = "192.168.0.102";

// XML을 JSON으로 변환하는 함수
async function parseXmlResponse(xml) {
  const parsedResult = await parseStringPromise(xml);
  return parsedResult;
}

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
  console.log(`${apiEndpoint}/auth/token/acquire 로 요청`);

  const agent = new https.Agent({ rejectUnauthorized: false });

  // vRealize Operations에 인증 요청 보내기
  const authResponse = await fetch(`${apiEndpoint}/auth/token/acquire`, {
    method: "POST",
    body: JSON.stringify({ username, password }),
    headers: { "Content-Type": "application/json" },
    agent,
  });

  if (!authResponse.ok) {
    console.log("오류 났음");
    throw new Error("Failed to authenticate with vRealize Operations.");
  }

  const authData = await authResponse.text();
  console.log("authData 지남");
  console.log(authData);

  let authJson = null;
  const parser = new xml2js.Parser({ explicitArray: false });
  parser.parseString(authData, (err, result) => {
    if (err) {
      console.error("Failed to parse XML:", err);
      return;
    }

    console.log(result); // JSON 형식의 객체
    authJson = result;
  });
  console.log("parser");
  console.log(parser);

  console.log("authJson");
  console.log(authJson);

  // 인증 토큰 얻기
  const authToken = authJson.token;
  return res.send(authToken);

  // vCenter의 정보 조회
  const vCenterResponse = await fetch(
    `${apiEndpoint}/resources?resourceKind=VCENTER`,
    {
      headers: {
        Authorization: `vRealizeOpsToken ${authToken}`,
      },
      agent,
    }
  );
  console.log(`${apiEndpoint}/resources?resourceKind=VCENTER 로 확인`);

  if (!vCenterResponse.ok) {
    console.log("여기서 Error");
    throw new Error("Failed to fetch vCenter data.");
  }

  const vCenterData = await vCenterResponse.json();
  console.log("vCenterData 지났음");
  console.log(vCenterData);

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
