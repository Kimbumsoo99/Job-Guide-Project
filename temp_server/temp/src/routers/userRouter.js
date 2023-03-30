import express from "express";

const userRouter = express.Router();

const handleProfile = (req, res) =>
  res.send(`
    <h1>여기는 유저 정보!</h1>
    <h1><a href="http://localhost:4000/">메인 이동</a></h1>
    <h1><a href="http://localhost:4000/board">게시판 이동</a></h1>
    <h1><a href="http://localhost:4000/users">유저 이동</a></h1>
    `);
userRouter.get("/", handleProfile);

export default userRouter;
