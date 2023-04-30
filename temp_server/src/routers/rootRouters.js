import express from "express";
import { home } from "../controllers/vmController";
import {
  getJoin,
  getLogin,
  getLogout,
  postJoin,
  postLogin,
} from "../controllers/userController";
import { hostPage } from "../controllers/Test";

const rootRouter = express.Router();

rootRouter.get("/", home);
rootRouter.route("/login").get(getLogin).post(postLogin);
rootRouter.route("/join").get(getJoin).post(postJoin);
rootRouter.get("/logout", getLogout);
rootRouter.get("/host", hostPage);

export default rootRouter;
