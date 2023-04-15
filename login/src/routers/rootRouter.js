import express from "express";
import {
  getJoin,
  getLogin,
  home,
  postJoin,
  postLogin,
} from "../controllers/userController";
import { localsMiddleware } from "../middlewares";

const rootRouter = express.Router();

rootRouter.get("/", home);
rootRouter.route("/login").get(getLogin).post(postLogin);
rootRouter.route("/join").get(getJoin).post(postJoin);

export default rootRouter;
