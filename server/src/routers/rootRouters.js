import express from "express";
import {
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
rootRouter.get("/dif/ip", getSessionDifIPAddr);
rootRouter.get("/dif/username", getSessionDifUsername);
rootRouter.get("/basic/no", noBasicAPI);

export default rootRouter;
