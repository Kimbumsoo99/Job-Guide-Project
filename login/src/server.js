const express = require("express");
import morgan from "morgan"; // HTTP 요청과 응답에 대한 로그를 생성하는 미들웨어
import rootRouter from "./routers/rootRouter";
const app = express();
const PORT = process.env.PORT || 3500;
const logger = morgan("dev");

app.use(logger);

app.set("view engine", "pug");
// {process.cwd() == C:\GitRepositories\PrivateCloud_Project\login}
app.set("views", process.cwd() + "/src/views");

//body 관련
app.use(express.urlencoded({ extended: true })); //클라이언트에서 전송된 폼 데이터를 파싱
app.use(express.json()); //코드를 추가하면 req.body를 통해 JSON 형태의 데이터에 접근

app.use("/assets", express.static("assets")); //정적파일 넣는 용도

app.use("/", rootRouter);

app.listen(PORT, () => {
  console.log(`✅ Login Server http://localhost:${PORT} 🚀`);
});
