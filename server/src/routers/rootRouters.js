import express from "express";
import { home, host, host2 } from "../controllers/temp";

const rootRouter = express.Router();

rootRouter.get("/", home);
rootRouter.get("/host", host);
rootRouter.get("/host2",host2)

export default rootRouter;
