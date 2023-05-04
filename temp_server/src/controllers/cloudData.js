import { getSessionId } from "./headerGet";
import {
  getDataCenterList,
  getDataStoreList,
  getHardMemory,
  getHost,
  getNetwork,
  getVMInfo,
  getVMName,
} from "./vmController";
import User from "../models/User";
import { testGetVMList } from "./Test";

export const cloudData = async (req, res) => {};

export const getCloudData = async (req, res) => {
  console.log(req.query);

  const {
    session: {
      user: { _id },
    },
  } = req;
  const { vs_id, vs_pw, vs_ip } = req.query ? req.query : null;

  console.log("유저 정보");
  console.log("user");
  //const user = await User.findById(_id);
  if (vs_id && vs_pw && vs_ip) {
    //쿼리 값 존재 시 -> 새롭게 등록
    try {
      //중복 여부 확인(IP 주소 중복 시)
      const isDuplicated = await User.exists({
        _id,
        "vsphere.vs_ip": vs_ip,
      });
      if (isDuplicated) {
        //IP주소가 중복 -> 같은 vCenter에 대한 값을 가져오는 것이므로 X
        console.log("Duplicate data");
        return redirect("/");
      } else {
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
        //return res.send(cloudData);
        return res.redirect("/test/page");
      }
    } catch (err) {
      console.log(err);
      return res.status(500).send("Error");
    }
  } else {
    // 쿼리 없으면 -> 그냥 기존 데이터 보여줌
    return res.redirect("/test/page");
  }
};

export const testGetHost = async (req, res) => {
  console.log(req.query);

  const {
    session: {
      user: { _id },
    },
  } = req;
  const { vs_id, vs_pw, vs_ip } = req.query ? req.query : null;

  if (vs_id && vs_pw && vs_ip) {
    //쿼리 값 존재 시 -> 새롭게 등록
    try {
      //중복 여부 확인(IP 주소 중복 시)
      const isDuplicated = await User.exists({
        _id,
        "vsphere.vs_ip": vs_ip,
      });
      if (isDuplicated) {
        //IP주소가 중복 -> 같은 vCenter에 대한 값을 가져오는 것이므로 X
        console.log("Duplicate data");
        return redirect("/");
      } else {
        const sessionId = await getSessionId(vs_id, vs_pw, vs_ip);
        const hostInfo = await getHost(sessionId);

        const updatedUser = await User.findByIdAndUpdate(
          _id,
          {
            $push: {
              vsphere: {
                vs_id,
                vs_pw,
                vs_ip,
                info: { hostInfo },
              },
            },
          },
          { new: true } // 최근 업데이트 된 데이터로 변경
        );
        req.session.user = updatedUser;
        return res.redirect("/test/page");
      }
    } catch (err) {
      console.log(err);
      return res.status(500).send("Error");
    }
  } else {
    // 쿼리 없으면 -> 그냥 기존 데이터 보여줌
    return res.redirect("/test/page");
  }
};

export const testGetVM = async (req, res) => {
  console.log(req.query);
  const {
    session: {
      user: { _id },
    },
  } = req;

  const { hosts, vs_id, vs_pw, vs_ip } = req.query ? req.query : null;

  const sessionId = await getSessionId(vs_id, vs_pw, vs_ip);
  const vmList = await testGetVMList(sessionId, vs_ip, hosts);

  return res.send(vmList);
};
