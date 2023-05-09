import express from "express";
import {
  getVMList,
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
import { getCPUUsagefunction } from "../controllers/vRealization";

const rootRouter = express.Router();

rootRouter.get("/", home);
rootRouter.route("/login").get(getLogin).post(postLogin);
rootRouter.route("/join").get(getJoin).post(postJoin);
rootRouter.get("/logout", getLogout);

rootRouter.route("/hosts").get(hostPageRender);
rootRouter.route("/hosts/get-vm").get(getCloudVM);
rootRouter.route("/hosts/vms").get(hostVMPageRender);
rootRouter.get("/real/cpu", getCPUUsagefunction);

export default rootRouter;
