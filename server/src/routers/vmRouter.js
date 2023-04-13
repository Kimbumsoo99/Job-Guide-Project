import express from "express";
import { getVmAfterHostCPU } from "../controllers/vmController";

const vmRouter = express.Router();

vmRouter.get("/cpu", getVmAfterHostCPU);

export default vmRouter;
