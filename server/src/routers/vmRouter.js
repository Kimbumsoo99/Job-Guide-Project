import express from "express";
import {
  patchMemory,
  startPower,
  stopPower,
  getAddBasicInfo,
  postAddBasicInfo,
} from "../controllers/vmController";
import { getCloudHost } from "../controllers/cloudData";
import { protectorMiddleware } from "../middlewares";
import {
  patchMemoryTest,
  startPowerTest,
  stopPowerTest,
} from "../controllers/vmChangeSet";

const vmRouter = express.Router();

//실제 서비스 부분이라 지우면 안됨
vmRouter
  .route("/")
  .all(protectorMiddleware)
  .get(getAddBasicInfo)
  .post(postAddBasicInfo);

vmRouter.get("/data", getCloudHost);
//실제 서비스 부분이라 지우면 안됨

vmRouter.get("/patch/memory", patchMemory);
vmRouter.get("/stop/power", stopPower);
vmRouter.get("/start/power", startPower);

// 테스트
vmRouter.get("/test/memory", patchMemoryTest);
vmRouter.get("/test/power/off", stopPowerTest);
vmRouter.get("/test/power/on", startPowerTest);

export default vmRouter;
