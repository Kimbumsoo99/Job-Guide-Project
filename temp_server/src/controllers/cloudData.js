import { getSessionId } from "./headerGet";
import {
  getDataCenterList,
  getDataStoreList,
  getHardMemory,
  getHost,
  getNetwork,
  getVMInfo,
} from "./vmControllerTest";

export const getCloudData = async (req, res) => {
  try {
    const sessionId = await getSessionId();
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
    return res.send(cloudData);
  } catch (error) {
    console.error(error);
    return res.status(500).send("Error");
  }
};
