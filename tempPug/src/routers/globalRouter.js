import express from "express";
import { home } from "../controllers/boardController";
import { getLogin, logout, postLogin } from "../controllers/userController";

const globalRouter = express.Router();

globalRouter.get("/", home);
globalRouter.route("/login").get(getLogin).post(postLogin);
globalRouter.get("/logout", logout);

export default globalRouter;
