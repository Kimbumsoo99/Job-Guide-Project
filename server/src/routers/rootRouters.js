import express from "express";
import {
  getMetrics,
  getTask,
  home,
  hostPageRender,
  hostVMPageRender,
} from "../controllers/vmController";
import {
  getJoin,
  getLogin,
  getLogout,
  postJoin,
  postLogin,
} from "../controllers/userController";
import { getCloudVM } from "../controllers/cloudData";
import { getCPUUsagefucn } from "../controllers/vRealization";
import { getRealResources, getVCenterId } from "../controllers/headerGet";
import {
  getRealCpuUsageV2,
  getRealMemUsage,
  getRealResources0525,
  getRealResourcesJSON,
  getRealdiskUsage,
} from "../controllers/vRealize";
import {
  get525Host,
  get525VMInfo,
  get525VMList,
} from "../controllers/0525Temp";

const rootRouter = express.Router();

// 실제 서비스 부분이라 지우면 안되는 부분
rootRouter.get("/", home);
rootRouter.route("/login").get(getLogin).post(postLogin);
rootRouter.route("/join").get(getJoin).post(postJoin);
rootRouter.get("/logout", getLogout);
// 실제 서비스 부분이라 지우면 안되는 부분

rootRouter.route("/hosts").get(hostPageRender);
rootRouter.route("/hosts/get-vm").get(getCloudVM);
rootRouter.route("/hosts/vms").get(hostVMPageRender);

rootRouter.get("/real/cpu", getCPUUsagefucn);
rootRouter.get("/real/token", getVCenterId);
rootRouter.get("/real/res", getRealResources);

//테스트 코드
rootRouter.get("/test/real/v2", getRealCpuUsageV2); //테스트 성공(0515)
rootRouter.get("/test/task", getTask);
rootRouter.get("/test/metrics", getMetrics);

//테스트 코드 0523
rootRouter.get("/test/real/v2/cpu", getRealCpuUsageV2);
rootRouter.get("/test/real/v2/mem", getRealMemUsage);
rootRouter.get("/test/real/v2/disk", getRealdiskUsage);

rootRouter.get("/test/detail", getRealResources0525);

rootRouter.get("/test/real/v2/res", getRealResourcesJSON);

//테스트 코드 0525
rootRouter.get("/json/host", get525Host);
rootRouter.get("/json/vmlist", get525VMList);
rootRouter.get("/json/vminfo", get525VMInfo);
rootRouter.get("/json/real", getRealResources0525);
export default rootRouter;
