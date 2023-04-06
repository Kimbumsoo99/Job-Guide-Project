const express = require("express");
const { default: rootRouter } = require("./routers/rootRouters");
import morgan from "morgan";
import vmRouter from "./routers/vmRouter";

const app = express();
const PORT = process.env.PORT || 4000;

const logger = morgan("dev");

app.set("view engine", "pug");
app.set("views", process.cwd() + "/src/views");

app.use(logger); //morgan
app.use(express.urlencoded({ extended: true })); //express가 form의 value들을 이해할 수 있도록 함.
// app.use(express.text()); express에 내장된 미들웨어 기능으로 body-parser를 기반으로 request payload로 전달한 문자열을 파싱
app.use(express.json());

app.use("/uploads", express.static("uploads"));
app.use("/", rootRouter);
app.use("/vm", vmRouter);

app.listen(PORT, () => {
  console.log(`✅ Server listening on port http://localhost:${PORT} 🚀`);
});
