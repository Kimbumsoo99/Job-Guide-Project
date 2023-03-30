const express = require("express");
const https = require("https");
const sdk = require('/Downloads/SDK');

const app = express();
const port = 4000;

const vcUsername = 'administrator';
const vcPassword = '123Qwer!';
const vcUrl = '192.168.0.102';

// SDK 초기화
const client = new sdk.CoreClient();
client.setBaseUrl(vcUrl);
client.setAuthentication(new sdk.BasicAuthentication(vcUsername, vcPassword));

app.get("/", (req, res) => {
  // vCenter 서버로 GET 요청 보내기
  const vmsService = new sdk.vcenter.VM(client);
  vmsService.list().then((vms) => {
    console.log("모든 가상 머신 정보:");
    console.log(vms);
    res.send(vms);
  }).catch((err) => {
    console.error('가상 머신 정보를 가져오는 도중 오류가 발생하였습니다.');
    console.error(err);
    res.status(500).send(err);
  });
});

app.listen(port, () => {
  console.log(`Express app listening at http://localhost:${port}`);
});