import express from "express";

const globalRouter = express.Router();

const handleMain = (req, res) =>
  res.send(`
    <h1>여기는 메인!</h1>
    <h1><a href="http://localhost:4000/">메인 이동</a></h1>
    <h1><a href="http://localhost:4000/board">게시판 이동</a></h1>
    <h1><a href="http://localhost:4000/users">유저 이동</a></h1>
    `);

globalRouter.get("/", handleMain);

export default globalRouter;
