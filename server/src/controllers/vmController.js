import { resolve } from "path";
import { getSessionId } from "./headerGet";
import { rejects } from "assert";

const https = require("https");

const username = "administrator@vsphere.local";
const password = "123Qwer!";
const hostIP = "192.168.0.102";

export const home = (req, res) => res.render("home");

export const getVmAfterHostCPU = async (req, res) => {
  try {
    const sessionIdJson = await getSessionId();    //sessionIdJson == vmware-api-session-id
    console.log("SessionID GET After: " +sessionIdJson); // 이부분에서 가져온 Session ID를 확인
    console.log("Error SessionID: " +sessionIdJson.value); // 이 부분은 에러
    
    const vmwareHeaders = {
      "Content-Type": "application/json",
      Authorization:
        "Basic " + Buffer.from(username + ":" + password).toString("base64"),
      "vmware-api-session-id": sessionIdJson,
    };

    const options = {
      headers: vmwareHeaders,
      rejectUnauthorized: false,
    };

    https.get(`https://${hostIP}/rest/vcenter/vm`, options, (response) => {
      let data = "";

      response.on("data", (chunk) => {
        data += chunk;
      });

      response.on("end", () => {
        const vms = JSON.parse(data);
        console.log("모든 가상 머신 정보:");
        console.log(vms);
        
        return res.send(vms);
        
        return https.get(`https://${hostIP}/rest/vcenter/vm/${vmId}`, options, (response) => {
        let data = "";

        response.on("data", (chunk) => {
          data += chunk;
        });
      
        response.on("end", () => {
          const cpuInfo = JSON.parse(data);
          console.log("CPU 사용량 정보:");
          console.log(cpuInfo);
          return res.send(cpuInfo);
          });
        });
      });
    });
  } catch (error) {
    console.error(error);
    return res.status(500).send("Error");
  }
};

export const getVMPromise = async (req,res) =>{
  try {
    const sessionIdJson = await getSessionId(); //sessionIdJson == vmware-api-session-id
    console.log("SessionID GET After: " + sessionIdJson); // 이부분에서 가져온 Session ID를 확인

    const vmwareHeaders = {
      "Content-Type": "application/json",
      Authorization:
        "Basic " + Buffer.from(username + ":" + password).toString("base64"),
      "vmware-api-session-id": sessionIdJson,
    };

    const options = {
      headers: vmwareHeaders,
      rejectUnauthorized: false,
    };

    const res = await new Promise((resolve,reject)=>{

    })
    https.get(`https://${hostIP}/rest/vcenter/host`, options, (response) => {
      let data = "";

      response.on("data", (chunk) => {
        data += chunk;
      });

      response.on("end", () => {
        const vms = JSON.parse(data);
        console.log("모든 가상 머신 정보:");
        console.log(vms);

        return https.get(
          `https://${hostIP}/rest/vcenter/vm/${vmId}`,
          options,
          (response) => {
            let data = "";

            response.on("data", (chunk) => {
              data += chunk;
            });

            response.on("end", () => {
              const vmInfo = JSON.parse(data);
              console.log("CPU 사용량 정보:");
              console.log(vmInfo);
              return vmInfo;
            });
          }
        );
      });
    });
  } catch (error) {
    console.error(error);
    return res.status(500).send("Error");
  }
}