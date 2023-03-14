import express from "express";

const globalRouter = express.Router();

const handleMain = (req, res) => res.send("<h1>메인 화면</h1>");

globalRouter.get("/", handleMain);

export default globalRouter;
