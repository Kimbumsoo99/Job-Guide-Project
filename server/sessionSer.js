const https = require("https");
const username = "administrator@vsphere.local";
const password = "123Qwer!";
const host = "192.168.0.102";
const data = JSON.stringify({});
const options = {
  hostname: host,
  port: 443,
  path: "/api/session",
  path: "/rest/com/vmware/cis/session",
  method: "POST",
  headers: {
    "Content-Type": "application/json",
Authorization: "Basic " + Buffer.from(username + ":" + password).toString("base64"),
},
rejectUnauthorized: false,
};

const req = https.request(options, (res) => {
let responseBody = "";

res.on("data", (chunk) => {
  responseBody += chunk;
});

res.on("end", () => {
  const jsonResponse = JSON.parse(responseBody);
  console.log(jsonResponse);
});
});

req.on("error", (error) => {
console.error(error);
});

req.write(data);
req.end();
