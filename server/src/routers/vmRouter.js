import express from "express";
import { getVm } from "../controllers/vmController";

const vmRouter = express.Router();

vmRouter.get("/cpu", getVm);

export default vmRouter;
