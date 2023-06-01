const express = require("express");
const { default: rootRouter } = require("./routers/rootRouters");
import morgan from "morgan";
import MongoStore from "connect-mongo";
import session from "express-session";
import vspherRouter from "./routers/vsphereRouter";
import favicon from "serve-favicon";
import {
    localsMiddleware,
    notServerURLMiddleware,
    serverErrorMiddleware,
} from "./middlewares";
import path from "path";

const app = express();

const logger = morgan("dev", {
    skip: (req) => {
        return (
            req.originalUrl.includes("/assets/") ||
            req.originalUrl.includes("/uploads/")
        );
    },
});
app.use(favicon(path.join(__dirname, "..", "uploads", "favicon.ico")));
app.set("view engine", "pug");
app.set("views", process.cwd() + "/src/views");

app.use(logger); //morgan
app.use(express.urlencoded({ extended: true })); //express가 form의 value들을 이해할 수 있도록 함.
// app.use(express.text()); express에 내장된 미들웨어 기능으로 body-parser를 기반으로 request payload로 전달한 문자열을 파싱
app.use(express.json());

app.use(
    session({
        secret: process.env.SECRET || "secret_key",
        resave: false,
        saveUninitialized: false, //로그인한 사용자만 쿠키 정보 저장
        /*cookie: {
      maxAge: 10000, //세션 정보 유지 시간
    },*/
        store: MongoStore.create({
            mongoUrl: "mongodb://localhost:27017/testlogin",
            ttl: 3600, //초 단위
            autoRemove: "interval",
            autoRemoveInterval: 60, // In minutes. Default
            touchAfter: 60, // time period in seconds
        }),
    })
);

app.use(localsMiddleware);

app.use("/uploads", express.static("uploads"));
app.use("/assets", express.static("assets"));
app.use("/", rootRouter);
app.use("/vs", vspherRouter);
app.use(notServerURLMiddleware); //404 Not Found
app.use(serverErrorMiddleware); // 에러 처리 미들웨어

export default app;
