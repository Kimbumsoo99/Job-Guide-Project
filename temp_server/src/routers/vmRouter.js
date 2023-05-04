import express from "express";
import {
  getAddBasicInfo,
  getHost,
  postAddBasicInfo,
} from "../controllers/vmController";
import { getCloudData } from "../controllers/cloudData";
import { protectorMiddleware } from "../middlewares";
import { patchMemory, startPower, stopPower } from "../controllers/vmChangeSet";
import { testGetHost } from "../tests/Test";

const vmRouter = express.Router();

vmRouter
  .route("/")
  .all(protectorMiddleware)
  .get(getAddBasicInfo)
  .post(postAddBasicInfo);

vmRouter.get("/data", getCloudData);
vmRouter.get("/data/t", testGetHost);
vmRouter.get("/patch/memory", patchMemory);
vmRouter.get("/stop/power", stopPower);
vmRouter.get("/start/power", startPower);

//
//Test 코드
vmRouter.get("/host", testGetHost);

export default vmRouter;
