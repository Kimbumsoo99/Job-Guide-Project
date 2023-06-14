import express from "express";
import { home } from "../controllers/vmController";
import {
    getJoin,
    getLogin,
    getLogout,
    getSendMail,
    postJoin,
    postLogin,
} from "../controllers/userController";
import { protectorMiddleware } from "../middlewares";
import { getDatastoreVM, getFolderVM } from "../apis/vCenterAPI";

const rootRouter = express.Router();

//0527 이 사이만 최종 코드

rootRouter.get("/", home);
rootRouter.route("/login").get(getLogin).post(postLogin);
rootRouter.route("/logout").all(protectorMiddleware).get(getLogout);
rootRouter.route("/join").get(getJoin).post(postJoin);
rootRouter.route("/send").all(protectorMiddleware).get(getSendMail);

//0527 이 사이만 최종 코드

rootRouter.route("/test/folder").all(protectorMiddleware).get(getFolderVM);
rootRouter.route("/test/store").all(protectorMiddleware).get(getDatastoreVM);

export default rootRouter;
