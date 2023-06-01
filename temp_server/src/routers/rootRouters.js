import express from "express";
import { getSendMail, home } from "../controllers/vmController";
import {
    getJoin,
    getLogin,
    getLogout,
    postJoin,
    postLogin,
} from "../controllers/userController";
import {
    testGetHost,
    testHostInfo,
    testInterval,
    testVMInfo,
    testVMPage,
} from "../tests/Test";
import { localsMiddleware, protectorMiddleware } from "../middlewares";
import { getDatastoreVM, getFolderVM } from "../apis/vCenterAPI";

const rootRouter = express.Router();

//0527 이 사이만 최종 코드

rootRouter.get("/", home);
rootRouter.route("/login").get(getLogin).post(postLogin);
rootRouter.get("/logout", getLogout);
rootRouter.route("/join").get(getJoin).post(postJoin);
rootRouter.route("/send").get(getSendMail);

//0527 이 사이만 최종 코드

rootRouter.route("/login").get(getLogin).post(postLogin);
rootRouter.route("/join").get(getJoin).post(postJoin);
rootRouter.get("/logout", getLogout);
rootRouter.route("/test").all(protectorMiddleware).get(testGetHost);

//
//Test 코드
//rootRouter.get("/test/host", testGetVM);
rootRouter.route("/test/page").get(testHostInfo);
rootRouter.get("/host/vm", testVMPage);
rootRouter.get("/test/page/vm", testVMInfo);

rootRouter.get("/test/time", testInterval);

rootRouter.get("/test/folder", getFolderVM);
rootRouter.get("/test/store", getDatastoreVM);

export default rootRouter;
