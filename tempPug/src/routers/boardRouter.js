import express from "express";
import { view } from "../controllers/boardController";

const boardRouter = express.Router();

boardRouter.get("/", view);

export default boardRouter;
