import express from "express";
import {
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
import { getVRealTokenJson } from "../controllers/vRealize";

const rootRouter = express.Router();

rootRouter.get("/", home);
rootRouter.route("/login").get(getLogin).post(postLogin);
rootRouter.route("/join").get(getJoin).post(postJoin);
rootRouter.get("/logout", getLogout);

rootRouter.route("/hosts").get(hostPageRender);
rootRouter.route("/hosts/get-vm").get(getCloudVM);
rootRouter.route("/hosts/vms").get(hostVMPageRender);

rootRouter.get("/real/cpu", getCPUUsagefucn);
rootRouter.get("/real/token", getVCenterId);
rootRouter.get("/real/res", getRealResources);

rootRouter.get("/test/real/token", getVRealTokenJson);
export default rootRouter;
