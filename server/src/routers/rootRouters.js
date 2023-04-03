import express from "express";
import { home, hostGetSessionGetVM } from "../controllers/temp";
import { hostAxios } from "../controllers/tempAxios";

const rootRouter = express.Router();

rootRouter.get("/", home);
rootRouter.get("/host", hostGetSessionGetVM);
rootRouter.get("/host/axios", hostAxios);

export default rootRouter;
