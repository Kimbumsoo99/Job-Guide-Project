import express from "express";
import morgan from "morgan";
import globalRouter from "./routers/globalRouter";
import userRouter from "./routers/userRouter";
import boardRouter from "./routers/boardRouter";
import session from "express-session";
import { localsMiddleware } from "./middlewares";
import favicon from "serve-favicon";
import path from "path";

const PORT = 4000;

const app = express();
const logger = morgan("dev");

app.use(favicon(path.join(__dirname, "public", "1.png")));
app.set("view engine", "pug");
app.set("views", process.cwd() + "/src/views");
app.use(logger); //morgan GET, path, status code, 응답 시간 등 request에 대한 정보를 준다

app.use(
  session({
    secret: "Hello!",
    resave: true,
    saveUninitialized: true,
  })
);

app.use((req, res, next) => {
  //res.locals.user = "김범수"
  req.sessionStore.all((error, sessions) => {
    next();
  });
});

app.use(localsMiddleware);
app.use("/", globalRouter);
app.use("/users", userRouter);
app.use("/board", boardRouter);

app.listen(PORT, () => {
  console.log(`✅ Server listenting on port http://localhost:${PORT} 🚀`);
});
