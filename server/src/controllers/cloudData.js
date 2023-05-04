import User from "../models/User";
import { getSessionId } from "./headerGet";
import { getHost, getVMList } from "./vmController";

export const getCloudHost = async (req, res) => {
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
        return res.redirect("/hosts");
      }
    } catch (err) {
      console.log(err);
      return res.status(500).send("Error");
    }
  } else {
    // 쿼리 없으면 -> 그냥 기존 데이터 보여줌
    return res.redirect("/hosts");
  }
};

export const getCloudVM = async (req, res) => {
  console.log(req.query);
  const {
    session: {
      user: { _id },
    },
  } = req;

  const { hosts, vs_id, vs_pw, vs_ip } = req.query ? req.query : null;

  const sessionId = await getSessionId(vs_id, vs_pw, vs_ip);
  const vmList = await getVMList(sessionId, vs_ip, hosts);

  return res.send(vmList);
};
