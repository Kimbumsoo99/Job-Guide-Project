import express from "express";
import {
  getDataCenterList,
  getDataStoreList,
  getHost,
  getNetwork,
  getVMInfo,
  getVmAfterHostCPU,
  patchMemory,
} from "../controllers/vmController";

const vmRouter = express.Router();

vmRouter.get("/cpu", getVmAfterHostCPU);
vmRouter.get("/info", getVMInfo);
vmRouter.get("/d/center", getDataCenterList);
vmRouter.get("/d/store", getDataStoreList);
vmRouter.get("/host", getHost);
vmRouter.get("/network", getNetwork);
vmRouter.get("/patch/memory", patchMemory);

export default vmRouter;
