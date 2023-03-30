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
      return res.send(vms);

    });
  });
};
