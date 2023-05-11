const fetch = require("node-fetch");

// vRealize Operations API의 엔드포인트 URL
const apiEndpoint = "https://your-vrops-server/suite-api/api";

// vRealize Operations 인증 정보
const username = "admin";
const password = "123Qwer";

// vCenter 및 가상 머신 정보
const vCenterId = "your-vcenter-id";
const vmId = "your-vm-id";

// vRealize Operations API를 통해 가상 머신의 CPU 사용률 가져오기
export async function getVmCpuUsage(req, res) {
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

  return res.send(authToken);
}
