const https = require("https");

// vRealize Operations API 호스트 이름
const vropsHostname = "192.168.0.109";

// vRealize Operations API 인증 토큰
const vropsToken =
  "v1:geslnuXMSWyAmGwwRiuaOQ==:CxU07tVJYwDASLytZDPuGg==:H8sW+Hcq3s1cvhOSoUOUxDTtq4NUVcDCPsBYlUT2Eag47eSpm3n3OK2K4LrPSbd7:3971379722";

// vRealize Operations API 경로
const vropsPath =
  "/suite-api/api/resources?adapterKind=VMWARE&resourceKind=VirtualMachine";

// vRealize Operations API 옵션
const vropsOptions = {
  hostname: vropsHostname,
  port: 443,
  path: vropsPath,
  method: "GET",
  headers: {
    "Content-Type": "application/json",
    Authorization: `vRealizeOpsToken ${vropsToken}`,
  },
};

// 가상 머신의 CPU 사용률을 가져오는 함수
function getCPUUsage(resourceId) {
  // vRealize Operations API 경로
  const vropsPath = `/suite-api/api/resources/${resourceId}/stats?statKey=cpu|usage_average`;

  // vRealize Operations API 옵션
  const vropsOptions = {
    hostname: vropsHostname,
    port: 443,
    path: vropsPath,
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `vRealizeOpsToken ${vropsToken}`,
    },
  };

  return new Promise((resolve, reject) => {
    const req = https.request(vropsOptions, (res) => {
      let data = "";

      res.on("data", (chunk) => {
        data += chunk;
      });

      res.on("end", () => {
        const metrics =
          JSON.parse(data)._embedded["vrealize-ops-embedded:stat-list"][
            "vrealize-ops-embedded:stat"
          ];
        const latestMetric = metrics[metrics.length - 1];
        const cpuUsage = latestMetric["stat-list"]["stat"][0]["data"][0];
        resolve(cpuUsage);
      });
    });

    req.on("error", (error) => {
      reject(error);
    });

    req.end();
  });
}

// 모든 가상 머신의 CPU 사용률을 가져오는 함수
function getAllCPUUsages() {
  return new Promise((resolve, reject) => {
    const req = https.request(vropsOptions, (res) => {
      let data = "";

      res.on("data", (chunk) => {
        data += chunk;
      });

      res.on("end", () => {
        const resources = JSON.parse(data)._embedded["vr:resourceDto"];

        const cpuMetricsPromises = resources.map((resource) => {
          const resourceId = resource.identifier.id;
          return getCPUUsage(resourceId);
        });

        Promise.all(cpuMetricsPromises)
          .then((cpuUsages) => {
            resolve(cpuUsages);
          })
          .catch((error) => {
            reject(error);
          });
      });
    });

    req.on("error", (error) => {
      reject(error);
    });

    req.end();
  });
}

// 5초마다 모든 가상 머신의 CPU 사용률을 가져와 출력하는 함수
export const getCPUUsagefunction = async (req, res) => {
  try {
    const cpuUsages = await getAllCPUUsages();
    console.log(cpuUsages);
    return res.send(cpuUsages);
  } catch (error) {
    console.error(error);
  }
};

//setInterval(getCPUUsagefunction, 500)
