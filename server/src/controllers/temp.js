const https = require("https");
export const home = (req, res) => res.render("home");

export const host = (req, res) => {
  const username = "vSphere_username";
  const password = "vSphere_password";
  const host = "vCenter_Server_IP_Address";
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
      console.log("사용자 A의 가상 머신 정보:");
      const userAVMs = vms.value.filter((vm) => vm.owner === "userA");
      console.log(userAVMs);
      res.send(userAVMs);
    });
  });
};
