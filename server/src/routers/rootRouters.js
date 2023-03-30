import express from "express";
import { home, host, host2, host3 } from "../controllers/temp";

const rootRouter = express.Router();

rootRouter.get("/", home);
rootRouter.get("/host", host);
rootRouter.get("/host2",host2)
rootRouter.get("/host2",host3)


export default rootRouter;
