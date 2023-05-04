import express from "express";
import { getVMList, home, hostPageRender } from "../controllers/vmController";
import {
  getJoin,
  getLogin,
  getLogout,
  postJoin,
  postLogin,
} from "../controllers/userController";
import { getCloudVM } from "../controllers/cloudData";

const rootRouter = express.Router();

rootRouter.get("/", home);
rootRouter.route("/login").get(getLogin).post(postLogin);
rootRouter.route("/join").get(getJoin).post(postJoin);
rootRouter.get("/logout", getLogout);
rootRouter.route("/hosts").get(hostPageRender);
rootRouter.route("/hosts/vm").get(getCloudVM);

export default rootRouter;
