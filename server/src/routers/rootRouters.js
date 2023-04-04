import express from "express";
import {
  getVmAfterHostCPU,
  home,
  hostGetSessionGetVM,
  hostSesssionCreate,
  preGetSessionId,
} from "../controllers/temp";
import { hostAxios } from "../controllers/tempAxios";
import { getSessionDifIPAddr } from "../controllers/diffIPAddr";
import { getSessionDifUsername } from "../controllers/diffUsername";
import { noBasicAPI } from "../controllers/noBasicAPI";

const rootRouter = express.Router();

rootRouter.get("/", home);
rootRouter.get("/session/pre", preGetSessionId);
rootRouter.get("/session/api", hostSesssionCreate);
rootRouter.get("/host/nomal", hostGetSessionGetVM);
rootRouter.get("/host/axios", hostAxios);
// dif/ip 대신 host로 변경
rootRouter.get("/dif/ip", getVmAfterHostCPU);
rootRouter.get("/dif/username", getSessionDifUsername);
rootRouter.get("/basic/no", noBasicAPI);

export default rootRouter;
