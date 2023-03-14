import express from "express";
import { getUpload, postUpload, view } from "../controllers/boardController";

const boardRouter = express.Router();

boardRouter.get("/", view);
boardRouter.route("/write").get(getUpload).post(postUpload);

export default boardRouter;
