import { getSessionId } from "./headerGet";
import {
  getDataCenterList,
  getDataStoreList,
  getHardMemory,
  getHost,
  getNetwork,
  getVMInfo,
} from "./vmController";
import User from "../models/User";

export const cloudData = async (req, res) => {};

export const getCloudData = async (req, res) => {
  console.log(req.query);

  const {
    session: {
      user: { _id },
    },
    query: { vs_id, vs_pw, vs_ip },
  } = req;
  console.log("유저 정보");
  console.log("user");
  //const user = await User.findById(_id);
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

    const updatedUser = await User.findByIdAndUpdate(
      _id,
      {
        $push: {
          vsphere: {
            vs_id,
            vs_pw,
            vs_ip,
            info: cloudData,
          },
        },
      },
      { new: true } // 최근 업데이트 된 데이터로 변경
    );
    req.session.user = updatedUser;
    return res.send(cloudData);
  } catch (err) {
    console.log(err);
    return res.status(500).send("Error");
  }
};
