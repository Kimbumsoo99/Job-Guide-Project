import express from "express";
import { home, host } from "../controllers/temp";

const rootRouter = express.Router();

rootRouter.get("/", home);
rootRouter.get("/host", host);

export default rootRouter;
