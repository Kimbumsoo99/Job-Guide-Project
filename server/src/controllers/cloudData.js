import User from "../models/User";
import { getSessionId } from "./headerGet";
import { getHost, getVMList, getVMInfo } from "./vmController";

export const getCloudHost = async (req, res) => {
  console.log("getCloudHost 호출");
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
        req.session.sessionId = sessionId;
        console.log("sessionId Session에 등록");
        console.log(sessionId);
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

export const getCloudVMList = async (
  tokenID,
  vsphereId,
  vspherePw,
  vcenterIp,
  hosts
) => {
  console.log("\ngetCloudVMList 호출\n");
  console.log(tokenID);
  const sessionId = tokenID
    ? tokenID
    : await getSessionId(vsphereId, vspherePw, vcenterIp);
  const vmList = await getVMList(sessionId, vcenterIp, hosts);
  console.log("return온 vmList 확인");
  console.log(vmList);
  return vmList;
};

/**
 * /hosts/get-vm GET 요청시 동작 함수
 *
 * query에 host 이름, vSphere 정보를 토대로 해당 host 하위 VM List를 가져옴.
 *
 * 이후 가져온 VM List를 User 정보에 host에 저장 후 해당 페이지 출력하는 함수로 redircet
 * @returns
 */
export const getCloudVM = async (req, res) => {
  console.log("\ngetCloudVM 호출\n");
  console.log(req.query);
  let sessionId;

  const {
    session: {
      user: { _id },
    },
  } = req;
  if (!_id) {
    console.log("_id 세션 만료");
    return res.redirect("/").statusCode(400);
  }
  sessionId = session.sessionId
    ? session.sessionId
    : getSessionId(vs_id, vs_pw, vs_ip);

  console.log("sessionId 값 출력");
  console.log(sessionId);
  const { hosts, vs_id, vs_pw, vs_ip } = req.query ? req.query : null;
  if (vs_id && vs_pw && vs_ip && hosts) {
    try {
      console.log(req.session.user.vsphere[0]);
      console.log(req.session.user.vsphere[0].info.hostInfo.value);
      //console.log(req.session.user.vsphere[0].info.hostInfo.value[0]);
      const vmList = await getCloudVMList(
        sessionId,
        vs_id,
        vs_pw,
        vs_ip,
        hosts
      );
      console.log("\n다시 getCloudVM부터 시작\n");
      console.log("vmList 부터");
      console.log(vmList);

      vmList.value.forEach((vm) => {
        vm.info = getVMInfo(vm.vm, sessionId);
      });
      /* 이곳에 vmInfo 가져오는 로직 추가하기
       */

      const updatedUser = await User.findByIdAndUpdate(
        {
          _id,
          "vsphere.vs_id": vs_id,
          "vsphere.vs_pw": vs_pw,
          "vsphere.vs_ip": vs_ip,
          "vsphere.info.hostInfo.value.host": hosts, // host가 host-36006인 객체를 찾음
        },
        {
          $set: {
            "vsphere.$[outer].info.hostInfo.value.$[inner].vmInfo": vmList,
          },
        },
        {
          new: true, // 최근 업데이트 된 데이터로 변경
          arrayFilters: [
            { "outer.vs_id": vs_id }, // vs_id가 일치하는 객체를 찾음
            { "inner.host": hosts }, // host가 host-36006인 객체를 찾음
          ],
        }
      );
      req.session.user = updatedUser;
      return res.redirect(
        `/hosts/vms?hosts=${hosts}&vs_id=${vs_id}&vs_ip=${vs_ip}`
      );
    } catch (err) {
      console.log(err);
      return res.redirect("/").statusCode(400);
    }
  } else {
    return res.redirect(`/hosts/vms`);
  }
  //return res.send(vmList);
};
