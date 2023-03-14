import express from "express";

const userRouter = express.Router();

const handleProfile = (req, res) => res.send("<h1>유저 정보</h1>");
userRouter.get("/", handleProfile);

export default userRouter;
