const express = require("express");
const https = require("https");

const app = express();
const port = 3000;

// vSphere API 인증 정보
const username = "administrator@vsphere.local";
const password = "123Qwer!";
const host = "192.168.0.102";
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
      console.log("모든 가상 머신 정보:");
      console.log(vms);
      res.send(vms);
    });
  });
});

app.listen(port, () => {
  console.log(`Express app listening at http://localhost:${port}`);
});