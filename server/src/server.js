const express = require("express");
const https = require("https");

const app = express();
const port = 3000;

// vSphere API 인증 정보
const username = "vSphere_username";
const password = "vSphere_password";
const host = "vCenter_Server_IP_Address";
const vmwareHeaders = {
  "Content-Type": "application/json",
  Authorization:
    "Basic " + Buffer.from(username + ":" + password).toString("base64"),
};

app.get("/", (req, res) => {
  // HTTPS 요청 보내기
  const options = {
    headers: vmwareHeaders,
  };
  https.get(`https://${host}/rest/vcenter/vm`, options, (response) => {
    let data = "";

    response.on("data", (chunk) => {
      data += chunk;
    });

    response.on("end", () => {
      const vms = JSON.parse(data);
      console.log("사용자 A의 가상 머신 정보:");
      const userAVMs = vms.value.filter((vm) => vm.owner === "userA");
      console.log(userAVMs);
      res.send(userAVMs);
    });
  });
});

app.listen(port, () => {
  console.log(`Express app listening at http://localhost:${port}`);
});
