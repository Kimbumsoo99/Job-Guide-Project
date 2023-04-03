const axios = require("axios");

const username = "administrator@vsphere.local";
const password = "123Qwer!";
const hostIP = "192.168.0.102";

const getSessionId = async () => {
  const data = {};
  const config = {
    headers: {
      "Content-Type": "application/json",
      Authorization:
        "Basic " + Buffer.from(username + ":" + password).toString("base64"),
    },
  };

  try {
    const response = await axios.post(
      `https://${hostIP}/rest/com/vmware/cis/session`,
      data,
      config
    );
    console.log("JSON 객체 값:");
    console.log(response.data);
    return response.data.value;
  } catch (error) {
    console.error(error);
  }
};

export const hostAxios = async (req, res) => {
  try {
    const sessionId = await getSessionId();
    console.log(sessionId);

    const vmwareHeaders = {
      "Content-Type": "application/json",
      Authorization:
        "Basic " + Buffer.from(username + ":" + password).toString("base64"),
      "vmware-api-session-id": sessionId,
    };

    const options = {
      headers: vmwareHeaders,
      rejectUnauthorized: false,
    };

    const response = await axios.get(
      `https://${hostIP}/rest/vcenter/vm`,
      options
    );
    console.log("모든 가상 머신 정보:");
    console.log(response.data);
    return res.send(response.data);
  } catch (error) {
    console.error(error);
  }
};
