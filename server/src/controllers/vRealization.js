const https = require("https");

// vRealize Operations API 호스트 이름
const vropsHostname = "192.168.0.109";

// vRealize Operations API 인증 토큰
const vropsToken =
  "40GNdlJaQexMHw9guyT772J3AAddabBOcHYUZkIi3REJYkDA56FV97/KFDMJujOV";

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
  rejectUnauthorized: false,
};

// 가상 머신의 CPU 사용률을 가져오는 함수
async function getCPUUsage(resourceId) {
  console.log("\ngetCPUUsage 호출\n");
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
    rejectUnauthorized: false,
  };
  console.log(vropsOptions);

  return await new Promise((resolve, reject) => {
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
async function getAllCPUUsages() {
  console.log("\ngetAllCPUUsages 호출\n");
  return await new Promise((resolve, reject) => {
    const req = https.request(vropsOptions, (res) => {
      let data = "";
      let i = 0;
      res.on("data", (chunk) => {
        console.log(i++ + "\n");
        console.log(chunk);
        data += chunk;
      });
      res.on("end", () => {
        console.log("end 들어옴");
        try {
          console.log("여긴 돼?");
          console.log(data);
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
        } catch (err) {
          console.error(err);
        }
      });
    });

    req.on("error", (error) => {
      reject(error);
    });

    req.end();
  });
}

// 5초마다 모든 가상 머신의 CPU 사용률을 가져와 출력하는 함수
export const getCPUUsagefucn = async (req, res) => {
  console.log("\ngetCPUUsagefucn 호출\n");
  try {
    const cpuUsages = await getAllCPUUsages();
    console.log(cpuUsages);
    return res.send(cpuUsages);
  } catch (error) {
    console.error(error);
  }
};

//setInterval(getCPUUsagefunction, 500)
