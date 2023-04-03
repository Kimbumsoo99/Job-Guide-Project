const axios = require("axios");

const vcenterServer = "https://192.168.0.102";
const username = "administrator@vsphere.local";
const password = "123Qwer!";
const vmName = "VM1";

const loginUrl = `${vcenterServer}/rest/com/vmware/cis/session`;
const vmUrl = `${vcenterServer}/rest/vcenter/vm?filter.names.1=${vmName}`;

axios
  .post(loginUrl, null, {
    auth: {
      username: username,
      password: password,
    },
  })
  .then((response) => {
    const sessionId = response.headers["vmware-api-session-id"];
    axios
      .get(vmUrl, {
        headers: {
          "vmware-api-session-id": sessionId,
        },
      })
      .then((response) => {
        const vm = response.data.value[0];
        console.log(`Virtual Machine Name: ${vm.name}`);
        console.log(`Virtual Machine Power State: ${vm.power_state}`);
      })
      .catch((error) => {
        console.log(error);
      });
  })
  .catch((error) => {
    console.log(error);
  });
