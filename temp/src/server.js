import express from "express";
import morgan from "morgan";
import globalRouter from "./routers/globalRouter";
import userRouter from "./routers/userRouter";
import boardRouter from "./routers/boardRouter";
import favicon from "serve-favicon";

const PORT = 4000;

const app = express();
const logger = morgan("dev");

app.use(logger); //morgan GET, path, status code, 응답 시간 등 request에 대한 정보를 준다
app.use("/", globalRouter);
app.use("/users", userRouter);
app.use("/board", boardRouter);

app.listen(PORT, () => {
  console.log(`✅ Server listenting on port http://localhost:${PORT} 🚀`);
});
