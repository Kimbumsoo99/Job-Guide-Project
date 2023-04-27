import { getSessionId } from "./headerGet";
import {
  getDataCenterList,
  getDataStoreList,
  getHardMemory,
  getHost,
  getNetwork,
  getVMInfo,
} from "./vmControllerTest";
import User from "../models/User";

export const getCloudData = async (req, res) => {
  const {
    session: {
      user: { _id },
    },
  } = req;
  console.log("유저 정보");
  console.log("user");
  const user = await User.findById(_id);
  const vs_id = user.vsphere[0].vs_id;
  const vs_pw = user.vsphere[0].vs_pw;
  const vs_ip = user.vsphere[0].vs_ip;
  try {
    const sessionId = await getSessionId(vs_id, vs_pw, vs_ip);
    const vmInfo = await getVMInfo(sessionId);
    const dataCenterList = await getDataCenterList(sessionId);
    const dataStoreList = await getDataStoreList(sessionId);
    const hostInfo = await getHost(sessionId);
    const networkInfo = await getNetwork(sessionId);
    const memoryInfo = await getHardMemory(sessionId);

    const cloudData = {
      vmInfo,
      dataCenterList,
      dataStoreList,
      hostInfo,
      networkInfo,
      memoryInfo,
    };

    console.log(cloudData);
    user.vsphere[0].info = cloudData;
    console.log("유저 정보");
    console.log(user);
    return res.send(cloudData);
  } catch (error) {
    console.error(error);
    return res.status(500).send("Error");
  }
};
