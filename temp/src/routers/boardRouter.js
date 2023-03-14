import express from "express";

const boardRouter = express.Router();

const handleBoard = (req, res) => res.send("<h1>게시판 부분</h1>");
boardRouter.get("/", handleBoard);

export default boardRouter;
