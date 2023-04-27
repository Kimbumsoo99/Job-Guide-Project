import express from "express";
import {
  patchMemory,
  startPower,
  stopPower,
} from "../controllers/vmController";
import { getCloudData } from "../controllers/cloudData";
import {
  getAddBasicInfo,
  postAddBasicInfo,
} from "../controllers/vmControllerTest";
import { protectorMiddleware } from "../middlewares";
import {
  patchMemoryTest,
  startPowerTest,
  stopPowerTest,
} from "../controllers/vmChangeSet";

const vmRouter = express.Router();

//vmRouter.route("/").get(getAddBasicInfo).post(postAddBasicInfo);

vmRouter.get("/data", getCloudData);
vmRouter.get("/patch/memory", patchMemory);
vmRouter.get("/stop/power", stopPower);
vmRouter.get("/start/power", startPower);

// 테스트
vmRouter.get("/test/memory", patchMemoryTest);
vmRouter.get("/test/power/off", stopPowerTest);
vmRouter.get("/test/power/on", startPowerTest);

export default vmRouter;
