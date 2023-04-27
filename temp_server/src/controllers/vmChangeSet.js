import { getSessionId } from "./headerGet";
import { getOptions, getVMName } from "./vmControllerTest";
const https = require("https");
import User from "../models/User";

let hostIP = "192.168.0.102";

const callAPI = async (url, method, data, sessionId) => {
  const options = getOptions(sessionId);

  options.hostname = hostIP;
  options.path = url;
  options.port = 443;
  options.method = method;

  console.log(options);
  const apiReq = https.request(options, (apiRes) => {
    console.log(`statusCode: ${apiRes.statusCode}`);

    apiRes.on("data", (d) => {
      process.stdout.write(d);
    });
  });

  apiReq.on("error", (error) => {
    console.error(error);
  });

  apiReq.write(data);
  apiReq.end();
  console.log("요청 성공");
};

export const patchMemoryTest = async (request, response) => {
  console.log(request);
  const {
    session: {
      user: { _id },
    },
  } = request;
  console.log(user);
  const user = await User.findById(_id);
  const vs_id = user.vsphere[0].vs_id;
  const vs_pw = user.vsphere[0].vs_pw;
  const vs_ip = user.vsphere[0].vs_ip;
  try {
    const sessionId = await getSessionId(vs_id, vs_pw, vs_ip);
    const vmId = await getVMName(sessionId);

    const postData = JSON.stringify({
      spec: {
        hot_add_enabled: true,
        size_MiB: 1024, // Set the new memory size in MiB
      },
    });

    await callAPI(
      `/rest/vcenter/vm/${vmId}/hardware/memory`,
      "PATCH",
      postData,
      sessionId
    );
    return response.redirect("/");
  } catch (error) {
    console.error(error);
    return response.status(500).send("Error");
  }
};

export const executePowerAction = async (request, response, action) => {
  const {
    session: {
      user: { _id },
    },
  } = request;
  const user = await User.findById(_id);
  const vs_id = user.vsphere[0].vs_id;
  const vs_pw = user.vsphere[0].vs_pw;
  const vs_ip = user.vsphere[0].vs_ip;
  try {
    const sessionId = await getSessionId(vs_id, vs_pw, vs_ip);
    const vm = await getVMName(sessionId);
    const data = JSON.stringify({});

    await callAPI(
      `/rest/vcenter/vm/${vm}/power/${action}`,
      "POST",
      data,
      sessionId
    );

    return response.redirect("/");
  } catch (error) {
    console.error(error);
    return response.status(500).send("Error");
  }
};

export const stopPowerTest = async (request, response) => {
  await executePowerAction(request, response, "stop");
};

export const startPowerTest = async (request, response) => {
  await executePowerAction(request, response, "start");
};
