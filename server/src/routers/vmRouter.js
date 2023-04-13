import express from "express";
import { getVMInfo, getVmAfterHostCPU } from "../controllers/vmController";

const vmRouter = express.Router();

vmRouter.get("/cpu", getVmAfterHostCPU);
vmRouter.get("/info", getVMInfo);

export default vmRouter;
