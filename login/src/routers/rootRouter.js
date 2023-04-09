import express from "express";
import { getJoin, getLogin, home } from "../controllers/userController";

const rootRouter = express.Router();

rootRouter.get("/", home);
rootRouter.route("/login").get(getLogin);
rootRouter.route("/join").get(getJoin);

export default rootRouter;
