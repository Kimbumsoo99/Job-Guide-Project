const express = require("express");
import morgan from "morgan"; // HTTP 요청과 응답에 대한 로그를 생성하는 미들웨어
import rootRouter from "./routers/rootRouter";
import MongoStore from "connect-mongo";
import session from "express-session";
import { localsMiddleware } from "./middlewares";
const app = express();
const logger = morgan("dev");

app.use(logger);

app.set("view engine", "pug");
// {process.cwd() == C:\GitRepositories\PrivateCloud_Project\login}
app.set("views", process.cwd() + "/src/views");

//body 관련
app.use(express.urlencoded({ extended: true })); //클라이언트에서 전송된 폼 데이터를 파싱
app.use(express.json()); //코드를 추가하면 req.body를 통해 JSON 형태의 데이터에 접근

app.use(
  session({
    secret: "secret_key",
    resave: false,
    saveUninitialized: false, //로그인한 사용자만 쿠키 정보 저장
    /*cookie: {
      maxAge: 10000, //세션 정보 유지 시간
    },*/
    store: MongoStore.create({
      mongoUrl: "mongodb://localhost:27017/testlogin",
      ttl: 30, //초 단위
      autoRemove: "interval",
      autoRemoveInterval: 10, // In minutes. Default
    }),
  })
);

app.use(localsMiddleware);

app.use("/assets", express.static("assets")); //정적파일 넣는 용도
app.use("/", rootRouter);

export default app;
