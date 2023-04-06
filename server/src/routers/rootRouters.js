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
rootRouter.get("/dif/ip", getVmAfterHostCPU);

export default rootRouter;
