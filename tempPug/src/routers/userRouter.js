import express from "express";
import { profile } from "../controllers/userController";

const userRouter = express.Router();

userRouter.get("/", profile);

export default userRouter;
