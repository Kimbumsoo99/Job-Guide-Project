import express from "express";
import {
  getDataCenterList,
  getDataStoreList,
  getHardMemory,
  getHost,
  getNetwork,
  getVMInfo,
  getVmAfterHostCPU,
  patchMemory,
  startPower,
  stopPower,
} from "../controllers/vmController";

const vmRouter = express.Router();

vmRouter.get("/cpu", getVmAfterHostCPU);
vmRouter.get("/info", getVMInfo);
vmRouter.get("/d/center", getDataCenterList);
vmRouter.get("/d/store", getDataStoreList);
vmRouter.get("/host", getHost);
vmRouter.get("/network", getNetwork);
vmRouter.get("/memory", getHardMemory);
vmRouter.get("/patch/memory", patchMemory);
vmRouter.get("/stop/power", stopPower);
vmRouter.get("/start/power", startPower);

export default vmRouter;
