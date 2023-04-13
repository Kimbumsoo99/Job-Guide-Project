import express from "express";
import {
  getDataCenterList,
  getDataStoreList,
  getHost,
  getVMInfo,
  getVmAfterHostCPU,
} from "../controllers/vmController";

const vmRouter = express.Router();

vmRouter.get("/cpu", getVmAfterHostCPU);
vmRouter.get("/info", getVMInfo);
vmRouter.get("/d/center", getDataCenterList);
vmRouter.get("/d/store", getDataStoreList);
vmRouter.get("/host", getHost);

export default vmRouter;
