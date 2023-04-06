import express from "express";
import { home } from "../controllers/vmController";
import { getJoin, getLogin } from "../controllers/userController";

const rootRouter = express.Router();

rootRouter.get("/", home);
rootRouter.route("/login").get(getLogin);
rootRouter.route("/join").get(getJoin);

export default rootRouter;
