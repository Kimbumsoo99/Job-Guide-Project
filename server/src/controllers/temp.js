const https = require("https");
export const home = (req, res) => res.render("home");

export const host = (req, res) => {
  const username = "administrator@vsphere.local";
  const password = "123Qwer!";
  const host = "192.168.0.102";
  const vmwareHeaders = {
    "Content-Type": "application/json",
    Authorization:
      "Basic " + Buffer.from(username + ":" + password).toString("base64"),
    
  };

  const options = {
    headers: {
      ...vmwareHeaders,
      "User-Agent": "Mozilla/5.0",
    },
    rejectUnauthorized: false
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
      return res.send(vms);

    });
  });
};

export const host2 = (request,res)=>{
  const username = "administrator@vsphere.local";
  const password = "123Qwer!";
  const host = "192.168.0.102";
  const data = JSON.stringify({});

  const options = {
    hostname: host,
    port: 443,
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
}