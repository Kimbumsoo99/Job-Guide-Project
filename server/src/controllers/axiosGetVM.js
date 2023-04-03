const https = require("https");

const hostname = "vcenter-server-name";
const username = "username";
const password = "password";

const options = {
  method: "POST",
  hostname: hostname,
  path: "/rest/com/vmware/cis/session",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
};

const data = {
  username: username,
  password: password,
};

const req = https.request(options, (res) => {
  let chunks = [];

  res.on("data", (chunk) => {
    chunks.push(chunk);
  });

  res.on("end", () => {
    let body = Buffer.concat(chunks);
    let sessionId = JSON.parse(body).value;
    console.log(`Session ID: ${sessionId}`);

    const vmOptions = {
      method: "GET",
      hostname: hostname,
      path: "/rest/vcenter/vm",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${sessionId}`,
      },
    };

    const vmReq = https.request(vmOptions, (vmRes) => {
      let vmChunks = [];

      vmRes.on("data", (vmChunk) => {
        vmChunks.push(vmChunk);
      });

      vmRes.on("end", () => {
        let vmBody = Buffer.concat(vmChunks);
        let vms = JSON.parse(vmBody).value;
        console.log("VMs: ");
        console.log(vms);
      });
    });

    vmReq.on("error", (error) => {
      console.error(error);
    });

    vmReq.end();
  });
});

req.on("error", (error) => {
  console.error(error);
});

req.write(JSON.stringify(data));
req.end();
