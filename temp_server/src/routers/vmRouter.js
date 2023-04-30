import express from "express";
import { getAddBasicInfo, postAddBasicInfo } from "../controllers/vmController";
import { getCloudData } from "../controllers/cloudData";
import { protectorMiddleware } from "../middlewares";
import { patchMemory, startPower, stopPower } from "../controllers/vmChangeSet";
import { testHostInfo } from "../controllers/Test";

const vmRouter = express.Router();

vmRouter
  .route("/")
  .all(protectorMiddleware)
  .get(getAddBasicInfo)
  .post(postAddBasicInfo);

vmRouter.get("/data", getCloudData);
vmRouter.get("/test", testHostInfo);
vmRouter.get("/patch/memory", patchMemory);
vmRouter.get("/stop/power", stopPower);
vmRouter.get("/start/power", startPower);

export default vmRouter;
